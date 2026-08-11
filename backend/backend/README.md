# HeartRiskAI Backend

FastAPI + SQLite backend for the HeartRiskAI cardiovascular risk prediction app.
Built to match `frontend/` exactly — routes, field names, and page flow.

## Quick start

```bash
cd backend
python3 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt

uvicorn app.main:app --reload --port 8000
```

The API will be live at `http://localhost:8000`, with interactive docs at
`http://localhost:8000/docs`.

On first request to `/api/predict` (or `/api/whatif`), the ML model trains
itself automatically (takes a couple seconds) and is cached to
`app/ml/heart_model.pkl`. SQLite tables are created automatically in
`backend/heartrisk.db` on startup — no migrations needed to get going.

## Connecting the frontend

In `frontend/`, create a small API client (e.g. `src/services/api.js`):

```js
const API_URL = "http://localhost:8000";

export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  if (!res.ok) throw new Error((await res.json()).detail || "Request failed");
  return res.json();
}
```

Then in each page, replace the mock logic:

- **Signup.jsx / Login.jsx**: `POST /api/auth/signup` / `POST /api/auth/login`
  → save `access_token` to `localStorage`, then `navigate("/dashboard")`.
- **PatientForm.jsx**: no change needed — it already just passes `formData`
  via router state to `/prediction`.
- **Prediction.jsx**: replace the `setTimeout` + `Math.random()` block in
  `handlePredict` with `await apiFetch("/api/predict", { method: "POST", body: JSON.stringify(patientData) })`.
- **Results.jsx**: read `location.state.result` (from Prediction.jsx) instead
  of the hardcoded `patient` object, or `GET /api/predictions/{id}` to reload
  a past result.
- **WhatIf.jsx**: optionally swap `computeRisk()` for `POST /api/whatif`.
- **History.jsx**: `GET /api/predictions`.
- **Dashboard.jsx**: `GET /api/dashboard/summary`.
- **AIAssistant.jsx**: replace `mockAssistantReply()` with
  `POST /api/assistant/chat`.
- **Lifestyle.jsx**: `GET /api/lifestyle`.
- **Settings.jsx**: `GET/PUT /api/users/me`, `PUT /api/users/me/password`.

## API reference

| Method | Path                          | Auth | Purpose |
|--------|-------------------------------|------|---------|
| POST   | `/api/auth/signup`            | –    | Create account, returns JWT |
| POST   | `/api/auth/login`             | –    | Login, returns JWT |
| GET    | `/api/auth/me`                | ✔    | Current user |
| GET/PUT| `/api/users/me`               | ✔    | Read/update profile & settings |
| PUT    | `/api/users/me/password`      | ✔    | Change password |
| DELETE | `/api/users/me`               | ✔    | Delete account |
| POST   | `/api/patients`               | ✔    | Save a Patient Details form |
| GET    | `/api/patients/{id}`          | ✔    | Fetch a saved patient record |
| POST   | `/api/predict`                | ✔    | Run the ML model on a full patient form, saves to history by default |
| POST   | `/api/whatif`                 | ✔    | Re-run the model on simplified What-If sliders (never saved) |
| GET    | `/api/predictions`            | ✔    | List past predictions (History page) |
| GET    | `/api/predictions/{id}`       | ✔    | Full detail of one past prediction (Results/Report page) |
| GET    | `/api/dashboard/summary`      | ✔    | Stat cards + 7-point trend for Dashboard |
| POST   | `/api/assistant/chat`         | ✔    | AI Assistant chat (rule-based; swap in a real LLM anytime) |
| GET    | `/api/assistant/history`      | ✔    | Past chat messages |
| GET    | `/api/lifestyle`               | ✔    | Personalized lifestyle tips |

Auth: send `Authorization: Bearer <access_token>` on all `✔` routes.

## The ML model

`app/ml/train_model.py` trains a `RandomForestClassifier` on the 13 clinical
features the frontend already collects (`age, sex, cp, trestbps, chol, fbs,
restecg, thalach, exang, oldpeak, slope, ca, thal` — same encodings as
`PatientForm.jsx`'s option lists).

It's trained on the **real Cleveland heart disease dataset**, bundled at
`app/ml/cleveland.csv` (303 rows). Current held-out test performance:
**~88.5% accuracy, 0.958 ROC AUC**.

The model auto-trains (and caches to `app/ml/heart_model.pkl`) the first
time `/api/predict` or `/api/whatif` is called. To retrain manually (e.g.
after editing `cleveland.csv` or the model hyperparameters):

```bash
python -m app.ml.train_model
```

If `app/ml/cleveland.csv` is ever missing, the script automatically falls
back to a synthetic dataset generated from clinical risk-factor weightings,
so the API never breaks — but for real predictions, keep the CSV in place.

## Notes

- Swap `SECRET_KEY` (in `app/security.py`, or set the `SECRET_KEY` env var)
  before deploying anywhere real.
- To move off SQLite later, only `app/database.py`'s `SQLALCHEMY_DATABASE_URL`
  needs to change — the SQLAlchemy models stay the same.
- The AI Assistant is rule-based by default (zero API keys needed). See the
  comment at the top of `app/routers/assistant.py` for how to wire in a real
  LLM (e.g. the Anthropic API) in ~5 lines.
