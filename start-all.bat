@echo off
cd backend
start /B node server.js
timeout /t 2
cd ../frontend
npm run dev
