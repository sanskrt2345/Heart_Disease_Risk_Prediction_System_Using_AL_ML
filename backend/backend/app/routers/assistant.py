from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app import models, schemas, security

router = APIRouter(prefix="/api/assistant", tags=["assistant"])

# ---------------------------------------------------------------------------
# This is a lightweight, rule-based responder so the AI Assistant page works
# out of the box with zero external dependencies or API keys.
#
# To upgrade to a real LLM (recommended for production), replace the body of
# `generate_reply()` with a call to the Anthropic API, e.g.:
#
#   from anthropic import Anthropic
#   client = Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])
#   msg = client.messages.create(
#       model="claude-sonnet-4-6", max_tokens=500,
#       system="You are a cardiovascular health assistant. Not a doctor...",
#       messages=[{"role": "user", "content": user_message}],
#   )
#   return msg.content[0].text
# ---------------------------------------------------------------------------

_KEYWORD_REPLIES = [
    # --- Symptoms ---
    (["chest pain", "angina"], "Chest pain can have many causes, from muscular strain to cardiac issues. If it's severe, radiating, or paired with shortness of breath/sweating, seek emergency care immediately. Otherwise, mention it to your doctor at your next visit."),
    (["heart attack symptoms", "heart attack"], "Common heart attack warning signs: chest pressure/pain, pain spreading to the arm/jaw/back, shortness of breath, cold sweat, nausea, and lightheadedness. Women may have subtler symptoms like fatigue or indigestion. Call emergency services immediately if you suspect one -- don't drive yourself."),
    (["palpitations", "heart racing", "skipped beat"], "Occasional palpitations (fluttering, racing, or 'skipped' beats) are often harmless and linked to caffeine, stress, or dehydration. If they're frequent, prolonged, or come with dizziness/chest pain, get it checked -- it could indicate an arrhythmia."),
    (["arrhythmia", "irregular heartbeat", "afib", "atrial fibrillation"], "An arrhythmia is an irregular heartbeat -- too fast, too slow, or erratic. Atrial fibrillation (AFib) is common and raises stroke risk. An ECG is the standard way to diagnose it; treatment ranges from lifestyle changes to medication or procedures."),
    (["shortness of breath", "breathless", "breathing difficulty"], "Shortness of breath can be linked to heart or lung conditions, anxiety, or simply deconditioning. If it's new, worsening, or happens at rest, it needs prompt medical evaluation."),
    (["swelling", "edema", "swollen"], "Swelling in the legs/ankles can be a sign of the heart not pumping efficiently (fluid buildup), among other causes. If it's new, one-sided, or paired with breathlessness, see a doctor."),
    (["fatigue", "tired all the time"], "Persistent, unusual fatigue can sometimes signal heart issues (the heart working harder to pump blood), but has many other common causes too (sleep, anemia, thyroid). Worth mentioning at a check-up if it's ongoing."),

    # --- Cholesterol / lipids ---
    (["cholesterol"], "LDL ('bad') cholesterol above 130-160 mg/dL is generally considered elevated. Diet (less saturated fat, more fiber), exercise, and sometimes statins can help lower it -- your doctor can advise on targets for your situation."),
    (["ldl"], "LDL is often called 'bad' cholesterol because it can build up in artery walls. Under 100 mg/dL is typically considered optimal; higher levels raise cardiovascular risk, especially combined with other risk factors."),
    (["hdl"], "HDL is 'good' cholesterol -- it helps clear LDL from your bloodstream. Higher is generally better (above 40 mg/dL for men, 50 for women is a common benchmark). Exercise and healthy fats can help raise it."),
    (["triglycerides"], "Triglycerides are a type of fat in the blood; levels under 150 mg/dL are considered normal. High triglycerides are often linked to excess sugar/alcohol intake, obesity, or poorly controlled diabetes."),
    (["statin", "statins"], "Statins are medications that lower LDL cholesterol and are commonly prescribed for people at elevated cardiovascular risk. Whether you need one depends on your full risk profile -- that's a conversation for your doctor, not something to start or stop on your own."),

    # --- Blood pressure ---
    (["blood pressure", "bp", "hypertension"], "A resting blood pressure consistently above 130/80 mmHg is considered elevated. Reducing sodium, regular exercise, stress management, and limiting alcohol all help -- medication may also be needed, which your doctor can determine."),
    (["sodium", "salt intake", "low sodium"], "Most guidelines recommend under 2,300mg of sodium a day (about a teaspoon of salt), and even less if you have high blood pressure. Processed and restaurant food are usually the biggest sources -- more than the salt shaker itself."),
    (["potassium"], "Potassium helps balance sodium's effect on blood pressure. Bananas, potatoes, spinach, and beans are good sources. If you're on blood pressure or heart medication, check with your doctor before big changes -- some drugs interact with potassium levels."),

    # --- Lifestyle: exercise, diet, weight ---
    (["exercise", "activity", "workout"], "Aim for at least 150 minutes/week of moderate aerobic activity (e.g. brisk walking). Even short daily walks measurably reduce cardiovascular risk over time."),
    (["walking", "steps a day", "daily steps"], "Walking is one of the simplest heart-protective habits. Studies show benefits starting well below 10,000 steps/day -- even 7,000-8,000 steps is associated with meaningfully lower cardiovascular risk."),
    (["weight loss", "lose weight", "obesity", "overweight"], "Even a modest weight loss (5-10% of body weight) can meaningfully improve blood pressure, cholesterol, and blood sugar. Sustainable changes to diet and activity tend to work better long-term than extreme approaches."),
    (["bmi"], "BMI is a rough screening tool (weight relative to height) -- under 25 is considered normal, 25-30 overweight, 30+ obese. It doesn't account for muscle mass or fat distribution, so it's one data point among several, not a diagnosis on its own."),
    (["diet", "food", "eat", "nutrition"], "A heart-healthy diet emphasizes vegetables, fruits, whole grains, lean protein, and healthy fats (like olive oil), while limiting saturated fat, sodium, and added sugar -- the Mediterranean and DASH diets are well-studied examples."),
    (["saturated fat", "trans fat"], "Saturated fat (fatty meats, butter, full-fat dairy) and especially trans fat (found in some fried/processed foods) raise LDL cholesterol. Swapping toward unsaturated fats (olive oil, nuts, fish) is generally heart-protective."),
    (["fiber", "fibre"], "Soluble fiber (oats, beans, apples, barley) can help lower LDL cholesterol by binding to it in the digestive system. Most adults benefit from aiming for 25-30g of fiber a day."),
    (["omega 3", "omega-3", "fish oil"], "Omega-3 fatty acids (found in fatty fish like salmon, walnuts, flaxseed) are linked to lower triglycerides and some cardiovascular benefits. Two servings of fatty fish a week is a common recommendation."),
    (["alcohol", "drinking"], "If you drink, moderation matters -- up to 1 drink/day for women and 2 for men is the commonly cited upper limit, though less is generally better for heart health. Heavy drinking raises blood pressure and can weaken the heart muscle over time."),
    (["caffeine", "coffee"], "Moderate caffeine (2-3 cups of coffee/day) is generally fine for most people's heart health and hasn't been shown to meaningfully raise long-term risk. If you notice palpitations or anxiety with caffeine, it's worth cutting back."),
    (["hydration", "water intake", "drink water"], "Staying well-hydrated supports healthy blood volume and circulation. There's no single magic number, but a common guideline is roughly 2-3 liters (8-12 cups) a day, adjusted for activity and climate."),

    # --- Smoking ---
    (["smoking", "cigarette", "vape", "vaping"], "Smoking is one of the single biggest modifiable risk factors for heart disease. Quitting -- at any age -- rapidly starts reducing your risk within just a few months. Vaping is also linked to cardiovascular strain, though it's studied less extensively than traditional smoking."),

    # --- Stress / sleep / mental health ---
    (["stress"], "Chronic stress raises blood pressure and inflammation, both linked to heart disease. Techniques like regular exercise, sleep, meditation, and social support can meaningfully help."),
    (["meditation", "mindfulness", "breathing exercise"], "Regular meditation or breathing exercises are linked to modest reductions in blood pressure and stress hormones. Even 5-10 minutes a day, done consistently, can help."),
    (["yoga"], "Yoga combines light activity with stress reduction, and studies link it to modest improvements in blood pressure and cholesterol. It's a good complement to -- not a replacement for -- aerobic exercise."),
    (["sleep"], "Adults should aim for 7-9 hours of sleep. Both too little and too much sleep are associated with higher cardiovascular risk."),
    (["sleep apnea", "snoring"], "Loud snoring with pauses in breathing can be a sign of sleep apnea, which is linked to high blood pressure and increased cardiovascular risk. A sleep study can diagnose it, and treatment (like a CPAP machine) often helps significantly."),
    (["anxiety", "depression", "mental health"], "Anxiety and depression are linked to higher cardiovascular risk, partly through stress hormones and partly through their effect on habits like sleep, diet, and exercise. Treating mental health is genuinely part of protecting your heart -- it's worth discussing with a doctor or therapist."),
    (["sedentary", "sitting too much", "screen time"], "Long periods of sitting are linked to higher cardiovascular risk, even in people who exercise regularly. Standing up or moving for a few minutes every hour helps offset this."),

    # --- Risk score / prediction ---
    (["risk score", "risk level", "my risk", "prediction", "how accurate"], "Your risk score comes from a machine-learning model trained on clinical risk factors like age, blood pressure, cholesterol, and ECG results. It's a screening estimate, not a diagnosis -- always discuss results with a cardiologist."),
    (["heart age"], "Heart age compares your cardiovascular risk profile to the average person of your chronological age. A heart age higher than your real age suggests elevated risk factors; improving sleep, activity, and diet consistently can bring it down over time."),
    (["health score"], "Your health score is a simplified 0-100 summary derived from your predicted risk -- higher is better. It's meant to be an easy-to-track number alongside the more detailed clinical breakdown."),

    # --- Diabetes / other conditions ---
    (["diabetes", "blood sugar", "glucose"], "Diabetes roughly doubles cardiovascular risk, largely because high blood sugar damages blood vessels over time. Good blood sugar control, along with managing blood pressure and cholesterol, meaningfully reduces that added risk."),
    (["family history", "genetics", "hereditary"], "A family history of early heart disease (before ~55 in male relatives, ~65 in female relatives) raises your own risk, but it isn't destiny -- lifestyle factors still matter a lot, and knowing your family history helps your doctor screen you appropriately."),

    # --- Special populations ---
    (["women", "female heart disease"], "Heart disease is the leading cause of death in women too, though symptoms can look different (more fatigue, nausea, or jaw/back pain rather than classic chest pain). Risk factors like diabetes and smoking also tend to affect women's heart risk more strongly than men's."),
    (["age", "older", "elderly"], "Cardiovascular risk rises with age for everyone, mainly because blood vessels naturally stiffen over time. That said, many risk factors (blood pressure, cholesterol, activity, smoking) are still modifiable at any age."),

    # --- Emergency / first aid ---
    (["cpr", "first aid", "someone collapses"], "If someone collapses and isn't breathing normally, call emergency services immediately and start CPR: push hard and fast in the center of the chest (about 100-120 compressions/minute) until help arrives or an AED is available. Hands-only CPR is fine if you're not trained in rescue breaths."),
    (["aspirin"], "Aspirin can reduce clotting, but taking it isn't automatically safe or beneficial for everyone -- it also raises bleeding risk. Whether you should take it (daily or during a suspected heart attack) is a decision to make with your doctor, not on your own."),

    # --- Medications / checkups ---
    (["medication", "medicine", "pills"], "If you're prescribed heart-related medication, taking it consistently matters a lot -- stopping suddenly can be risky even if you feel fine. Always loop in your doctor before changing doses or stopping."),
    (["checkup", "check-up", "how often doctor"], "For most healthy adults, an annual check-up (with blood pressure and cholesterol checks) is a reasonable baseline; more frequent visits make sense if you have existing risk factors or a diagnosed condition -- your doctor can set the right schedule."),
    (["ecg", "ekg", "electrocardiogram"], "An ECG/EKG records your heart's electrical activity and can reveal arrhythmias, past heart attacks, or other abnormalities. It's quick, painless, and often one of the first tests used to evaluate heart symptoms."),
]

