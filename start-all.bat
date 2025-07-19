@echo off
cd backend
start /B npm run dev
timeout /t 2
cd ../frontend
timeout /t 3
start http://localhost:5173
npm run dev
