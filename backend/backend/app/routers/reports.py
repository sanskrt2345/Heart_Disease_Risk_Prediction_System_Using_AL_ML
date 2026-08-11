import os
import uuid
from typing import List
from fastapi import APIRouter, Depends, UploadFile, File
from sqlalchemy.orm import Session

from app.database import get_db
from app import models, schemas, security
from app.ml.model import predict_risk
from app.ml.report_parser import extract_text, extract_clinical_fields, build_patient_dict

router = APIRouter(prefix="/api/reports", tags=["reports"])

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "uploaded_reports")
os.makedirs(UPLOAD_DIR, exist_ok=True)


def _to_out(r: models.UploadedReport) -> dict:
    return {
        "id": r.id,
        "name": r.filename,
        "size": r.size_bytes or 0,
        "type": r.content_type,
        "date": r.created_at,
    }


@router.post("/upload", response_model=List[schemas.ReportUploadResult])
async def upload_reports(
    files: List[UploadFile] = File(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(security.get_current_user),
):
    """Powers Report.jsx's drag-and-drop uploader.

    For each file: saves it to disk + records metadata in the DB, then --
    if it's a PDF -- extracts whatever clinical values it can find in the
    text (age, blood pressure, cholesterol, etc.), fills in the rest with
    clinically-typical defaults, and runs the same ML model used by
    /api/predict. Image uploads are stored but not auto-analyzed (that
    needs OCR, which isn't wired up here yet)."""
    results = []
    for f in files:
        contents = await f.read()
        ext = os.path.splitext(f.filename)[1]
        stored_name = f"{uuid.uuid4().hex}{ext}"
        stored_path = os.path.join(UPLOAD_DIR, stored_name)
        with open(stored_path, "wb") as out:
            out.write(contents)

        record = models.UploadedReport(
            owner_id=current_user.id,
            filename=f.filename,
            content_type=f.content_type,
            size_bytes=len(contents),
            stored_path=stored_path,
        )
        db.add(record)
        db.commit()
        db.refresh(record)

        item = {"report": _to_out(record), "extracted": None, "patientData": None, "result": None, "message": None}

        is_pdf = (f.content_type == "application/pdf") or ext.lower() == ".pdf"
        if not is_pdf:
            item["message"] = "Automatic analysis only supports PDF reports right now -- file was saved, but not analyzed."
            results.append(item)
            continue

        text = extract_text(stored_path)
        if not text.strip():
            item["message"] = "Couldn't read any text from this PDF (it may be a scanned image) -- file was saved, but not analyzed."
            results.append(item)
            continue

        found = extract_clinical_fields(text)
        if not found:
            item["message"] = "Couldn't detect recognizable clinical values in this report -- file was saved, but not analyzed."
            results.append(item)
            continue

        patient = build_patient_dict(found)
        prediction = predict_risk(patient)

        # Persist as a real patient record + prediction, same as a manual form submission
        patient_record = models.PatientRecord(
            owner_id=current_user.id,
            name=current_user.name,
            age=patient["age"], sex=patient["sex"], cp=patient["cp"],
            trestbps=patient["trestbps"], chol=patient["chol"], fbs=patient["fbs"],
            restecg=patient["restecg"], thalach=patient["thalach"], exang=patient["exang"],
            oldpeak=patient["oldpeak"], slope=patient["slope"], ca=patient["ca"], thal=patient["thal"],
        )
        db.add(patient_record)
        db.commit()
        db.refresh(patient_record)

        db.add(models.Prediction(
            owner_id=current_user.id,
            patient_id=patient_record.id,
            prediction=prediction["prediction"],
            probability=prediction["probability"],
            risk_pct=prediction["riskPct"],
            risk_level=prediction["riskLevel"],
            confidence=prediction["confidence"],
            heart_age=prediction["heartAge"],
            health_score=prediction["healthScore"],
            recommendation=prediction["recommendation"],
            notes=f"Auto-extracted from uploaded report: {f.filename}",
        ))
        db.commit()

        item["extracted"] = found
        item["patientData"] = patient
        item["result"] = prediction
        item["message"] = f"Detected {len(found)} of 13 clinical fields; the rest used typical defaults."
        results.append(item)

    return results


@router.get("", response_model=List[schemas.ReportOut])
def list_reports(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(security.get_current_user),
):
    rows = (
        db.query(models.UploadedReport)
        .filter(models.UploadedReport.owner_id == current_user.id)
        .order_by(models.UploadedReport.created_at.desc())
        .all()
    )
    return [_to_out(r) for r in rows]
