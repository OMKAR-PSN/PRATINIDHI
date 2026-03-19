# How to Run Pratinidhi AI

To run the full platform locally, you will need to open **two separate terminal windows** (one for the frontend and one for the backend).

---

## 1. Start the Frontend (React + Vite)
Open your first terminal and run the following commands:

```bash
# Navigate to the frontend directory
cd janavatar-ai/frontend

# Install dependencies (only required the first time)
npm install

# Start the Vite development server
npm run dev
```
*The frontend interface will become available at `http://localhost:3000` (or `http://localhost:5173`).*

---

## 2. Start the Backend (Python + FastAPI)
Open a **second, separate terminal** so both servers can run simultaneously. Run the following commands:

```bash
# Navigate to the backend directory
cd janavatar-ai/backend

# Install the required Python packages (only required the first time)
pip install -r requirements.txt

# Start the FastAPI backend server
uvicorn main:app --reload

# Alternative option (if main.py is set up as a standalone script):
# python main.py
```
*The backend API will start on `http://localhost:8000`.*

---

**Note:** Both terminals must remain open and running while you are using the application.
