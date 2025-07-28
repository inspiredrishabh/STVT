const { generateTicketNumber } = require("../utils/ticketGenerator");
const fs = require("fs");
const path = require("path");

class NonRailwayController {
  constructor(nonRailwayModel) {
    this.nonRailwayModel = nonRailwayModel;
  }

  async createCandidate(req, res) {
    try {
      const candidateData = req.body;

      // Generate ticket number
      const ticketNumber = await generateTicketNumber(
        candidateData.designation,
        "nonrailway"
      );
      candidateData.ticket_no = ticketNumber;

      // Handle image upload
      if (req.file) {
        const imagePath = await this.handleImageUpload(
          req.file,
          ticketNumber,
          "nonrailway"
        );
        candidateData.picture = imagePath;
      }

      const newCandidate = await this.nonRailwayModel.create(candidateData);
      res.status(201).json({
        success: true,
        message: "NonRailway Candidate created successfully",
        data: newCandidate,
      });
    } catch (error) {
      console.error("Error creating NonRailway candidate:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Failed to create NonRailway candidate",
      });
    }
  }

  async getCandidates(req, res) {
    try {
      const candidates = await this.nonRailwayModel.getAll();
      res.status(200).json({
        success: true,
        message: "NonRailway Candidates retrieved successfully",
        data: candidates,
        count: candidates.length,
      });
    } catch (error) {
      console.error("Error getting NonRailway candidates:", error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve NonRailway candidates",
      });
    }
  }

  async getCandidateByTicketNumber(req, res) {
    try {
      const { ticketNumber } = req.params;
      const candidate = await this.nonRailwayModel.getByTicketNumber(
        ticketNumber
      );

      if (!candidate) {
        return res.status(404).json({
          success: false,
          message: "NonRailway Candidate not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "NonRailway Candidate retrieved successfully",
        data: candidate,
      });
    } catch (error) {
      console.error("Error getting NonRailway candidate:", error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve NonRailway candidate",
      });
    }
  }

  async updateCandidateByTicketNumber(req, res) {
    try {
      const { ticketNumber } = req.params;
      const updatedData = req.body;

      // If ticketNumber is being updated, ensure ticket_no is set in updatedData
      if (updatedData.ticketNumber) {
        updatedData.ticket_no = updatedData.ticketNumber;
      }

      // Check if candidate exists
      const existingCandidate = await this.nonRailwayModel.getByTicketNumber(
        ticketNumber
      );
      if (!existingCandidate) {
        return res.status(404).json({
          success: false,
          message: "NonRailway Candidate not found",
        });
      }

      // Handle image upload (no backup)
      if (req.file) {
        // Delete old image if exists
        if (existingCandidate.picture) {
          const oldImagePath = path.join(
            __dirname,
            "../",
            existingCandidate.picture
          );
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }

        const imagePath = await this.handleImageUpload(
          req.file,
          ticketNumber,
          "nonrailway"
        );
        updatedData.picture = imagePath;
      }

      const updatedCandidate = await this.nonRailwayModel.updateByTicketNumber(
        ticketNumber,
        updatedData
      );

      res.status(200).json({
        success: true,
        message: req.file
          ? "NonRailway Candidate and image updated successfully"
          : "NonRailway Candidate updated successfully",
        data: updatedCandidate,
      });
    } catch (error) {
      console.error("Error updating NonRailway candidate:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Failed to update NonRailway candidate",
      });
    }
  }

  async deleteCandidateByTicketNumber(req, res) {
    try {
      const { ticketNumber } = req.params;

      // Get candidate to check image
      const candidate = await this.nonRailwayModel.getByTicketNumber(
        ticketNumber
      );
      if (!candidate) {
        return res.status(404).json({
          success: false,
          message: "NonRailway Candidate not found",
        });
      }

      // Delete candidate
      const deleted = await this.nonRailwayModel.deleteByTicketNumber(
        ticketNumber
      );

      // Delete image file if exists
      if (candidate.picture) {
        const imagePath = path.join(__dirname, "../", candidate.picture);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }

      res.status(200).json({
        success: true,
        message: "NonRailway Candidate deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting NonRailway candidate:", error);
      res.status(500).json({
        success: false,
        message: "Failed to delete NonRailway candidate",
      });
    }
  }

  async getCandidatesByDesignation(req, res) {
    try {
      const { designation } = req.params;
      const candidates = await this.nonRailwayModel.getByDesignation(
        designation
      );

      res.status(200).json({
        success: true,
        message: `NonRailway Candidates with designation ${designation} retrieved successfully`,
        data: candidates,
        count: candidates.length,
      });
    } catch (error) {
      console.error(
        "Error getting NonRailway candidates by designation:",
        error
      );
      res.status(500).json({
        success: false,
        message: "Failed to retrieve NonRailway candidates by designation",
      });
    }
  }

  // NonRailway specific methods
  async getCandidatesByCourseType(req, res) {
    try {
      const { courseType } = req.params;
      const candidates = await this.nonRailwayModel.getByCourseType(courseType);

      res.status(200).json({
        success: true,
        message: `NonRailway Candidates with course type ${courseType} retrieved successfully`,
        data: candidates,
        count: candidates.length,
      });
    } catch (error) {
      console.error(
        "Error getting NonRailway candidates by course type:",
        error
      );
      res.status(500).json({
        success: false,
        message: "Failed to retrieve NonRailway candidates by course type",
      });
    }
  }

  // async getCandidatesByDuration(req, res) {
  //     try {
  //         const { duration } = req.params;
  //         const candidates = await this.nonRailwayModel.getByDuration(duration);

  //         res.status(200).json({
  //             success: true,
  //             message: `NonRailway Candidates with duration ${duration} retrieved successfully`,
  //             data: candidates,
  //             count: candidates.length
  //         });
  //     } catch (error) {
  //         console.error('Error getting NonRailway candidates by duration:', error);
  //         res.status(500).json({
  //             success: false,
  //             message: 'Failed to retrieve NonRailway candidates by duration'
  //         });
  //     }
  // }

  // async getCandidatesByTheory(req, res) {
  //     try {
  //         const { theory } = req.params;
  //         const candidates = await this.nonRailwayModel.getByTheory(theory);

  //         res.status(200).json({
  //             success: true,
  //             message: `NonRailway Candidates with theory ${theory} retrieved successfully`,
  //             data: candidates,
  //             count: candidates.length
  //         });
  //     } catch (error) {
  //         console.error('Error getting NonRailway candidates by theory:', error);
  //         res.status(500).json({
  //             success: false,
  //             message: 'Failed to retrieve NonRailway candidates by theory'
  //         });
  //     }
  // }

  // async getCandidatesByPractical(req, res) {
  //     try {
  //         const { practical } = req.params;
  //         const candidates = await this.nonRailwayModel.getByPractical(practical);

  //         res.status(200).json({
  //             success: true,
  //             message: `NonRailway Candidates with practical ${practical} retrieved successfully`,
  //             data: candidates,
  //             count: candidates.length
  //         });
  //     } catch (error) {
  //         console.error('Error getting NonRailway candidates by practical:', error);
  //         res.status(500).json({
  //             success: false,
  //             message: 'Failed to retrieve NonRailway candidates by practical'
  //         });
  //     }
  // }

  async getCandidatesByUnit(req, res) {
    try {
      const { unit } = req.params;
      const candidates = await this.nonRailwayModel.getByUnit(unit);

      res.status(200).json({
        success: true,
        message: `NonRailway Candidates with unit ${unit} retrieved successfully`,
        data: candidates,
        count: candidates.length,
      });
    } catch (error) {
      console.error("Error getting NonRailway candidates by unit:", error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve NonRailway candidates by unit",
      });
    }
  }

  // async searchCandidatesByRemarks(req, res) {
  //     try {
  //         const { keyword } = req.params;
  //         const candidates = await this.nonRailwayModel.searchByRemarks(keyword);

  //         res.status(200).json({
  //             success: true,
  //             message: `NonRailway Candidates with remarks containing "${keyword}" retrieved successfully`,
  //             data: candidates,
  //             count: candidates.length
  //         });
  //     } catch (error) {
  //         console.error('Error searching NonRailway candidates by remarks:', error);
  //         res.status(500).json({
  //             success: false,
  //             message: 'Failed to search NonRailway candidates by remarks'
  //         });
  //     }
  // }

  // async getTrainingDetails(req, res) {
  //     try {
  //         const trainingDetails = await this.nonRailwayModel.getTrainingDetails();

  //         res.status(200).json({
  //             success: true,
  //             message: 'NonRailway Training details retrieved successfully',
  //             data: trainingDetails,
  //             count: trainingDetails.length
  //         });
  //     } catch (error) {
  //         console.error('Error getting NonRailway training details:', error);
  //         res.status(500).json({
  //             success: false,
  //             message: 'Failed to retrieve NonRailway training details'
  //         });
  //     }
  // }

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

  // Backward compatibility methods
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

module.exports = NonRailwayController;
  