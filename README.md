# 🫀 HeartRiskAI

### AI-Powered Heart Disease Risk Prediction System

HeartRiskAI is a machine learning-based web application that predicts the risk of heart disease using patient health and clinical parameters.

The system combines **Machine Learning, Explainable AI (SHAP), interactive visualizations, and a user-friendly web interface** to provide an understandable heart disease risk assessment.

> ⚠️ **Disclaimer:** This project is developed for educational and research purposes. It is not intended to replace professional medical diagnosis or treatment.

---

## ✨ Features

* 🫀 **Heart Disease Risk Prediction**
* 🧠 **Machine Learning-based Prediction**
* 🔍 **Explainable AI using SHAP**
* 📊 **Interactive Data Visualization**
* 🎯 **What-If Risk Simulator**
* 💡 **Personalized General Recommendations**
* 📄 **Risk Assessment Report Generation**
* 📋 **Patient Details Form**
* 📱 **Responsive and Modern User Interface**
* ⚡ **Fast API-based Backend**

---

## 🧠 Machine Learning

The system uses supervised machine learning algorithms to predict the possibility of heart disease.

### Models Used

* 🌲 Random Forest
* ⚡ XGBoost

### 🏆 Random Forest Performance

| Metric   |     Score |
| -------- | --------: |
| Accuracy | **88.5%** |
| ROC-AUC  | **0.958** |

### XGBoost Performance

| Metric   |     Score |
| -------- | --------: |
| Accuracy | **86.9%** |
| ROC-AUC  | **0.912** |

Based on the evaluated test results, **Random Forest achieved the best overall performance** and was selected as the primary prediction model.

> These results are based on the selected dataset and experimental setup and should not be considered clinical performance.

---

## 📊 Dataset

HeartRiskAI uses the **Cleveland Heart Disease Dataset** from the UCI Machine Learning Repository.

### Dataset Details

* **Records:** 303
* **Features:** 14
* **Problem Type:** Classification
* **Domain:** Cardiovascular Disease

### Important Features

The dataset includes clinical attributes such as:

* Age
* Sex
* Chest Pain Type
* Resting Blood Pressure
* Cholesterol
* Fasting Blood Sugar
* Resting ECG
* Maximum Heart Rate
* Exercise-Induced Angina
* ST Depression
* Slope
* Number of Major Vessels
* Thalassemia

### Data Preprocessing

The machine learning pipeline includes:

* Missing value handling
* Categorical feature encoding
* Feature scaling
* Data splitting
* Class balancing where required
* Model training and evaluation

---

## 🔍 Explainable AI — SHAP

One of the important features of HeartRiskAI is **Explainable Artificial Intelligence (XAI)**.

The system uses **SHAP (SHapley Additive exPlanations)** to explain the model's predictions.

Instead of simply showing whether a patient is predicted to be at risk, SHAP helps identify the features that contributed to the prediction.

For example, the system can analyze the contribution of:

* Age
* Cholesterol
* Blood Pressure
* Maximum Heart Rate
* Chest Pain
* Exercise-related parameters

This improves the **transparency and interpretability** of the machine learning model.

---

## 🔄 How It Works

```text
        Patient Details
              ↓
      Data Validation
              ↓
     Data Preprocessing
              ↓
    Machine Learning Model
              ↓
       Risk Prediction
              ↓
     SHAP Explanation
              ↓
    Risk Visualization
              ↓
 Recommendations & Report
```

---

## 🖥️ Application Modules

### 🏠 1. Dashboard

Provides an overview of the HeartRiskAI system and cardiovascular risk information.

### 👤 2. Patient Details

A user-friendly form collects the clinical parameters required for prediction.

### 🧠 3. Risk Prediction

The trained machine learning model processes the patient information and generates the predicted heart disease risk.

### 🔍 4. Explainability

SHAP-based visualizations explain the major factors influencing the prediction.

### 🎯 5. What-If Simulator

Users can change selected health parameters and observe how those changes may affect the model's predicted risk.

### 💡 6. Recommendations

The system provides general recommendations based on the predicted risk.

