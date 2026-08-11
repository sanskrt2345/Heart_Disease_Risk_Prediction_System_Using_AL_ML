"""
Best-effort extraction of clinical values from a medical report PDF.

This is a heuristic regex-based parser, NOT real medical NLP/OCR -- real
lab reports vary hugely in layout (table formats, different field names,
different ordering), so this can only catch common phrasings. It fills in
clinically-typical defaults for anything it can't find, and reports back
exactly which fields were actually detected vs assumed, so the result can
be reviewed before trusting it.

If you need higher accuracy across many report formats, the more robust
options are: (a) a template per lab/report type, or (b) sending the
extracted text to an LLM with a "return these 13 fields as JSON" prompt.
"""
import re
import pdfplumber

# Defaults used when a value can't be found in the report text -- these
# are typical/borderline values, not "healthy" ones, so a sparse report
# doesn't artificially look perfectly safe.
DEFAULTS = {
    "age": 50, "sex": "1", "cp": 1, "trestbps": 130, "chol": 220,
    "fbs": 0, "restecg": 0, "thalach": 140, "exang": 0, "oldpeak": 1.0,
    "slope": 1, "ca": 0, "thal": 2,
}


def _sex_from_word(word: str) -> str:
    return "1" if word.strip().lower() in ("male", "m", "1") else "0"


# Compound patterns checked FIRST (they capture more than one field at once,
# and are specific enough to avoid false positives like a page-footer "Page 1"
# being mistaken for "Age: 1").
_COMPOUND_PATTERNS = [
    # "Age/ Gender : 20 years / Female"  or  "Age/Sex: 45/M"
    (r"\bage\s*/\s*(?:gender|sex)\s*[:\-]?\s*(\d{1,3})\s*(?:years?|yrs?)?\s*/\s*(male|female|m|f)\b",
     lambda m: {"age": int(m.group(1)), "sex": _sex_from_word(m.group(2))}),
]

# label -> (regex pattern, field name, optional value transform)
# \b word boundaries prevent matches inside other words (the "Page 1" bug).
_PATTERNS = [
    (r"\bage\b\s*[:\-]\s*(\d{1,3})", "age", int),
    (r"\bage\b\s*[:\-]?\s*(\d{1,3})\s*(?:years?|yrs?)\b", "age", int),
    (r"\bsex\b\s*[:\-]\s*(male|female|m|f)\b", "sex", _sex_from_word),
    (r"\bgender\b\s*[:\-]\s*(male|female|m|f)\b", "sex", _sex_from_word),

    # Blood pressure: "Blood Pressure: 140" or "BP: 140/90" (takes systolic)
    (r"(?:resting\s+)?blood\s*pressure\b\s*[:\-]?\s*(\d{2,3})", "trestbps", float),
    (r"\bbp\b\s*[:\-]?\s*(\d{2,3})\s*/\s*\d{2,3}", "trestbps", float),
    (r"\bbp\b\s*[:\-]\s*(\d{2,3})", "trestbps", float),

    # Cholesterol - Total: handles both "Cholesterol: 200" and lab-report
    # table style "Cholesterol - Total ... 138 mg/dL" (method text / line
    # breaks in between, hence the non-greedy .{0,80} gap, DOTALL below).
    (r"cholesterol\s*-?\s*total\b.{0,80}?(\d{2,4})\s*mg\s*/?\s*d?l?", "chol", float),
    (r"\btotal\s*cholesterol\b\s*[:\-]?\s*(\d{2,4})", "chol", float),
    (r"\bcholesterol\b\s*[:\-]\s*(\d{2,4})\b", "chol", float),

    (r"(?:max(?:imum)?\s*)?heart\s*rate\b\s*[:\-]?\s*(\d{2,3})", "thalach", float),
    (r"\bfbs\b\s*[:\-]\s*(\d)\b", "fbs", int),
    (r"fasting\s*blood\s*sugar\b\s*[:\-]?\s*(\d)\b", "fbs", int),
    (r"\boldpeak\b\s*[:\-]\s*(\d+\.?\d*)", "oldpeak", float),
    (r"st\s*depression\b\s*[:\-]?\s*(\d+\.?\d*)", "oldpeak", float),
    (r"exercise[\s-]*induced\s*angina\b\s*[:\-]?\s*(\d|yes|no)\b", "exang", lambda v: 1 if v.lower() in ("1", "yes") else 0),
    (r"\bexang\b\s*[:\-]\s*(\d)\b", "exang", int),
    (r"chest\s*pain\s*type\b\s*[:\-]?\s*(\d)\b", "cp", int),
    (r"resting\s*ecg\b\s*[:\-]?\s*(\d)\b", "restecg", int),
    (r"\bslope\b\s*[:\-]\s*(\d)\b", "slope", int),
    (r"(?:major\s*)?vessels?\s*colou?red\b\s*[:\-]?\s*(\d)\b", "ca", int),
    (r"\bca\b\s*[:\-]\s*(\d)\b", "ca", int),
    (r"thal(?:assemia)?\b\s*[:\-]\s*(\d)\b", "thal", int),
]


def extract_text(pdf_path: str) -> str:
    text_parts = []
    try:
        with pdfplumber.open(pdf_path) as pdf:
            for page in pdf.pages:
                t = page.extract_text() or ""
                text_parts.append(t)
    except Exception:
        pass
    return "\n".join(text_parts)


def extract_clinical_fields(text: str) -> dict:
    """Returns only the fields it actually found in the text (not defaults)."""
    found = {}
    # Collapse newlines/extra whitespace so patterns can span line breaks
    # (lab report PDFs often put labels, methods, and values on separate lines).
    flat = re.sub(r"\s+", " ", text.lower())

    for pattern, extractor in _COMPOUND_PATTERNS:
        m = re.search(pattern, flat, re.DOTALL)
        if m:
            found.update(extractor(m))

    for pattern, field, transform in _PATTERNS:
        if field in found:
            continue  # already found (either by a compound pattern or an earlier pattern) - first match wins
        m = re.search(pattern, flat, re.DOTALL)
        if m:
            try:
                found[field] = transform(m.group(1))
            except (ValueError, TypeError):
                continue
    return found


def build_patient_dict(found: dict) -> dict:
    """Merges extracted fields over the clinical defaults so predict_risk()
    always gets a complete, valid input."""
    patient = dict(DEFAULTS)
    patient.update(found)
    return patient
