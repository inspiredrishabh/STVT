# WTC Registration System Updates

## Overview
This document outlines the changes made to the WTC (Workshop Training Centre) registration system as per requirements:

1. ✅ **Removed marital status** from personal details section
2. ✅ **Made professional fields optional**: Employee Number, Working Under, PF/NPS/UPS No., HRMS ID
3. ✅ **Updated all backend endpoints** accordingly

## Frontend Changes

### 📝 Personal Details (WTC/form/Personal.jsx)
**Changes Made:**
- ❌ Removed `maritalStatus` field from form
- ❌ Removed `maritalStatus` validation logic
- ❌ Removed `maritalStatus` from optional fields array

**Impact:**
- Users no longer need to provide marital status during registration
- Form is shorter and more focused on essential personal information

### 💼 Professional Details (WTC/form/Professional.jsx)
**Changes Made:**
- ✅ Made these fields **NON-MANDATORY**:
  - Employee Number (`employeeNumber`)
  - Working Under (`workingUnder`)
  - PF/NPS/UPS No. (`pfNoNpsUps`)
  - HRMS ID (`hrmsId`)
- ❌ Removed these fields from `requiredFields` array
- ✅ Added `required: false` property to field definitions

**Impact:**
- These professional fields are now optional
- Users can submit the form without providing these details
- Fields will still appear in the form but won't prevent submission if empty

### 🏠 Main Form (WTC/form/WtcMain.jsx)
**Changes Made:**
- ❌ Removed `maritalStatus: ""` from initial formData state

**Impact:**
- Form state no longer includes marital status
- Cleaner data structure

## Backend Changes

### 🚀 New WTC Controller (backend/controllers/wtcController.js)
**Features:**
- ✅ Complete WTC registration handling
- ✅ File upload support for pictures (using Multer)
- ✅ Comprehensive validation (excluding maritalStatus, making professional fields optional)
- ✅ Email and phone number validation
- ✅ Registration ID generation (WTC2024XXXX format)
- ✅ In-memory storage (easily replaceable with database)
- ✅ Error handling and detailed responses

### 🛣️ New WTC Routes (backend/routes/wtcRoutes.js)
**Endpoints:**
```
POST   /api/wtc/submit                    - Submit WTC registration
GET    /api/wtc/registration/:id          - Get specific registration
GET    /api/wtc/registrations             - Get all registrations (paginated)
PUT    /api/wtc/registration/:id/status   - Update registration status
GET    /api/wtc/search                    - Search registrations
GET    /api/wtc/statistics                - Get registration statistics
GET    /api/wtc/health                    - Health check
```

### 📊 New WTC Model (backend/models/WTCRegistration.js)
**Features:**
- ✅ Complete data model without maritalStatus
- ✅ Optional professional fields (workingUnder, hrmsId, pfNoNpsUps, employeeNumber)
- ✅ Validation methods
- ✅ Status constants and utilities
- ✅ Summary methods for listing views

### ⚙️ Server Configuration (backend/server.js)
**Updates:**
- ✅ Added WTC routes (`/api/wtc/*`)
- ✅ Updated logging to show both STC and WTC endpoints
- ✅ Maintained backward compatibility with existing STC routes

### 📦 Dependencies (backend/package.json)
**Updates:**
- ✅ Added `multer: ^1.4.5-lts.1` for file uploads
- ✅ Removed `"type": "module"` for CommonJS compatibility
- ✅ Updated start script to use `server.js`

## API Documentation

### Submit WTC Registration
```http
POST /api/wtc/submit
Content-Type: multipart/form-data

{
  // Personal Details (maritalStatus removed)
  "picture": <file>,
  "name": "John Doe",
  "sex": "Male",
  "fatherName": "Father Name",
  "motherName": "Mother Name", // optional
  "dob": "1990-01-01",
  "category": "General",
  "pwd": "No",
  "typeOfDisability": "", // required if pwd = "Yes"
  "nationality": "INDIAN",
  
  // Contact Details
  "currentAddress": "Current Address",
  "permanentAddress": "Permanent Address",
  "phoneNumber": "9876543210",
  "emergencyContactNumber": "9876543211", // optional
  "email": "john@example.com",
  
  // Professional Details (optional fields marked)
  "dateOfAppointmentInRailway": "2020-01-01",
  "modeOfAppointment": "RRB",
  "designation": "Technical Staff",
  "unit": "Workshop Unit",
  "workingUnder": "Supervisor Name", // ✅ NOW OPTIONAL
  "hrmsId": "HRMS123456", // ✅ NOW OPTIONAL
  "pfNoNpsUps": "PF123456", // ✅ NOW OPTIONAL
  "employeeNumber": "EMP001", // ✅ NOW OPTIONAL
  
  // Education Details
  "highestQualification": "B.Tech",
  "fieldOfStudy": "Mechanical Engineering",
  // ... other education fields
  
  // Course Details
  "ticketNo": "WTC001",
  "batch": "2024-01",
  "dateOfJoiningStcWtcNonRailway": "2024-01-01",
  "moduleNo": "MOD001",
  "courseDuration": "6 Months"
}
```

