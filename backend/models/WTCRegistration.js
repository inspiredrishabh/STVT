// WTC (Workshop Training Centre) Registration Model
// This model defines the structure for WTC registrations

class WTCRegistration {
  constructor(data) {
    // Registration metadata
    this.registrationId = data.registrationId;
    this.submittedAt = data.submittedAt || new Date().toISOString();
    this.status = data.status || 'submitted';
    this.statusUpdatedAt = data.statusUpdatedAt;
    this.remarks = data.remarks;

    // Personal Details (maritalStatus removed as per requirement)
    this.picture = data.picture;
    this.name = data.name;
    this.sex = data.sex;
    this.fatherName = data.fatherName;
    this.motherName = data.motherName;
    this.dob = data.dob;
    this.category = data.category;
    this.pwd = data.pwd;
    this.typeOfDisability = data.typeOfDisability;
    this.nationality = data.nationality || 'INDIAN';
    // maritalStatus field removed

    // Contact Details
    this.currentAddress = data.currentAddress;
    this.permanentAddress = data.permanentAddress;
    this.phoneNumber = data.phoneNumber;
    this.emergencyContactNumber = data.emergencyContactNumber;
    this.email = data.email;

    // Professional Details (made optional: workingUnder, hrmsId, pfNoNpsUps, employeeNumber)
    this.dateOfAppointmentInRailway = data.dateOfAppointmentInRailway;
    this.modeOfAppointment = data.modeOfAppointment;
    this.designation = data.designation;
    this.unit = data.unit;
    this.workingUnder = data.workingUnder; // Now optional
    this.hrmsId = data.hrmsId; // Now optional
    this.pfNoNpsUps = data.pfNoNpsUps; // Now optional
    this.employeeNumber = data.employeeNumber; // Now optional

    // Education Details (matching STC format)
    this.highestQualification = data.highestQualification;
    this.otherQualification = data.otherQualification;
    this.fieldOfStudy = data.fieldOfStudy;
    this.institution = data.institution;
    this.gradeType = data.gradeType;
    this.gradeValue = data.gradeValue;

    // Course Details
    this.ticketNo = data.ticketNo;
    this.batch = data.batch;
    this.dateOfJoiningStcWtcNonRailway = data.dateOfJoiningStcWtcNonRailway;
    this.dateOfSparing = data.dateOfSparing;
    this.moduleNo = data.moduleNo;
    this.courseDuration = data.courseDuration;
  }

  // Validation methods
  validateRequired() {
    const requiredFields = [
      // Personal (excluding maritalStatus)
      'name', 'sex', 'fatherName', 'dob', 'category', 'pwd', 'nationality',
      // Contact
      'currentAddress', 'permanentAddress', 'phoneNumber', 'email',
      // Professional (excluding workingUnder, hrmsId, pfNoNpsUps, employeeNumber)
      'dateOfAppointmentInRailway', 'modeOfAppointment', 'designation', 'unit',
      // Course
      'ticketNo', 'batch', 'dateOfJoiningStcWtcNonRailway', 'moduleNo', 'courseDuration'
    ];

    const missing = requiredFields.filter(field => !this[field] || !this[field].toString().trim());
    return {
      isValid: missing.length === 0,
      missingFields: missing
    };
  }

  validateConditional() {
    const errors = [];

    // PWD validation
    if (this.pwd === 'Yes' && (!this.typeOfDisability || !this.typeOfDisability.trim())) {
      errors.push('Type of disability is required when PWD is Yes');
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (this.email && !emailRegex.test(this.email)) {
      errors.push('Invalid email format');
    }

    // Phone number validation
    const phoneRegex = /^[6-9]\d{9}$/;
    if (this.phoneNumber && !phoneRegex.test(this.phoneNumber)) {
      errors.push('Invalid phone number format');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Convert to plain object for storage/transmission
  toObject() {
    return { ...this };
  }

  // Static method to create from plain object
  static fromObject(obj) {
    return new WTCRegistration(obj);
  }

  // Get summary for listing
  getSummary() {
    return {
      registrationId: this.registrationId,
      name: this.name,
      email: this.email,
      designation: this.designation,
      ticketNo: this.ticketNo,
      batch: this.batch,
      status: this.status,
      submittedAt: this.submittedAt
    };
  }
}

// Status constants
const WTC_STATUS = {
  SUBMITTED: 'submitted',
  UNDER_REVIEW: 'under_review',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  COMPLETED: 'completed'
};

// Category constants
const WTC_CATEGORIES = {
  GENERAL: 'General',
  OBC: 'OBC',
  SC: 'SC',
  ST: 'ST',
  EWS: 'EWS'
};

// PWD constants
const PWD_OPTIONS = {
  YES: 'Yes',
  NO: 'No'
};

module.exports = {
  WTCRegistration,
  WTC_STATUS,
  WTC_CATEGORIES,
  PWD_OPTIONS
};
