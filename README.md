# 🚀 PropelAI

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)

**PropelAI** is an advanced, AI-driven startup guidance platform and "Map-Truth Engine" designed to turn subjective business pitches into objective, data-backed risk assessments. By combining ensemble machine learning (achieving 85.26% accuracy on startup success prediction), multi-agent simulations, and explainable AI (XAI), PropelAI helps founders validate ideas and navigate early-stage growth.

---

## 📋 Table of Contents
- [Features](#-features)
- [System Architecture](#-system-architecture)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [License](#-license)

---

## ✨ Features

- **Success Prediction Engine (ML & XAI):** Evaluates startup profiles using an ensemble model trained on historical data. Uses **SHAP (SHapley Additive exPlanations)** to visually break down the positive drivers and negative risks impacting the score.
- **Founder's War Room:** A multi-agent simulation where specialized AI personas (VC, CTO, Regulatory, etc.) stress-test the startup's pitch. Features a dynamic **Friction Map** visualizing alignment across business dimensions.
- **Real-Time AI Advisor:** An elite venture coach powered by **Llama-3.3-70b** (via Groq), utilizing Server-Sent Events (SSE) for low-latency, context-aware token streaming.
- **Automated Strategic Reporting:** Dynamically generates highly formatted, professional PDF Strategic Briefs using `pdfkit`, complete with clean debate transcripts and pivot recommendations.

---

## 🏗️ System Architecture

<img width="391" height="697" alt="Screenshot 2026-05-13 114612" src="https://github.com/user-attachments/assets/1f0285c0-d446-4988-ac2c-95ad16ffcdf4" />

---

## 💻 Tech Stack

### Frontend (Client)
- **React.js** (Functional components, Hooks)
- **Axios** (API communication)
- **Custom CSS** (Dynamic styling for Friction Maps and agentic chat interfaces)

### Backend (API Gateway & PDF Engine)
- **Node.js & Express.js** (REST API, SSE streaming)
- **Mongoose / MongoDB** (Data persistence)
- **PDFKit** (Dynamic server-side document generation)
- **Groq SDK** (LLM inference)

### ML & AI Microservice
- **Python 3.10+**
- **FastAPI** (High-performance ML serving)
- **SHAP** (Explainable AI mathematical modeling)
- **Scikit-Learn / Pandas** (Ensemble model execution)

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing.

### Prerequisites
- Node.js (v18.x or higher)
- Python (3.9.x or higher)
- Git

### Installation

**1. Clone the repository**
```bash
git clone [https://github.com/yourusername/PropelAI.git](https://github.com/yourusername/PropelAI.git)
cd PropelAI
```

**2. Setup the Node.js Backend**
```bash
cd backend
npm install
npm start
```
The backend will run on http://localhost:5000

**3. Setup the Python ML Microservice**
```bash
cd ../ml-service
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
The ML service will run on http://127.0.0.1:8000

**4. Setup the React Frontend**
```bash
cd ../frontend
npm install
npm start
```
The frontend will run on http://localhost:3000

## 🔐 Environment Variables
Create a .env file in the root of your /backend directory and add the following keys:

```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
GROQ_API_KEY=your_groq_api_key
ML_SERVICE_URL=[http://127.0.0.1:8000](http://127.0.0.1:8000)
```
## 📡 API Reference

**Advisor Routes (/api/advisor)**
- ``` GET /my-startup ``` - Retrieve the authenticated user's active startup profile.
- ``` POST /ask ``` - Stream Llama-3 responses via SSE based on context.
- ``` POST /war-room/simulate ``` - Trigger the Python ML service to run the multi-agent debate.

**Report Generation (/api/warroom)**
- ``` POST /generate-report ``` - Consumes frontend session data and streams back a dynamically generated PDF Strategic Brief.

## 👥 Contributors
- Shambhavi Raj
- Shardul Bangale
- Vishwanath Mishra
- Aaditya Jain
