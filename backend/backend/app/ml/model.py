"""
Loads the trained model (training it on first run if missing) and exposes
predict_risk(), which returns exactly the fields Prediction.jsx already
expects: prediction, probability, riskLevel, confidence -- plus a couple of
extras (heartAge, healthScore, recommendation) used by Results.jsx.
"""
import os
import joblib
import numpy as np
import pandas as pd

from app.ml.train_model import train, MODEL_PATH, FEATURES

_bundle = None


def _load():
    global _bundle
    if _bundle is None:
        if not os.path.exists(MODEL_PATH):
            train()
        _bundle = joblib.load(MODEL_PATH)
    return _bundle


def _heart_age(age: int, probability: float) -> int:
    """A simple, explainable 'heart age' heuristic: shift chronological age
    up/down based on how far the model's probability is from a 20% baseline."""
    delta = (probability - 0.2) * 40
    return max(18, round(age + delta))


def _health_score(probability: float) -> int:
    return max(0, min(100, round((1 - probability) * 100)))


def _recommendation(risk_level: str, probability: float) -> str:
    if probability >= 0.7:
        return (
            "High predicted risk. Please consult a cardiologist promptly for "
            "a full clinical work-up, and avoid strenuous exertion until reviewed."
        )
    if probability >= 0.4:
        return (
            "Moderate predicted risk. Schedule a check-up with your doctor, "
            "monitor blood pressure/cholesterol, and review lifestyle factors."
        )
    return (
        "Low predicted risk. Continue annual check-ups and maintain a "
        "healthy lifestyle to keep your risk low."
    )


def predict_risk(patient: dict) -> dict:
    """patient: dict with keys age, sex, cp, trestbps, chol, fbs, restecg,
    thalach, exang, oldpeak, slope, ca, thal (values already numeric-coded,
    matching the option lists in PatientForm.jsx)."""
    bundle = _load()
    model = bundle["model"]
    features = bundle["features"]

    row = pd.DataFrame([[float(patient[f]) for f in features]], columns=features)
    proba = float(model.predict_proba(row)[0, 1])
    prediction = int(proba >= 0.5)
    risk_level = "High Risk" if prediction == 1 else "Low Risk"

    # confidence = how far the model's probability is from the 0.5 boundary,
    # rescaled to the 0.55-1.0 range so it always reads as "fairly confident".
    confidence = 0.55 + 0.45 * abs(proba - 0.5) * 2

    age = int(patient["age"])
    return {
        "prediction": prediction,
        "probability": round(proba, 3),
        "riskLevel": risk_level,
        "confidence": round(confidence, 3),
        "riskPct": round(proba * 100, 1),
        "heartAge": _heart_age(age, proba),
        "healthScore": _health_score(proba),
        "recommendation": _recommendation(risk_level, proba),
    }
