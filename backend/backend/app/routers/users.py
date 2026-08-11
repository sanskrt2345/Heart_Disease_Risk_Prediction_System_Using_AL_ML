from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app import models, schemas, security

router = APIRouter(prefix="/api/users", tags=["users"])


@router.get("/me", response_model=schemas.UserOut)
def get_settings(current_user: models.User = Depends(security.get_current_user)):
    return current_user


@router.put("/me", response_model=schemas.UserOut)
def update_settings(
    body: schemas.UpdateSettingsRequest,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(security.get_current_user),
):
    if body.email and body.email != current_user.email:
        clash = db.query(models.User).filter(models.User.email == body.email).first()
        if clash:
            raise HTTPException(status_code=400, detail="Email already in use")
        current_user.email = body.email

    if body.name is not None:
        current_user.name = body.name
    if body.notifications_enabled is not None:
        current_user.notifications_enabled = body.notifications_enabled
    if body.units is not None:
        current_user.units = body.units

    db.commit()
    db.refresh(current_user)
    return current_user


@router.put("/me/password")
def change_password(
    body: schemas.ChangePasswordRequest,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(security.get_current_user),
):
    if not security.verify_password(body.current_password, current_user.hashed_password):
        raise HTTPException(status_code=400, detail="Current password is incorrect")
    current_user.hashed_password = security.hash_password(body.new_password)
    db.commit()
    return {"detail": "Password updated"}


@router.delete("/me")
def delete_account(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(security.get_current_user),
):
    db.delete(current_user)
    db.commit()
    return {"detail": "Account deleted"}
