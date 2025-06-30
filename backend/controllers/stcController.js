const express = require('express');

// STC (Signal Training Centre) Controller
class STCController {
  constructor() {
    // Mock trainee data matching frontend FeedMark candidatesData
    this.trainees = new Map([
      [1, {
        id: 1,
        ticketNo: 'STC2024001',
        name: 'Rahul Kumar',
        designation: 'MSE',
        unit: 'JAT',
        batch: '2024-2025',
        email: 'rahul.kumar@railway.gov.in',
        phone: '9876543210',
        picture: null,
        courseCode: 'MSE-C&W',
        course: {
          moduleNo: 'MSE-C&W',
          duration: '52 Weeks',
          joiningDate: '2024-01-15',
          sparingDate: '2025-01-15'
        },
        lineTraining: {
          status: 'Completed',
          duration: '6 months',
          location: 'JAT Division'
        },
        status: 'Active',
        personalDetails: {
          fatherName: 'Ram Kumar',
          motherName: 'Sita Devi',
          dob: '1995-05-15',
          category: 'General',
          nationality: 'Indian',
          currentAddress: 'Jaipur, Rajasthan',
          permanentAddress: 'Jaipur, Rajasthan'
        },
        professionalDetails: {
          dateOfAppointment: '2023-06-15',
          modeOfAppointment: 'RRB',
          workingUnder: 'DRM JAT',
          hrmsId: 'HRMS001',
          pfNo: 'PF001',
          employeeNumber: 'EMP001'
        },
        educationDetails: {
          highestQualification: 'B.Tech',
          fieldOfStudy: 'Mechanical Engineering',
          institution: 'IIT Delhi',
          gradeType: 'CGPA (out of 10)',
          gradeValue: '8.5'
        }
      }],
      [2, {
        id: 2,
        ticketNo: 'STC2024002',
        name: 'Priya Sharma',
        designation: 'MSE',
        unit: 'FZD',
        batch: '2024-2025',
        email: 'priya.sharma@railway.gov.in',
        phone: '9876543211',
        picture: null,
        courseCode: 'MSE-D',
        course: {
          moduleNo: 'MSE-D',
          duration: '52 Weeks',
          joiningDate: '2024-02-01',
          sparingDate: '2025-02-01'
        },
        lineTraining: {
          status: 'In Progress',
          duration: '6 months',
          location: 'FZD Division'
        },
        status: 'Active',
        personalDetails: {
          fatherName: 'Mohan Sharma',
          motherName: 'Geeta Sharma',
          dob: '1996-08-22',
          category: 'OBC',
          nationality: 'Indian',
          currentAddress: 'Firozabad, UP',
          permanentAddress: 'Firozabad, UP'
        },
        professionalDetails: {
          dateOfAppointment: '2023-07-01',
          modeOfAppointment: 'RRB',
          workingUnder: 'DRM FZD',
          hrmsId: 'HRMS002',
          pfNo: 'PF002',
          employeeNumber: 'EMP002'
        },
        educationDetails: {
          highestQualification: 'B.E.',
          fieldOfStudy: 'Electrical Engineering',
          institution: 'VNIT Nagpur',
          gradeType: 'Percentage',
          gradeValue: '82.5'
        }
      }],
      [3, {
        id: 3,
        ticketNo: 'STC2024003',
        name: 'Amit Singh',
        designation: 'MSE',
        unit: 'MB',
        batch: '2024-2025',
        email: 'amit.singh@railway.gov.in',
        phone: '9876543212',
        picture: null,
        courseCode: 'MSE-W',
        course: {
          moduleNo: 'MSE-W',
          duration: '52 Weeks',
          joiningDate: '2024-03-01',
          sparingDate: '2025-03-01'
        },
        lineTraining: {
          status: 'Scheduled',
          duration: '6 months',
          location: 'MB Division'
        },
        status: 'Active',
        personalDetails: {
          fatherName: 'Rajesh Singh',
          motherName: 'Sunita Singh',
          dob: '1997-02-10',
          category: 'General',
          nationality: 'Indian',
          currentAddress: 'Moradabad, UP',
          permanentAddress: 'Moradabad, UP'
        },
        professionalDetails: {
          dateOfAppointment: '2023-08-15',
          modeOfAppointment: 'RRB',
          workingUnder: 'DRM MB',
          hrmsId: 'HRMS003',
          pfNo: 'PF003',
          employeeNumber: 'EMP003'
        },
        educationDetails: {
          highestQualification: 'B.Tech',
          fieldOfStudy: 'Civil Engineering',
          institution: 'NIT Kurukshetra',
          gradeType: 'CGPA (out of 10)',
          gradeValue: '7.8'
        }
      }],
      [4, {
        id: 4,
        ticketNo: 'STC2024004',
        name: 'Neha Gupta',
        designation: 'MJR',
        unit: 'MB',
        batch: '2024-2025',
        email: 'neha.gupta@railway.gov.in',
        phone: '9876543213',
        picture: null,
        courseCode: 'MJR-C&W',
        course: {
          moduleNo: 'MJR-C&W',
          duration: '52 Weeks',
          joiningDate: '2024-01-15',
          sparingDate: '2025-01-15'
        },
        lineTraining: {
          status: 'Completed',
          duration: '6 months',
          location: 'MB Division'
        },
        status: 'Active',
        personalDetails: {
          fatherName: 'Vinod Gupta',
          motherName: 'Meera Gupta',
          dob: '1996-11-30',
          category: 'General',
          nationality: 'Indian',
          currentAddress: 'Moradabad, UP',
          permanentAddress: 'Moradabad, UP'
        },
        professionalDetails: {
          dateOfAppointment: '2023-06-01',
          modeOfAppointment: 'RRB',
          workingUnder: 'DRM MB',
          hrmsId: 'HRMS004',
          pfNo: 'PF004',
          employeeNumber: 'EMP004'
        },
        educationDetails: {
          highestQualification: 'Diploma',
          fieldOfStudy: 'Mechanical Engineering',
          institution: 'Government Polytechnic',
          gradeType: 'Percentage',
          gradeValue: '75.0'
        }
      }],
      [5, {
        id: 5,
        ticketNo: 'STC2024005',
        name: 'Vikash Yadav',
        designation: 'MJR',
        unit: 'FZD',
        batch: '2024-2025',
        email: 'vikash.yadav@railway.gov.in',
        phone: '9876543214',
        picture: null,
        courseCode: 'MJR-D',
        course: {
          moduleNo: 'MJR-D',
          duration: '52 Weeks',
          joiningDate: '2024-02-01',
          sparingDate: '2025-02-01'
        },
        lineTraining: {
          status: 'In Progress',
          duration: '6 months',
          location: 'FZD Division'
        },
        status: 'Active',
        personalDetails: {
          fatherName: 'Krishna Yadav',
          motherName: 'Radha Yadav',
          dob: '1998-07-20',
          category: 'OBC',
          nationality: 'Indian',
          currentAddress: 'Firozabad, UP',
          permanentAddress: 'Firozabad, UP'
        },
        professionalDetails: {
          dateOfAppointment: '2023-07-15',
          modeOfAppointment: 'RRB',
          workingUnder: 'DRM FZD',
          hrmsId: 'HRMS005',
          pfNo: 'PF005',
          employeeNumber: 'EMP005'
        },
        educationDetails: {
          highestQualification: 'B.Tech',
          fieldOfStudy: 'Electrical Engineering',
          institution: 'AKTU University',
          gradeType: 'CGPA (out of 10)',
          gradeValue: '7.2'
        }
      }],
      [6, {
        id: 6,
        ticketNo: 'STC2024006',
        name: 'Sunita Devi',
        designation: 'MJR',
        unit: 'JAT',
        batch: '2024-2025',
        email: 'sunita.devi@railway.gov.in',
        phone: '9876543215',
        picture: null,
        courseCode: 'MJR-W',
        course: {
          moduleNo: 'MJR-W',
          duration: '52 Weeks',
          joiningDate: '2024-03-01',
          sparingDate: '2025-03-01'
        },
        lineTraining: {
          status: 'Scheduled',
          duration: '6 months',
          location: 'JAT Division'
        },
        status: 'Active',
        personalDetails: {
          fatherName: 'Ram Chander',
          motherName: 'Kamala Devi',
          dob: '1997-12-05',
          category: 'SC',
          nationality: 'Indian',
          currentAddress: 'Jaipur, Rajasthan',
          permanentAddress: 'Jaipur, Rajasthan'
        },
        professionalDetails: {
          dateOfAppointment: '2023-08-01',
          modeOfAppointment: 'RRB',
          workingUnder: 'DRM JAT',
          hrmsId: 'HRMS006',
          pfNo: 'PF006',
          employeeNumber: 'EMP006'
        },
        educationDetails: {
          highestQualification: 'B.Sc.',
          fieldOfStudy: 'Physics',
          institution: 'Rajasthan University',
          gradeType: 'Percentage',
          gradeValue: '68.5'
        }
      }]
    ]);
  }

