from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app import models, schemas, security

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])


@router.get("/summary", response_model=schemas.DashboardSummary)
def summary(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(security.get_current_user),
):
    """Powers Dashboard.jsx's stat cards + trend chart."""
    rows = (
        db.query(models.Prediction)
        .filter(models.Prediction.owner_id == current_user.id, models.Prediction.is_whatif == False)  # noqa: E712
        .order_by(models.Prediction.created_at.asc())
        .all()
    )

    if not rows:
        return schemas.DashboardSummary(
            totalAssessments=0, latestRiskPct=None, latestRiskLevel=None,
            latestHeartAge=None, averageHealthScore=None, trend=[],
        )

    latest = rows[-1]
    avg_score = round(sum(r.health_score or 0 for r in rows) / len(rows))

    last7 = rows[-7:]
    trend = [
        schemas.TrendPoint(
            day=f"D-{len(last7) - 1 - i}",
            risk=round(r.risk_pct, 1),
            score=r.health_score or 0,
        )
        for i, r in enumerate(last7)
    ]

    return schemas.DashboardSummary(
        totalAssessments=len(rows),
        latestRiskPct=latest.risk_pct,
        latestRiskLevel=latest.risk_level,
        latestHeartAge=latest.heart_age,
        averageHealthScore=avg_score,
        trend=trend,
    )