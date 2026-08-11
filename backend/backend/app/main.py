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

# Vite's default dev server ports. Add your deployed frontend origin too.
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
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
