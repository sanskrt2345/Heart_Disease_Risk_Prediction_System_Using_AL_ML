"""
Trains the heart-disease risk model used by /api/predict.

NOTE ON DATA: This environment has no network access to the UCI Cleveland
repository, so this script generates a synthetic dataset whose feature
distributions and risk relationships are built from well-known clinical
risk factors (the same 13 features + encodings the frontend already uses,
see PatientForm.jsx's SEX/CP/RESTECG/SLOPE/CA/THAL option lists).

To use the REAL Cleveland dataset instead:
  1. Download `Heart_disease_cleveland_new.csv` (the exact file the
     frontend's field encodings already match).
  2. Save it next to this script as `cleveland.csv`.
  3. Re-run `python -m app.ml.train_model` -- it will automatically prefer
     the real CSV over the synthetic generator if the file is present.

Either way, the output is `app/ml/heart_model.pkl`, loaded by model.py.
"""
import os
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, roc_auc_score
import joblib

HERE = os.path.dirname(os.path.abspath(__file__))
REAL_CSV = os.path.join(HERE, "cleveland.csv")
MODEL_PATH = os.path.join(HERE, "heart_model.pkl")

FEATURES = [
    "age", "sex", "cp", "trestbps", "chol", "fbs", "restecg",
    "thalach", "exang", "oldpeak", "slope", "ca", "thal",
]


def _generate_synthetic(n=4000, seed=42):
    rng = np.random.default_rng(seed)

    age = rng.integers(29, 78, n)
    sex = rng.integers(0, 2, n)  # 0 female, 1 male
    cp = rng.choice([0, 1, 2, 3], n, p=[0.47, 0.17, 0.28, 0.08])
    trestbps = rng.normal(131, 17, n).clip(94, 200)
    chol = rng.normal(246, 52, n).clip(126, 564)
    fbs = rng.choice([0, 1], n, p=[0.85, 0.15])
    restecg = rng.choice([0, 1, 2], n, p=[0.5, 0.49, 0.01])
    thalach = rng.normal(149, 23, n).clip(71, 202)
    exang = rng.choice([0, 1], n, p=[0.67, 0.33])
    oldpeak = rng.exponential(1.0, n).clip(0, 6.2)
    slope = rng.choice([0, 1, 2], n, p=[0.21, 0.47, 0.32])
    ca = rng.choice([0, 1, 2, 3], n, p=[0.58, 0.21, 0.13, 0.08])
    thal = rng.choice([1, 2, 3], n, p=[0.55, 0.06, 0.39])

    # Clinically-informed risk score -> probability -> binary label.
    # Coefficients loosely reflect known cardiovascular risk weightings
    # (higher age/BP/cholesterol/ST-depression/vessels = higher risk;
    # higher max heart rate = protective).
    z = (
        -6.2
        + 0.045 * (age - 50)
        + 0.55 * sex
        + 0.42 * (cp == 0).astype(float)  # typical angina is the highest-risk pattern here
        + 0.02 * (trestbps - 120)
        + 0.006 * (chol - 200)
        + 0.30 * fbs
        + 0.25 * (restecg == 1).astype(float)
        - 0.02 * (thalach - 150)
        + 0.85 * exang
        + 0.42 * oldpeak
        + 0.55 * (slope == 1).astype(float)
        + 0.55 * ca
        + 0.60 * (thal == 3).astype(float)
    )
    prob = 1 / (1 + np.exp(-z))
    target = (rng.random(n) < prob).astype(int)

    df = pd.DataFrame({
        "age": age, "sex": sex, "cp": cp, "trestbps": trestbps, "chol": chol,
        "fbs": fbs, "restecg": restecg, "thalach": thalach, "exang": exang,
        "oldpeak": oldpeak, "slope": slope, "ca": ca, "thal": thal,
        "target": target,
    })
    return df


def load_dataset() -> pd.DataFrame:
    if os.path.exists(REAL_CSV):
        df = pd.read_csv(REAL_CSV)
        df.columns = [c.strip().lower() for c in df.columns]
        return df
    return _generate_synthetic()


def train():
    df = load_dataset()
    X = df[FEATURES]
    y = df["target"]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    model = RandomForestClassifier(
        n_estimators=300,
        max_depth=6,
        min_samples_leaf=5,
        random_state=42,
        n_jobs=-1,
    )
    model.fit(X_train, y_train)

    preds = model.predict(X_test)
    probs = model.predict_proba(X_test)[:, 1]
    print(f"Test accuracy: {accuracy_score(y_test, preds):.3f}")
    print(f"Test ROC AUC:  {roc_auc_score(y_test, probs):.3f}")

    joblib.dump({"model": model, "features": FEATURES}, MODEL_PATH)
    print(f"Saved model -> {MODEL_PATH}")


if __name__ == "__main__":
    train()
