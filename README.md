# 🧾 Howden Job Queue Visualiser

This is a full-stack web application built for a technical assessment at Howden. It simulates a platform where users can submit and track jobs through a visual interface.

## 💡 What the App Does

The application is a two-page system:

1. ✅ Login Page  
   Users log in with their email and password. Authentication is simulated using a dummy user list on the backend.

2. 📊 Job Queue Page  
   After logging in, users can:
   - View their own submitted jobs
   - Toggle to view all users' jobs
   - Sort the table by any column (with arrows for asc/desc)
   - Search for jobs by status, ID, or creator
   - Download job result files or view error messages
   - Use pagination to navigate large datasets
   - Log out securely

## 📁 Tech Stack

- Frontend: React + TailwindCSS
- Backend: FastAPI (Python), Pandas (Excel parsing)
- State: React useState + localStorage (simulated auth)
- Styling: Utility-first with Tailwind + status icons

## 🧠 Assumptions Made

- Authentication is simulated, not production-grade (no password hashing or JWT verification).
- Excel file (HowdenTest.xlsx) contains two sheets with job data; third sheet was used only for field reference.
- All users are matched by submittedBy email.
- outputResult field refers to a downloadable file (if present).
- errorMessage is shown if there’s no output file.
- A single user can only access their jobs unless "View All" is enabled.

## 💻 How to Run Locally

### Prerequisites

- Node.js and npm
- Python 3.10+
- Git

---

### 🚀 1. Clone the repository

```bash
git clone https://github.com/your-username/howden-job-queue.git
cd howden-job-queue
```
### 🖥 2. Run the Frontend (React)

```
npm install
npm start
```
Your React app will start at http://localhost:3000

### ⚙️ 3. Run the Backend (FastAPI)

```
cd backend
python -m venv venv          # Create virtual environment
source venv/bin/activate     # macOS/Linux
# OR
venv\Scripts\activate        # Windows

pip install -r requirements.txt
uvicorn main:app --reload
```
Your FastAPI server will run at http://localhost:8000

### 🔐 Test User Logins
- christest@cedeconv.com - password123
- tmandel@test.com - password123
- christest@catkit.com - password123
- chrisProd.catkitTest@catkit.com - password123
- tmadmin@hyperiongrp.com - password123
- chadmin7@howdentiger.com - password123
- theo.mandel@howdenre.com - password123
- christian.harries@howdenre.com - password123

### 🧠 If I Had More Time...
- Implement proper authentication with hashed passwords and JWT tokens.

- Add user registration and account management.

- Store jobs in a database (e.g., PostgreSQL) instead of Excel.

- Add role-based access control (e.g., Admin vs. Analyst).

- Improve UI with animations, responsive design, and better status visuals.

- Add automated testing (unit + integration).

- Deploy to the cloud (Render, Vercel, or Azure).
