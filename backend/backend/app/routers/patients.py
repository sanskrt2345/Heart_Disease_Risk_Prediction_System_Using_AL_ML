from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app import models, schemas, security

router = APIRouter(prefix="/api/patients", tags=["patients"])


def _to_orm_kwargs(body: schemas.PatientIn) -> dict:
    return dict(
        name=body.name or "Anonymous",
        age=body.age,
        sex=body.sex,
        height=body.height,
        weight=body.weight,
        bmi=body.bmi,
        occupation=body.occupation,
        smoking=body.smoking,
        alcohol=body.alcohol,
        family_history=body.familyHistory,
        physical_activity=body.physicalActivity,
        daily_steps=body.dailySteps,
        sleep_hours=body.sleepHours,
        stress_level=body.stressLevel,
        diet_type=body.dietType,
        water_intake=body.waterIntake,
        cp=body.cp,
        trestbps=body.trestbps,
        chol=body.chol,
        fbs=body.fbs,
        restecg=body.restecg,
        thalach=body.thalach,
        exang=body.exang,
        oldpeak=body.oldpeak,
        slope=body.slope,
        ca=body.ca,
        thal=body.thal,
        medications=body.medications,
        previous_heart_disease=body.previousHeartDisease,
        diabetes=body.diabetes,
        hypertension=body.hypertension,
    )


def _to_out(p: models.PatientRecord) -> dict:
    return {
        "id": p.id,
        "created_at": p.created_at,
        "name": p.name,
        "age": p.age,
        "sex": p.sex,
        "height": p.height,
        "weight": p.weight,
        "bmi": p.bmi,
        "occupation": p.occupation,
        "smoking": p.smoking,
        "alcohol": p.alcohol,
        "familyHistory": p.family_history,
        "physicalActivity": p.physical_activity,
        "dailySteps": p.daily_steps,
        "sleepHours": p.sleep_hours,
        "stressLevel": p.stress_level,
        "dietType": p.diet_type,
        "waterIntake": p.water_intake,
        "cp": p.cp,
        "trestbps": p.trestbps,
        "chol": p.chol,
        "fbs": p.fbs,
        "restecg": p.restecg,
        "thalach": p.thalach,
        "exang": p.exang,
        "oldpeak": p.oldpeak,
        "slope": p.slope,
        "ca": p.ca,
        "thal": p.thal,
        "medications": p.medications,
        "previousHeartDisease": p.previous_heart_disease,
        "diabetes": p.diabetes,
        "hypertension": p.hypertension,
    }


@router.post("", response_model=schemas.PatientOut, status_code=201)
def create_patient(
    body: schemas.PatientIn,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(security.get_current_user),
):
    patient = models.PatientRecord(owner_id=current_user.id, **_to_orm_kwargs(body))
    db.add(patient)
    db.commit()
    db.refresh(patient)
    return _to_out(patient)


@router.get("/{patient_id}", response_model=schemas.PatientOut)
def get_patient(
    patient_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(security.get_current_user),
):
    patient = (
        db.query(models.PatientRecord)
        .filter(models.PatientRecord.id == patient_id, models.PatientRecord.owner_id == current_user.id)
        .first()
    )
    if not patient:
        raise HTTPException(status_code=404, detail="Patient record not found")
    return _to_out(patient)
