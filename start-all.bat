@echo off
cd backend
start /B npm run dev
timeout /t 2
cd ../frontend
npm run dev
