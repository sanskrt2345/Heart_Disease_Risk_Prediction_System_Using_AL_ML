import datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr, ConfigDict


# ---------- Auth / User ----------

class SignupRequest(BaseModel):
    name: str
    email: EmailStr
    password: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str
    email: EmailStr
    notifications_enabled: bool
    units: str
    created_at: datetime.datetime


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


class UpdateSettingsRequest(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    notifications_enabled: Optional[bool] = None
    units: Optional[str] = None


class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str


# ---------- Patient form (matches PatientForm.jsx `formData` 1:1) ----------

class PatientIn(BaseModel):
    name: Optional[str] = "Anonymous"
    age: int
    sex: str
    height: Optional[float] = None
    weight: Optional[float] = None
    bmi: Optional[float] = None
    occupation: Optional[str] = None
    smoking: Optional[str] = None
    alcohol: Optional[str] = None
    familyHistory: Optional[str] = None
    physicalActivity: Optional[str] = None
    dailySteps: Optional[int] = None
    sleepHours: Optional[float] = None
    stressLevel: Optional[int] = 2
    dietType: Optional[str] = None
    waterIntake: Optional[float] = None

    cp: int
    trestbps: float
    chol: float
    fbs: int
    restecg: int
    thalach: float
    exang: int
    oldpeak: float
    slope: int
    ca: int
    thal: int
    medications: Optional[str] = None
    previousHeartDisease: Optional[str] = None
    diabetes: Optional[str] = None
    hypertension: Optional[str] = None


class PatientOut(PatientIn):
    model_config = ConfigDict(from_attributes=True)
    id: int
    created_at: datetime.datetime


# ---------- Prediction ----------

class PredictionResult(BaseModel):
    """Mirrors the shape Prediction.jsx already builds client-side, so the
    frontend swap is a one-line fetch() instead of a Math.random() mock."""
    prediction: int
    probability: float
    riskLevel: str
    confidence: float
    riskPct: float
    heartAge: Optional[int] = None
    healthScore: Optional[int] = None
    recommendation: Optional[str] = None


class PredictionOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    patient_id: Optional[int]
    created_at: datetime.datetime
    prediction: int
    probability: float
    risk_pct: float
    risk_level: str
    confidence: float
    heart_age: Optional[int]
    health_score: Optional[int]
    recommendation: Optional[str]
    notes: Optional[str]
    is_whatif: bool


class PredictRequest(PatientIn):
    """POST /api/predict body: the full patient form. patient_id is filled in
    automatically if you first POST /api/patients."""
    save: bool = True  # set False for What-If tweaks you don't want in history


class WhatIfRequest(BaseModel):
    """Lightweight body for the What-If Simulator - only the handful of
    fields Whatif.jsx actually lets the user drag."""
    bloodPressure: float = 120
    cholesterol: float = 200
    bmi: float = 24.9
    maxHeartRate: float = 150
    stDepression: float = 1
    stress: int = 2
    sleep: float = 7
    dailySteps: int = 6000
    waterIntake: float = 2
    physicalActivity: int = 1  # 0 low,1 moderate,2 high
    smoking: bool = False
    healthyDiet: bool = True
    age: int = 50
    sex: str = "1"


class HistoryItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    date: datetime.datetime
    patient: str
    riskPct: float
    heartAge: Optional[int]
    notes: Optional[str]


# ---------- Dashboard ----------

class TrendPoint(BaseModel):
    day: str
    risk: float
    score: int


class DashboardSummary(BaseModel):
    totalAssessments: int
    latestRiskPct: Optional[float]
    latestRiskLevel: Optional[str]
    latestHeartAge: Optional[int] = None
    averageHealthScore: Optional[int]
    trend: List[TrendPoint]


# ---------- AI Assistant ----------

class ChatRequest(BaseModel):
    message: str


class ChatMessageOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    role: str
    content: str
    created_at: datetime.datetime


class ChatResponse(BaseModel):
    role: str = "assistant"
    content: str


# ---------- Medical Report uploads ----------

class ReportOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str
    size: int
    type: Optional[str] = None
    date: datetime.datetime


class ReportUploadResult(BaseModel):
    report: ReportOut
    extracted: Optional[dict] = None       # fields actually found in the PDF text
    patientData: Optional[dict] = None     # extracted fields merged with defaults (fed to the model)
    result: Optional[PredictionResult] = None  # risk prediction, if we could parse the file
    message: Optional[str] = None          # e.g. why prediction was skipped (image files, empty PDF, etc.)


# ---------- Lifestyle ----------

class LifestyleTip(BaseModel):
    category: str
    title: str
    description: str
    priority: str  # "high" | "medium" | "low"