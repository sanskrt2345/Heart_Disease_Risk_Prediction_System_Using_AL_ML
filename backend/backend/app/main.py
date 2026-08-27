import os
import re

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app import models  # noqa: F401  (ensures models are registered before create_all)
from app.routers import auth, users, patients, predictions, dashboard, assistant, lifestyle, reports

# Create tables on startup (fine for SQLite/dev; use Alembic migrations in production)
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="HeartRiskAI API",
    description="Backend for the HeartRiskAI cardiovascular risk prediction app.",
    version="1.0.0",
)

# Local dev origins are always allowed. For the deployed frontend, set the
# FRONTEND_URL env var on Render to your Vercel URL (e.g.
# https://your-app.vercel.app) -- no code changes needed when the URL changes.
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
]

frontend_url = os.environ.get("FRONTEND_URL")
if frontend_url:
    origins.append(frontend_url.rstrip("/"))

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    # Also allow any Vercel preview/production deployment URL for this project
    # (e.g. https://heart-disease-...-git-main-username.vercel.app) so preview
    # deploys work too. Tighten this later if you don't need previews.
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(patients.router)
app.include_router(predictions.router)
app.include_router(dashboard.router)
app.include_router(assistant.router)
app.include_router(lifestyle.router)
app.include_router(reports.router)


@app.get("/")
def root():
    return {"status": "ok", "service": "HeartRiskAI API"}


@app.get("/api/health")
def health():
    return {"status": "healthy"}