  // Get all trainees
  async getAllTrainees(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 50;
      const offset = (page - 1) * limit;

      const allTrainees = Array.from(this.trainees.values());
      const total = allTrainees.length;
      const paginatedData = allTrainees.slice(offset, offset + limit);

      res.json({
        success: true,
        data: {
          trainees: paginatedData,
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
          }
        }
      });

    } catch (error) {
      console.error('Get All Trainees Error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get trainee by ID
  async getTraineeById(req, res) {
    try {
      const { traineeId } = req.params;
      const trainee = this.trainees.get(parseInt(traineeId));

      if (!trainee) {
        return res.status(404).json({
          success: false,
          message: 'Trainee not found'
        });
      }

      res.json({
        success: true,
        data: trainee
      });

    } catch (error) {
      console.error('Get Trainee By ID Error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get trainee by ticket number
  async getTraineeByTicket(req, res) {
    try {
      const { ticketNo } = req.params;
      const trainee = Array.from(this.trainees.values()).find(t => t.ticketNo === ticketNo);

      if (!trainee) {
        return res.status(404).json({
          success: false,
          message: 'Trainee not found'
        });
      }

      res.json({
        success: true,
        data: trainee
      });

    } catch (error) {
      console.error('Get Trainee By Ticket Error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Search trainees
  async searchTrainees(req, res) {
    try {
      const { query, field } = req.query;

      if (!query) {
        return res.status(400).json({
          success: false,
          message: 'Search query is required'
        });
      }

      const searchFields = field ? [field] : ['name', 'ticketNo', 'designation', 'unit', 'courseCode'];
      const allTrainees = Array.from(this.trainees.values());

      const results = allTrainees.filter(trainee => {
        return searchFields.some(searchField => {
          const fieldValue = trainee[searchField];
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
      console.error('Search Trainees Error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get trainee statistics
  async getTraineeStatistics(req, res) {
    try {
      const allTrainees = Array.from(this.trainees.values());

      const stats = {
        total: allTrainees.length,
        byDesignation: {},
        byUnit: {},
        byCourse: {},
        byStatus: {},
        byLineTrainingStatus: {},
        recentTrainees: allTrainees
          .sort((a, b) => new Date(b.course.joiningDate) - new Date(a.course.joiningDate))
          .slice(0, 5)
          .map(trainee => ({
            id: trainee.id,
            ticketNo: trainee.ticketNo,
            name: trainee.name,
            designation: trainee.designation,
            unit: trainee.unit,
            joiningDate: trainee.course.joiningDate,
            status: trainee.status
          }))
      };

      // Calculate statistics
      allTrainees.forEach(trainee => {
        // By designation
        stats.byDesignation[trainee.designation] = (stats.byDesignation[trainee.designation] || 0) + 1;

        // By unit
        stats.byUnit[trainee.unit] = (stats.byUnit[trainee.unit] || 0) + 1;

        // By course
        stats.byCourse[trainee.courseCode] = (stats.byCourse[trainee.courseCode] || 0) + 1;

        // By status
        stats.byStatus[trainee.status] = (stats.byStatus[trainee.status] || 0) + 1;

        // By line training status
        stats.byLineTrainingStatus[trainee.lineTraining.status] = (stats.byLineTrainingStatus[trainee.lineTraining.status] || 0) + 1;
      });

      res.json({
        success: true,
        data: stats
      });

    } catch (error) {
      console.error('Get Trainee Statistics Error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Health check
  async healthCheck(req, res) {
    res.json({
      status: 'OK',
      service: 'STC Trainee Management API',
      timestamp: new Date().toISOString(),
      endpoints: [
        'GET /api/stc/trainees',
        'GET /api/stc/trainee/:traineeId',
        'GET /api/stc/trainee/ticket/:ticketNo',
        'GET /api/stc/trainees/search',
        'GET /api/stc/trainees/statistics',
        'GET /api/stc/health'
      ]
    });
  }
}

// Create controller instance
const stcController = new STCController();

module.exports = {
  STCController,
  stcController
};