### 📄 7. Report Generation

Users can generate a risk assessment report containing prediction and relevant information.

### 📊 8. Data Visualization

Interactive charts help users understand prediction results and important risk factors.

---

## 🛠️ Technology Stack

### Frontend

* React.js
* Vite
* Tailwind CSS
* Framer Motion
* React Router
* Recharts
* Lucide React
* Axios

### Backend

* Python
* FastAPI
* Uvicorn

### Machine Learning

* Scikit-learn
* XGBoost
* Pandas
* NumPy
* Joblib
* SHAP

### Tools

* Git
* GitHub
* VS Code
* Jupyter Notebook

---

## 📁 Project Structure

```text
Heart_Disease_Risk_Prediction_System_Using_AL_ML/
│
├── backend/
│   └── backend/
│       ├── model/
│       ├── data/
│       ├── API files
│       └── other backend files
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

> The exact internal files may change as the project is updated.

---

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/sanskrt2345/Heart_Disease_Risk_Prediction_System_Using_AL_ML.git
```

Move into the project directory:

```bash
cd Heart_Disease_Risk_Prediction_System_Using_AL_ML
```

---

## 🐍 Backend Setup

Open a terminal and navigate to the backend folder:

```bash
cd backend/backend
```

Create a virtual environment:

```bash
python -m venv venv
```

### Windows

```bash
venv\Scripts\activate
```

Install the required dependencies:

```bash
pip install -r requirements.txt
```

Start the FastAPI server:

```bash
uvicorn main:app --reload
```

The backend will normally run at:

```text
http://127.0.0.1:8000
```

---

## ⚛️ Frontend Setup

Open another terminal.

Navigate to the frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The application will normally be available at:

```text
http://localhost:5173
```

---

## 🚀 Deployment

HeartRiskAI can be deployed using modern cloud platforms.

### Frontend

**Vercel** can be used to deploy the React/Vite frontend.

### Backend

**Render** can be used to deploy the FastAPI backend.

After deployment, the frontend API configuration should point to the deployed backend URL instead of the local API URL.

---

## 🔐 Security & Privacy

This project is intended for educational and research purposes.

* Do not enter real patient medical information.
* Use anonymized or sample data for demonstrations.
* Avoid storing personally identifiable health information.
* A production healthcare system would require appropriate security, privacy, validation, and regulatory compliance.

---

## 🎯 Project Objectives

The major objectives of HeartRiskAI are:

1. Develop an ML-based heart disease risk prediction system.
2. Provide an easy-to-use web application.
3. Apply Explainable AI to improve prediction transparency.
4. Visualize important cardiovascular risk factors.
5. Provide an interactive What-If simulation.
6. Generate an understandable risk assessment report.
7. Demonstrate the practical application of AI/ML in healthcare.

---

## 🔮 Future Scope

Future enhancements may include:

* 📱 Mobile application
* 🏥 Electronic Health Record integration
* 🤖 Advanced deep learning models
* 📊 Larger and more diverse datasets
* 🌐 Multi-language support
* ☁️ Scalable cloud deployment
* 🔐 Enhanced privacy and security
* 🩺 Clinical validation using real-world datasets
* 📈 Continuous model improvement

---

## 📚 Research Contribution

HeartRiskAI demonstrates the combination of **Machine Learning and Explainable AI** for cardiovascular disease risk prediction.

The project focuses not only on prediction performance but also on **model interpretability**, helping users understand the factors that influence the prediction.

---

## 👩‍💻 Author

### Sanskruti Majagaonkar

**Computer Engineering | AI & ML**

GitHub:
https://github.com/sanskrt2345

---

## 🙏 Acknowledgements

* UCI Machine Learning Repository
* Scikit-learn
* XGBoost
* SHAP
* React
* FastAPI
* Open-source developer community

---

## 📜 License

This project is developed for **educational, academic, research, and demonstration purposes**.

---

## ⭐ Show Your Support

If you found this project useful or interesting, consider giving the repository a ⭐ on GitHub.

### 🫀 Built with Machine Learning, Explainable AI, React & FastAPI.
