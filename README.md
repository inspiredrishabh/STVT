# Supervisor's Training Centre Management System

This project was developed for the **Supervisor's Training Centre, Northern Railways, Charbagh Lucknow** as part of the Summer Training Program. It is a comprehensive management system designed to streamline and digitize the operations of the training centre, including candidate management, attendance, certification, and more.

## Table of Contents
- [About the Project](#about-the-project)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup Instructions](#setup-instructions)
- [Usage](#usage)
- [Contributors](#contributors)

---

## About the Project
This system aims to automate and simplify the management of training activities at the Supervisor's Training Centre. It provides modules for:
- Candidate registration and management
- Attendance tracking
- Certificate generation
- Reporting and data export
- User authentication and access control

## Features
- Modern web-based interface for trainees and administrators
- Secure login and session management
- Role-based access for different user types
- Data export and backup utilities
- Responsive design for use on various devices

## Tech Stack
- **Frontend:** React, Vite, JavaScript, CSS, TailwindCSS
- **Backend:** Node.js, Express
- **Database:** SQLite3
- **Other:** RESTful APIs

## Setup Instructions (Windows Only)

> **Note:** These instructions are for Windows users only.

### Prerequisites
- [Node.js](https://nodejs.org/) (v14 or above recommended)
- [npm](https://www.npmjs.com/)
- [Git for Windows](https://git-scm.com/download/win) (for cloning the repository)

### 1. Clone the Repository
Open **Command Prompt** or **PowerShell** and run:
```bat
 git clone https://github.com/inspiredrishabh/STVT
 cd STVT
```

### 2. Install Dependencies
You need to install dependencies in both the frontend and backend directories:

#### Backend
```bat
cd backend
npm install
cd ..
```

#### Frontend
```bat
cd frontend
npm install
cd ..
```

### 3. Start the Application
Use the provided batch file to start both frontend and backend servers:

```bat
start-all.bat
```

This will launch both the backend and frontend servers. By default, the frontend will be available at [http://localhost:5173](http://localhost:5173) and the backend at [http://localhost:5000](http://localhost:5000) (or as configured).

---

## Usage
- Access the application via your browser at the frontend URL.
- Login with your credentials (provided by the admin).
- Use the dashboard to manage candidates, attendance, certificates, and more.

---

## Contributors
This project was developed by the following team members during the Summer Training Program:

- Rishabh Gupta
- Awanish Yadav
- Pratyush Kumar Singh
- Priyanshu Raj
- Somesh Pratap Singh
- Shivam Yadav
- Venkatesh
- Pallavi Tripathi
- Shivansh Kumar

---

## License
This project is intended for educational and internal use at the Supervisor's Training Centre, Northern Railways.

---

For any queries or support, please contact the project contributors or the Supervisor's Training Centre administration.
