import os
import joblib
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np

from xgboost import XGBClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    confusion_matrix,
    ConfusionMatrixDisplay,
    RocCurveDisplay,
)

# Import dataset loader from your existing train_model.py
from train_model import load_dataset, FEATURES

# Load dataset
df = load_dataset()

X = df[FEATURES]
y = df["target"]

# Train-Test Split
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

# ==========================
# Random Forest
# ==========================
rf = RandomForestClassifier(
    n_estimators=300,
    max_depth=6,
    min_samples_leaf=5,
    random_state=42,
    n_jobs=-1,
)

rf.fit(X_train, y_train)

rf_pred = rf.predict(X_test)
rf_prob = rf.predict_proba(X_test)[:, 1]

# ==========================
# XGBoost
# ==========================
xgb = XGBClassifier(
    n_estimators=300,
    max_depth=6,
    learning_rate=0.1,
    random_state=42,
    eval_metric="logloss",
)

xgb.fit(X_train, y_train)

xgb_pred = xgb.predict(X_test)
xgb_prob = xgb.predict_proba(X_test)[:, 1]


def print_results(name, y_true, pred, prob):
    print("=" * 50)
    print(name)
    print("=" * 50)
    print(f"Accuracy : {accuracy_score(y_true, pred):.3f}")
    print(f"Precision: {precision_score(y_true, pred):.3f}")
    print(f"Recall   : {recall_score(y_true, pred):.3f}")
    print(f"F1 Score : {f1_score(y_true, pred):.3f}")
    print(f"ROC-AUC  : {roc_auc_score(y_true, prob):.3f}")
    print()


print_results("Random Forest", y_test, rf_pred, rf_prob)
print_results("XGBoost", y_test, xgb_pred, xgb_prob)

# ==========================
# Best Model
# ==========================
rf_acc = accuracy_score(y_test, rf_pred)
xgb_acc = accuracy_score(y_test, xgb_pred)

print("=" * 50)
if rf_acc > xgb_acc:
    print("Best Model : Random Forest")
else:
    print("Best Model : XGBoost")
print("=" * 50)

# ==========================
# Confusion Matrix - RF
# ==========================
plt.figure(figsize=(5, 5))
ConfusionMatrixDisplay.from_predictions(y_test, rf_pred)
plt.title("Random Forest Confusion Matrix")
plt.show()

# ==========================
# Confusion Matrix - XGB
# ==========================
plt.figure(figsize=(5, 5))
ConfusionMatrixDisplay.from_predictions(y_test, xgb_pred)
plt.title("XGBoost Confusion Matrix")
plt.show()

# ==========================
# ROC Curve
# ==========================
plt.figure(figsize=(7, 6))

RocCurveDisplay.from_predictions(
    y_test,
    rf_prob,
    name="Random Forest"
)

RocCurveDisplay.from_predictions(
    y_test,
    xgb_prob,
    name="XGBoost"
)

plt.title("ROC Curve Comparison")
plt.grid(True)
plt.show()

# ==========================
# Feature Importance (RF)
# ==========================
importance = pd.Series(
    rf.feature_importances_,
    index=FEATURES
).sort_values()

plt.figure(figsize=(8, 6))
importance.plot(kind="barh")
plt.title("Random Forest Feature Importance")
plt.xlabel("Importance")
plt.tight_layout()
plt.show()