const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '..', 'uploads', 'wtc');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'wtc-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'picture') {
      // Check if file is an image
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Only image files are allowed for picture'), false);
      }
    } else {
      cb(null, true);
    }
  }
});

// WTC Registration Controller
class WTCController {
  constructor() {
    this.registrations = new Map(); // In-memory storage (replace with database)
    this.registrationCounter = 1000;
  }

  // Submit WTC registration
  async submitRegistration(req, res) {
    try {
      const formData = req.body;
      const uploadedFiles = req.files || {};

      // Generate registration ID
      const registrationId = `WTC${new Date().getFullYear()}${String(this.registrationCounter++).padStart(4, '0')}`;

      // Validate required fields (excluding maritalStatus and making professional fields optional)
      const requiredPersonalFields = [
        'name', 'sex', 'fatherName', 'dob', 'category', 'pwd', 'nationality'
      ];

      const requiredContactFields = [
        'currentAddress', 'permanentAddress', 'phoneNumber', 'email'
      ];

      const requiredProfessionalFields = [
        'dateOfAppointmentInRailway', 'modeOfAppointment', 'designation', 'unit'
      ];

      const requiredEducationFields = [
        'highestQualification', 'fieldOfStudy', 'institution', 'gradeType', 'gradeValue'
      ];

      const requiredCourseFields = [
        'ticketNo', 'batch', 'dateOfJoiningStcWtcNonRailway', 'moduleNo', 'courseDuration'
      ];

      const allRequiredFields = [
        ...requiredPersonalFields,
        ...requiredContactFields,
        ...requiredProfessionalFields,
        ...requiredEducationFields,
        ...requiredCourseFields
      ];

      // Check for missing required fields
      const missingFields = allRequiredFields.filter(field => {
        const value = formData[field];
        return !value || (typeof value === 'string' && !value.trim());
      });

      if (missingFields.length > 0) {
        return res.status(400).json({
          success: false,
          message: `Missing required fields: ${missingFields.join(', ')}`,
          missingFields
        });
      }

      // Validate conditional fields
      if (formData.pwd === 'Yes' && (!formData.typeOfDisability || !formData.typeOfDisability.trim())) {
        return res.status(400).json({
          success: false,
          message: 'Type of disability is required when PWD is Yes'
        });
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        return res.status(400).json({
          success: false,
          message: 'Please provide a valid email address'
        });
      }

      // Validate phone number
      const phoneRegex = /^[6-9]\d{9}$/;
      if (!phoneRegex.test(formData.phoneNumber)) {
        return res.status(400).json({
          success: false,
          message: 'Please provide a valid 10-digit phone number'
        });
      }

      // Validate grade value based on grade type
      if (formData.gradeType && formData.gradeValue) {
        const gradeValue = parseFloat(formData.gradeValue);

        if (formData.gradeType === 'CGPA (out of 10)') {
          if (isNaN(gradeValue) || gradeValue < 0 || gradeValue > 10) {
            return res.status(400).json({
              success: false,
              message: 'CGPA must be between 0 and 10'
            });
          }
        } else if (formData.gradeType === 'CGPA (out of 4)') {
          if (isNaN(gradeValue) || gradeValue < 0 || gradeValue > 4) {
            return res.status(400).json({
              success: false,
              message: 'CGPA must be between 0 and 4'
            });
          }
        } else if (formData.gradeType === 'Percentage') {
          if (isNaN(gradeValue) || gradeValue < 0 || gradeValue > 100) {
            return res.status(400).json({
              success: false,
              message: 'Percentage must be between 0 and 100'
            });
          }
        }
      }

      // Process uploaded picture
      let picturePath = null;
      if (uploadedFiles.picture) {
        picturePath = uploadedFiles.picture[0].filename;
      }

      // Create registration record
      const registrationData = {
        registrationId,
        submittedAt: new Date().toISOString(),
        status: 'submitted',

        // Personal Details (maritalStatus removed)
        picture: picturePath,
        name: formData.name?.trim(),
        sex: formData.sex,
        fatherName: formData.fatherName?.trim(),
        motherName: formData.motherName?.trim() || null,
        dob: formData.dob,
        category: formData.category,
        pwd: formData.pwd,
        typeOfDisability: formData.typeOfDisability?.trim() || null,
        nationality: formData.nationality?.trim() || 'INDIAN',

        // Contact Details
        currentAddress: formData.currentAddress?.trim(),
        permanentAddress: formData.permanentAddress?.trim(),
        phoneNumber: formData.phoneNumber?.trim(),
        emergencyContactNumber: formData.emergencyContactNumber?.trim() || null,
        email: formData.email?.trim().toLowerCase(),

        // Professional Details (made optional: workingUnder, hrmsId, pfNoNpsUps, employeeNumber)
        dateOfAppointmentInRailway: formData.dateOfAppointmentInRailway,
        modeOfAppointment: formData.modeOfAppointment,
        designation: formData.designation?.trim(),
        unit: formData.unit?.trim(),
        workingUnder: formData.workingUnder?.trim() || null, // Optional
        hrmsId: formData.hrmsId?.trim() || null, // Optional
        pfNoNpsUps: formData.pfNoNpsUps?.trim() || null, // Optional
        employeeNumber: formData.employeeNumber?.trim() || null, // Optional

        // Education Details (matching STC format)
        highestQualification: formData.highestQualification?.trim(),
        otherQualification: formData.otherQualification?.trim() || null,
        fieldOfStudy: formData.fieldOfStudy?.trim(),
        institution: formData.institution?.trim(),
        gradeType: formData.gradeType,
        gradeValue: formData.gradeValue?.trim(),

        // Course Details
        ticketNo: formData.ticketNo?.trim(),
        batch: formData.batch?.trim(),
        dateOfJoiningStcWtcNonRailway: formData.dateOfJoiningStcWtcNonRailway,
        dateOfSparing: formData.dateOfSparing || null,
        moduleNo: formData.moduleNo?.trim(),
        courseDuration: formData.courseDuration?.trim(),
      };

      // Store registration (replace with database save)
      this.registrations.set(registrationId, registrationData);

      // Log registration for debugging
      console.log('WTC Registration Successful:', {
        registrationId,
        name: registrationData.name,
        email: registrationData.email,
        designation: registrationData.designation,
        submittedAt: registrationData.submittedAt
      });

      // TODO: Send confirmation email
      // TODO: Send SMS notification
      // TODO: Save to database

      // Success response
      res.status(201).json({
        success: true,
        message: 'WTC registration submitted successfully',
        data: {
          registrationId,
          submittedAt: registrationData.submittedAt,
          name: registrationData.name,
          email: registrationData.email,
          ticketNo: registrationData.ticketNo,
          status: 'submitted'
        }
      });

    } catch (error) {
      console.error('WTC Registration Error:', error);

      if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            success: false,
            message: 'File size too large. Maximum allowed size is 5MB'
          });
        }
      }

      res.status(500).json({
        success: false,
        message: 'Internal server error occurred while processing registration'
      });
    }
  }

  // Get registration by ID
  async getRegistration(req, res) {
    try {
      const { registrationId } = req.params;

      const registration = this.registrations.get(registrationId);

      if (!registration) {
        return res.status(404).json({
          success: false,
          message: 'Registration not found'
        });
      }

      res.json({
        success: true,
        data: registration
      });

    } catch (error) {
      console.error('Get Registration Error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get all registrations (with pagination)
  async getAllRegistrations(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;

      const allRegistrations = Array.from(this.registrations.values());
      const total = allRegistrations.length;
      const paginatedData = allRegistrations.slice(offset, offset + limit);

      res.json({
        success: true,
        data: {
          registrations: paginatedData,
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
          }
        }
      });

    } catch (error) {
      console.error('Get All Registrations Error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Update registration status
  async updateRegistrationStatus(req, res) {
    try {
      const { registrationId } = req.params;
      const { status, remarks } = req.body;

      const validStatuses = ['submitted', 'under_review', 'approved', 'rejected', 'completed'];

      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Invalid status. Valid statuses are: ${validStatuses.join(', ')}`
        });
      }

      const registration = this.registrations.get(registrationId);

      if (!registration) {
        return res.status(404).json({
          success: false,
          message: 'Registration not found'
        });
      }

      // Update registration
      registration.status = status;
      registration.statusUpdatedAt = new Date().toISOString();
      if (remarks) {
        registration.remarks = remarks;
      }

      this.registrations.set(registrationId, registration);

      res.json({
        success: true,
        message: 'Registration status updated successfully',
        data: {
          registrationId,
          status,
          updatedAt: registration.statusUpdatedAt
        }
      });

    } catch (error) {
      console.error('Update Registration Status Error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Search registrations
  async searchRegistrations(req, res) {
    try {
      const { query, field } = req.query;

      if (!query) {
        return res.status(400).json({
          success: false,
          message: 'Search query is required'
        });
      }

      const searchFields = field ? [field] : ['name', 'email', 'ticketNo', 'registrationId'];
      const allRegistrations = Array.from(this.registrations.values());

      const results = allRegistrations.filter(registration => {
        return searchFields.some(searchField => {
          const fieldValue = registration[searchField];
          return fieldValue && fieldValue.toString().toLowerCase().includes(query.toLowerCase());
        });
      });

      res.json({
        success: true,
        data: {
          results,
          count: results.length,
          searchQuery: query,
          searchFields
        }
      });

    } catch (error) {
      console.error('Search Registrations Error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get registration statistics
  async getStatistics(req, res) {
    try {
      const allRegistrations = Array.from(this.registrations.values());

      const stats = {
        total: allRegistrations.length,
        byStatus: {},
        byDesignation: {},
        byCategory: {},
        byMonth: {},
        recentRegistrations: allRegistrations
          .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
          .slice(0, 5)
          .map(reg => ({
            registrationId: reg.registrationId,
            name: reg.name,
            designation: reg.designation,
            submittedAt: reg.submittedAt,
            status: reg.status
          }))
      };

      // Calculate statistics
      allRegistrations.forEach(reg => {
        // By status
        stats.byStatus[reg.status] = (stats.byStatus[reg.status] || 0) + 1;

        // By designation
        stats.byDesignation[reg.designation] = (stats.byDesignation[reg.designation] || 0) + 1;

        // By category
        stats.byCategory[reg.category] = (stats.byCategory[reg.category] || 0) + 1;

        // By month
        const month = new Date(reg.submittedAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long'
        });
        stats.byMonth[month] = (stats.byMonth[month] || 0) + 1;
      });

      res.json({
        success: true,
        data: stats
      });

    } catch (error) {
      console.error('Get Statistics Error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}

// Create controller instance
const wtcController = new WTCController();

module.exports = {
  WTCController,
  wtcController,
  upload
};