_DEFAULT_REPLY = (
    "I'm here to help with common heart-health topics -- things like risk factors, "
    "cholesterol, blood pressure, exercise, diet, stress, sleep, or understanding "
    "your results. I can't diagnose conditions or answer completely open-ended "
    "questions, so try rephrasing around one of those topics, or ask your doctor "
    "for anything specific to your symptoms."
)


def generate_reply(user_message: str) -> str:
    text = user_message.lower()
    for keywords, reply in _KEYWORD_REPLIES:
        if any(k in text for k in keywords):
            return reply
    return _DEFAULT_REPLY


@router.post("/chat", response_model=schemas.ChatResponse)
def chat(
    body: schemas.ChatRequest,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(security.get_current_user),
):
    db.add(models.ChatMessage(owner_id=current_user.id, role="user", content=body.message))

    reply_text = generate_reply(body.message)
    db.add(models.ChatMessage(owner_id=current_user.id, role="assistant", content=reply_text))
    db.commit()

    return schemas.ChatResponse(content=reply_text)


@router.get("/history", response_model=List[schemas.ChatMessageOut])
def chat_history(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(security.get_current_user),
):
    return (
        db.query(models.ChatMessage)
        .filter(models.ChatMessage.owner_id == current_user.id)
        .order_by(models.ChatMessage.created_at.asc())
        .all()
    )