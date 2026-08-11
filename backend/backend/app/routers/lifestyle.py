from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app import models, schemas, security

router = APIRouter(prefix="/api/lifestyle", tags=["lifestyle"])

_BASE_TIPS = [
    schemas.LifestyleTip(category="Exercise", title="30 minutes of daily walking",
                          description="Brisk walking most days of the week can lower cardiovascular risk by up to 19%.",
                          priority="high"),
    schemas.LifestyleTip(category="Diet", title="Cut back on sodium",
                          description="Aim for under 2,300mg of sodium a day to help keep blood pressure in a healthy range.",
                          priority="medium"),
    schemas.LifestyleTip(category="Sleep", title="Prioritize 7-9 hours of sleep",
                          description="Poor sleep is linked to higher blood pressure and inflammation markers.",
                          priority="medium"),
    schemas.LifestyleTip(category="Stress", title="Practice daily stress reduction",
                          description="Even 10 minutes of meditation or deep breathing can measurably lower resting heart rate.",
                          priority="low"),
]


@router.get("", response_model=List[schemas.LifestyleTip])
def get_tips(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(security.get_current_user),
):
    """Powers Lifestyle.jsx. Starts from general tips, then adds
    personalized ones based on the user's latest patient record."""
    tips = list(_BASE_TIPS)

    latest = (
        db.query(models.PatientRecord)
        .filter(models.PatientRecord.owner_id == current_user.id)
        .order_by(models.PatientRecord.created_at.desc())
        .first()
    )

    if latest:
        if latest.smoking == "current":
            tips.insert(0, schemas.LifestyleTip(
                category="Smoking", title="Consider a quit-smoking plan",
                description="Quitting smoking is the single biggest step you can take -- risk starts dropping within weeks.",
                priority="high"))
        if latest.chol and latest.chol > 240:
            tips.insert(0, schemas.LifestyleTip(
                category="Diet", title="Focus on lowering LDL cholesterol",
                description="Your last recorded cholesterol was elevated. More fiber and less saturated fat can help.",
                priority="high"))
        if latest.trestbps and latest.trestbps > 130:
            tips.insert(0, schemas.LifestyleTip(
                category="Blood Pressure", title="Monitor your blood pressure regularly",
                description="Your last resting BP reading was above the healthy range -- track it weekly and share with your doctor.",
                priority="high"))
        if latest.physical_activity == "low":
            tips.insert(0, schemas.LifestyleTip(
                category="Exercise", title="Build up activity gradually",
                description="Start with 10-minute walks a few times a day and build toward 150 minutes/week.",
                priority="high"))

    return tips
