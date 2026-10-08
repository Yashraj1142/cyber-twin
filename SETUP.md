# Python and Dependencies Setup Instructions

## Simple Method (Recommended)
Run one-time setup, then just double-click `run.bat` whenever you want to start:
```cmd
setup.bat      # Run this once to create venv
run.bat        # Run this whenever to start backend
```

## 1. Create Virtual Environment
```powershell
py -3.14 -m venv venv
```

## 2. Install Dependencies
```powershell
.\venv\Scripts\python.exe -m pip install -r requirements.txt
```

Dependencies:
- fastapi>=0.115,<1.0
- uvicorn[standard]>=0.30,<1.0
- docker>=7.1,<8.0
- python-multipart>=0.0.9,<1.0

## 3. Run Backend
**Using PowerShell (direct):**
```powershell
.\venv\Scripts\python.exe -m uvicorn backend.main:app --reload
```

**Using Command Prompt:**
```cmd
venv\Scripts\python.exe -m uvicorn backend.main:app --reload
```

**Using batch script:**
```cmd
run.bat
```

## 4. Start Frontend (optional)
```powershell
cd frontend
npm install
npm run dev
```

## Notes:
- Dependencies already installed in venv
- venv/ is in .gitignore
- Backend data in `backend/data` by default
- Set `VITE_API_BASE_URL` for different API URL