**Response:**
```json
{
  "success": true,
  "message": "WTC registration submitted successfully",
  "data": {
    "registrationId": "WTC20241001",
    "submittedAt": "2024-01-01T00:00:00.000Z",
    "name": "John Doe",
    "email": "john@example.com",
    "ticketNo": "WTC001",
    "status": "submitted"
  }
}
```

## Field Status Summary

### Required Fields ✅
**Personal Details:**
- picture, name, sex, fatherName, dob, category, pwd, nationality

**Contact Details:**
- currentAddress, permanentAddress, phoneNumber, email

**Professional Details:**
- dateOfAppointmentInRailway, modeOfAppointment, designation, unit

**Course Details:**
- ticketNo, batch, dateOfJoiningStcWtcNonRailway, moduleNo, courseDuration

### Optional Fields ⚪
**Personal Details:**
- motherName, typeOfDisability

**Contact Details:**
- emergencyContactNumber

**Professional Details:** (✅ NEWLY OPTIONAL)
- workingUnder
- hrmsId  
- pfNoNpsUps
- employeeNumber

**Education Details:**
- thesisTitle, additionalQualification fields

### Removed Fields ❌
- **maritalStatus** (completely removed from personal details)

## Installation & Setup

### Backend Dependencies
```bash
cd backend
npm install multer
npm install  # Install all dependencies
```

### Start the Server
```bash
cd backend
npm run dev  # Development mode with nodemon
# OR
npm start    # Production mode
```

**Server will run on:** `http://localhost:5000`
- STC API: `http://localhost:5000/api/stc`
- WTC API: `http://localhost:5000/api/wtc`

### Frontend (No additional dependencies needed)
```bash
cd frontend
npm run dev
```

## Testing

### Test WTC Registration Submission
```bash
curl -X POST http://localhost:5000/api/wtc/submit \
  -F "name=Test User" \
  -F "sex=Male" \
  -F "fatherName=Test Father" \
  -F "dob=1990-01-01" \
  -F "category=General" \
  -F "pwd=No" \
  -F "nationality=INDIAN" \
  -F "currentAddress=Test Address" \
  -F "permanentAddress=Test Address" \
  -F "phoneNumber=9876543210" \
  -F "email=test@example.com" \
  -F "dateOfAppointmentInRailway=2020-01-01" \
  -F "modeOfAppointment=RRB" \
  -F "designation=Test Designation" \
  -F "unit=Test Unit" \
  -F "ticketNo=TEST001" \
  -F "batch=2024-01" \
  -F "dateOfJoiningStcWtcNonRailway=2024-01-01" \
  -F "moduleNo=MOD001" \
  -F "courseDuration=6 Months"
```

### Check Health
```bash
curl http://localhost:5000/api/wtc/health
```

## Migration Notes

1. **Existing Data:** Any existing registrations with maritalStatus will need to be migrated
2. **Frontend Forms:** All WTC forms now properly handle optional professional fields
3. **Validation:** Backend validation updated to reflect new field requirements
4. **API Compatibility:** New endpoints maintain RESTful standards

## Future Enhancements

- 🗄️ Database integration (replace in-memory storage)
- 📧 Email notification system
- 📱 SMS integration
- 📊 Advanced analytics dashboard
- 🔐 Authentication and authorization
- 📁 Document management system
- 🔄 Data export/import functionality

---

**✅ All requirements completed successfully!**
- ❌ Marital status removed from personal details
- ✅ Professional fields made optional (Employee Number, Working Under, PF/NPS/UPS No., HRMS ID)
- 🚀 Complete backend endpoints with comprehensive API
- 📝 Detailed documentation and testing instructions
