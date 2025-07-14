const { generateTicketNumber } = require("../utils/ticketGenerator");
const fs = require("fs");
const path = require("path");

class StcController {
  constructor(stcModel) {
    this.stcModel = stcModel;
  }

  async createCandidate(req, res) {
    try {
      const candidateData = req.body;

      // Generate ticket number
      const ticketNumber = await generateTicketNumber(
        candidateData.designation,
        "stc"
      );
      candidateData.ticket_no = ticketNumber;

      // Handle image upload
      if (req.file) {
        const imagePath = await this.handleImageUpload(
          req.file,
          ticketNumber,
          "stc"
        );
        candidateData.picture = imagePath;
      }

      // Ensure session fields default to null if not provided
      candidateData.session1start = candidateData.session1start ?? null;
      candidateData.session1end = candidateData.session1end ?? null;
      candidateData.session2start = candidateData.session2start ?? null;
      candidateData.session2end = candidateData.session2end ?? null;
      candidateData.session3start = candidateData.session3start ?? null;
      candidateData.session3end = candidateData.session3end ?? null;
      candidateData.session4start = candidateData.session4start ?? null;
      candidateData.session4end = candidateData.session4end ?? null;

      const newCandidate = await this.stcModel.create(candidateData);

      res.status(201).json({
        success: true,
        message: "STC Candidate created successfully",
        ticketNumber: ticketNumber,
      });
    } catch (error) {
      console.error("Error creating STC candidate:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Failed to create STC candidate",
      });
    }
  }

  async getCandidates(req, res) {
    try {
      const candidates = await this.stcModel.getAll();
      res.status(200).json({
        success: true,
        message: "STC Candidates retrieved successfully",
        data: candidates,
        count: candidates.length,
      });
    } catch (error) {
      console.error("Error getting STC candidates:", error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve STC candidates",
      });
    }
  }

  async getCandidateByTicketNumber(req, res) {
    try {
      const { ticketNumber } = req.params;
      const candidate = await this.stcModel.getByTicketNumber(ticketNumber);

      if (!candidate) {
        return res.status(404).json({
          success: false,
          message: "STC Candidate not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "STC Candidate retrieved successfully",
        data: candidate,
      });
    } catch (error) {
      console.error("Error getting STC candidate:", error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve STC candidate",
      });
    }
  }

  async updateCandidateByTicketNumber(req, res) {
    try {
      const { ticketNumber } = req.params;
      const updatedData = req.body;

      // Check if candidate exists
      const existingCandidate = await this.stcModel.getByTicketNumber(
        ticketNumber
      );
      if (!existingCandidate) {
        return res.status(404).json({
          success: false,
          message: "STC Candidate not found",
        });
      }

      // Handle image upload
      if (req.file) {
        // Delete old image if exists
        if (existingCandidate.picture) {
          const oldImagePath = path.join(
            __dirname,
            "../../",
            existingCandidate.picture
          );
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }

        const imagePath = await this.handleImageUpload(
          req.file,
          ticketNumber,
          "stc"
        );
        updatedData.picture = imagePath;
      }

      const updatedCandidate = await this.stcModel.updateByTicketNumber(
        ticketNumber,
        updatedData
      );

      res.status(200).json({
        success: true,
        message: "STC Candidate updated successfully",
        data: updatedCandidate,
      });
    } catch (error) {
      console.error("Error updating STC candidate:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Failed to update STC candidate",
      });
    }
  }

  async deleteCandidateByTicketNumber(req, res) {
    try {
      const { ticketNumber } = req.params;

      // Get candidate to check image
      const candidate = await this.stcModel.getByTicketNumber(ticketNumber);
      if (!candidate) {
        return res.status(404).json({
          success: false,
          message: "STC Candidate not found",
        });
      }

      // Delete candidate
      const deleted = await this.stcModel.deleteByTicketNumber(ticketNumber);

      // Delete image file if exists
      if (candidate.picture) {
        const imagePath = path.join(__dirname, "../../", candidate.picture);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }

      res.status(200).json({
        success: true,
        message: "STC Candidate deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting STC candidate:", error);
      res.status(500).json({
        success: false,
        message: "Failed to delete STC candidate",
      });
    }
  }

  // Resign candidate method
  async resignCandidate(req, res) {
    try {
      const { ticketNumber } = req.params;

      // Check if candidate exists
      const existingCandidate = await this.stcModel.getByTicketNumber(
        ticketNumber
      );
      if (!existingCandidate) {
        return res.status(404).json({
          success: false,
          message: "STC Candidate not found",
        });
      }

      // Check if already resigned
      if (existingCandidate.resignation_status === "yes") {
        return res.status(400).json({
          success: false,
          message: "Candidate is already resigned",
        });
      }

      // Update resignation status
      const updatedData = {
        ...existingCandidate,
        resignation_status: "yes",
      };

      const updatedCandidate = await this.stcModel.updateByTicketNumber(
        ticketNumber,
        updatedData
      );

      res.status(200).json({
        success: true,
        message: "STC Candidate resigned successfully",
        data: updatedCandidate,
      });
    } catch (error) {
      console.error("Error resigning STC candidate:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Failed to resign STC candidate",
      });
    }
  }

  async getCandidatesByDesignation(req, res) {
    try {
      const { designation } = req.params;
      const candidates = await this.stcModel.getByDesignation(designation);

      res.status(200).json({
        success: true,
        message: `STC Candidates with designation ${designation} retrieved successfully`,
        data: candidates,
        count: candidates.length,
      });
    } catch (error) {
      console.error("Error getting STC candidates by designation:", error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve STC candidates by designation",
      });
    }
  }

  async getCandidatesByUnit(req, res) {
    try {
      const { unit } = req.params;
      const candidates = await this.stcModel.getByUnit(unit);

      res.status(200).json({
        success: true,
        message: `STC Candidates with unit ${unit} retrieved successfully`,
        data: candidates,
        count: candidates.length,
      });
    } catch (error) {
      console.error("Error getting STC candidates by unit:", error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve STC candidates by unit",
      });
    }
  }

  // Image upload handler
  async handleImageUpload(file, ticketNumber, traineeType) {
    try {
      const oldPath = file.path;
      const fileExtension = path.extname(file.originalname);
      const newFileName = `${ticketNumber}${fileExtension}`;

      const uploadDir = path.join(__dirname, "../uploads", traineeType);
      const newFullPath = path.join(uploadDir, newFileName);
      const relativePath = `uploads/${traineeType}/${newFileName}`;

      // Create directory if doesn't exist
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      // Move file with new name
      fs.renameSync(oldPath, newFullPath);

      return relativePath;
    } catch (error) {
      throw new Error("Error handling image upload: " + error.message);
    }
  }

  async getSessionDates(req, res) {
    try {
      const { ticketNumber } = req.params;
      const candidate = await this.stcModel.getByTicketNumber(ticketNumber);

      if (!candidate) {
        return res.status(404).json({
          success: false,
          message: "Candidate not found",
        });
      }

      // Get the course structure based on designation
      const courseStructure = {
        "MSE-C&W": { sessions: 4 },
        "MSE-D": { sessions: 4 },
        "MSE-W": { sessions: 4 },
        "MJR-C&W": { sessions: 4 },
        "MJR-D": { sessions: 4 },
        "MJR-W": { sessions: 4 },
        "MJI-C&W": { sessions: 4 },
        "MJI-D": { sessions: 4 },
        "MJI-W": { sessions: 4 },
        "MJP-C&W": { sessions: 2 },
        "MJP-D": { sessions: 2 },
        "MJP-W": { sessions: 2 },
      };

      // Get session data from candidate based on designation type
      const moduleDesignation = candidate.designation;
      
      // Base session data structure
      let sessionData = {
        session1: {
          start: candidate.session1start,
          end: candidate.session1end,
        },
        session2: {
          start: candidate.session2start,
          end: candidate.session2end,
        }
      };

      // Add sessions 3 and 4 only for non-MJP designations
      if (!moduleDesignation.startsWith('MJP-')) {
        sessionData = {
          ...sessionData,
          session3: {
            start: candidate.session3start,
            end: candidate.session3end,
          },
          session4: {
            start: candidate.session4start,
            end: candidate.session4end,
          }
        };
      }

      // Get required number of sessions based on designation type
      const requiredSessions = moduleDesignation.startsWith('MJP-') ? 2 : 4;

      res.status(200).json({
        success: true,
        message: "Session dates retrieved successfully",
        data: {
          sessionData,
          requiredSessions,
          designation: candidate.designation,
        },
      });
    } catch (err) {
      console.error("Error getting session dates:", err);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve session dates",
      });
    }
  }

  async updateSessionDates(req, res) {
    try {
      const { ticketNumber } = req.params;
      const { sessionData } = req.body;

      // Validate session data
      if (!sessionData) {
        return res.status(400).json({
          success: false,
          message: "Session data is required",
        });
      }

      // Get existing candidate
      const candidate = await this.stcModel.getByTicketNumber(ticketNumber);
      if (!candidate) {
        return res.status(404).json({
          success: false,
          message: "Candidate not found",
        });
      }

      // Update session dates
      const updatedData = {
        ...candidate,
        session1start: sessionData.session1?.start || null,
        session1end: sessionData.session1?.end || null,
        session2start: sessionData.session2?.start || null,
        session2end: sessionData.session2?.end || null,
        session3start: sessionData.session3?.start || null,
        session3end: sessionData.session3?.end || null,
        session4start: sessionData.session4?.start || null,
        session4end: sessionData.session4?.end || null,
      };

      const updatedCandidate = await this.stcModel.updateByTicketNumber(
        ticketNumber,
        updatedData
      );

      res.status(200).json({
        success: true,
        message: "Session dates updated successfully",
        data: updatedCandidate,
      });
    } catch (err) {
      console.error("Error updating session dates:", err);
      res.status(500).json({
        success: false,
        message: "Failed to update session dates",
      });
    }
  }

  // async getCandidatesByTrainingPeriod(req, res) {
  //    try {
  //        const { trainingPeriod } = req.params;
  //        const candidates = await this.stcModel.getByTrainingPeriod(trainingPeriod);
  //        res.status(200).json({
  //            success: true,
  //            message: `STC Candidates with training period ${trainingPeriod} retrieved successfully`,
  //            data: candidates,
  //            count: candidates.length
  //        });
  //    } catch (error) {
  //        console.error('Error getting STC candidates by training period:', error);
  //        res.status(500).json({
  //            success: false,
  //            message: 'Failed to retrieve STC candidates by training period'
  //        });
  //    }
  // }

  // async getCandidatesByTheoryDuration(req, res) {
  //    try {
  //        const { theoryDuration } = req.params;
  //        const candidates = await this.stcModel.getByTheoryDuration(theoryDuration);
  //        res.status(200).json({
  //            success: true,
  //            message: `STC Candidates with theory duration ${theoryDuration} retrieved successfully`,
  //            data: candidates,
  //            count: candidates.length
  //        });
  //    } catch (error) {
  //        console.error('Error getting STC candidates by theory duration:', error);
  //        res.status(500).json({
  //            success: false,
  //            message: 'Failed to retrieve STC candidates by theory duration'
  //        });
  //    }
  // }

  // async getCandidatesByPracticalDuration(req, res) {
  //    try {
  //        const { practicalDuration } = req.params;
  //        const candidates = await this.stcModel.getByPracticalDuration(practicalDuration);
  //        res.status(200).json({
  //            success: true,
  //            message: `STC Candidates with practical duration ${practicalDuration} retrieved successfully`,
  //            data: candidates,
  //            count: candidates.length
  //        });
  //    } catch (error) {
  //        console.error('Error getting STC candidates by practical duration:', error);
  //        res.status(500).json({
  //            success: false,
  //            message: 'Failed to retrieve STC candidates by practical duration'
  //        });
  //    }
  // }

  // Backward Compatibility Methods
  async getCandidateById(req, res) {
    req.params.ticketNumber = req.params.id;
    return this.getCandidateByTicketNumber(req, res);
  }

  async updateCandidate(req, res) {
    req.params.ticketNumber = req.params.id;
    return this.updateCandidateByTicketNumber(req, res);
  }

  async deleteCandidate(req, res) {
    req.params.ticketNumber = req.params.id;
    return this.deleteCandidateByTicketNumber(req, res);
  }
}

module.exports = StcController;
