from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app import models, schemas, security
from app.ml.model import predict_risk
from app.routers.patients import _to_orm_kwargs

router = APIRouter(prefix="/api", tags=["predictions"])


def _clinical_dict(body: schemas.PatientIn) -> dict:
    return {
        "age": body.age, "sex": body.sex, "cp": body.cp, "trestbps": body.trestbps,
        "chol": body.chol, "fbs": body.fbs, "restecg": body.restecg,
        "thalach": body.thalach, "exang": body.exang, "oldpeak": body.oldpeak,
        "slope": body.slope, "ca": body.ca, "thal": body.thal,
    }


@router.post("/predict", response_model=schemas.PredictionResult)
def predict(
    body: schemas.PredictRequest,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(security.get_current_user),
):
    """Used by Prediction.jsx's 'Save & Predict' flow. Runs the ML model on
    the full patient form, optionally persists a PatientRecord + Prediction
    (for History.jsx / Dashboard.jsx), and returns the result Results.jsx renders."""
    result = predict_risk(_clinical_dict(body))

    if body.save:
        patient = models.PatientRecord(owner_id=current_user.id, **_to_orm_kwargs(body))
        db.add(patient)
        db.commit()
        db.refresh(patient)

        pred = models.Prediction(
            owner_id=current_user.id,
            patient_id=patient.id,
            prediction=result["prediction"],
            probability=result["probability"],
            risk_pct=result["riskPct"],
            risk_level=result["riskLevel"],
            confidence=result["confidence"],
            heart_age=result["heartAge"],
            health_score=result["healthScore"],
            recommendation=result["recommendation"],
        )
        db.add(pred)
        db.commit()

    return result


@router.post("/whatif", response_model=schemas.PredictionResult)
def whatif(
    body: schemas.WhatIfRequest,
    current_user: models.User = Depends(security.get_current_user),
):
    """Used by Whatif.jsx sliders. Maps the simplified what-if fields onto
    the full clinical feature set (using sensible defaults for fields the
    simulator doesn't expose) and runs the same model -- never saved to history."""
    clinical = {
        "age": body.age,
        "sex": body.sex,
        "cp": 1,
        "trestbps": body.bloodPressure,
        "chol": body.cholesterol,
        "fbs": 0,
        "restecg": 0,
        "thalach": body.maxHeartRate,
        "exang": 1 if body.smoking else 0,
        "oldpeak": body.stDepression,
        "slope": 1,
        "ca": 0 if body.physicalActivity >= 1 else 1,
        "thal": 1 if body.healthyDiet else 2,
    }
    return predict_risk(clinical)


@router.get("/predictions", response_model=List[schemas.HistoryItem])
def list_predictions(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(security.get_current_user),
):
    """Powers History.jsx's table."""
    rows = (
        db.query(models.Prediction)
        .filter(models.Prediction.owner_id == current_user.id, models.Prediction.is_whatif == False)  # noqa: E712
        .order_by(models.Prediction.created_at.desc())
        .all()
    )
    out = []
    for r in rows:
        patient_name = r.patient.name if r.patient else "Anonymous"
        out.append(
            schemas.HistoryItem(
                id=r.id, date=r.created_at, patient=patient_name,
                riskPct=r.risk_pct, heartAge=r.heart_age, notes=r.notes,
            )
        )
    return out


@router.get("/predictions/{prediction_id}", response_model=schemas.PredictionOut)
def get_prediction(
    prediction_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(security.get_current_user),
):
    """Powers Results.jsx / Report.jsx when opened for a specific past result."""
    pred = (
        db.query(models.Prediction)
        .filter(models.Prediction.id == prediction_id, models.Prediction.owner_id == current_user.id)
        .first()
    )
    if not pred:
        raise HTTPException(status_code=404, detail="Prediction not found")
    return pred


@router.delete("/predictions/{prediction_id}")
def delete_prediction(
    prediction_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(security.get_current_user),
):
    """Powers History.jsx's delete button."""
    pred = (
        db.query(models.Prediction)
        .filter(models.Prediction.id == prediction_id, models.Prediction.owner_id == current_user.id)
        .first()
    )
    if not pred:
        raise HTTPException(status_code=404, detail="Prediction not found")
    db.delete(pred)
    db.commit()
    return {"detail": "Deleted"}