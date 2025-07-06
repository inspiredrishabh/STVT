const { generateTicketNumber } = require('../utils/ticketGenerator');
const fs = require('fs');
const path = require('path');

class WtcController {
    constructor(wtcModel) {
        this.wtcModel = wtcModel;
    }

    async createCandidate(req, res) {
        try {
            const candidateData = req.body;
            
            // Generate ticket number
            const ticketNumber = await generateTicketNumber(candidateData.designation);
            candidateData.ticket_no = ticketNumber;

            // Handle image upload
            if (req.file) {
                const imagePath = await this.handleImageUpload(req.file, ticketNumber, 'wtc');
                candidateData.picture = imagePath;
            }

            const newCandidate = await this.wtcModel.create(candidateData);
            res.status(201).json({
                success: true,
                message: 'WTC Candidate created successfully',
                data: newCandidate
            });
        } catch (error) {
            console.error('Error creating WTC candidate:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to create WTC candidate'
            });
        }
    }

    async getCandidates(req, res) {
        try {
            const candidates = await this.wtcModel.getAll();
            res.status(200).json({
                success: true,
                message: 'WTC Candidates retrieved successfully',
                data: candidates,
                count: candidates.length
            });
        } catch (error) {
            console.error('Error getting WTC candidates:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve WTC candidates'
            });
        }
    }

    async getCandidateByTicketNumber(req, res) {
        try {
            const { ticketNumber } = req.params;
            const candidate = await this.wtcModel.getByTicketNumber(ticketNumber);
            
            if (!candidate) {
                return res.status(404).json({
                    success: false,
                    message: 'WTC Candidate not found'
                });
            }

            res.status(200).json({
                success: true,
                message: 'WTC Candidate retrieved successfully',
                data: candidate
            });
        } catch (error) {
            console.error('Error getting WTC candidate:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve WTC candidate'
            });
        }
    }

    async updateCandidateByTicketNumber(req, res) {
        try {
            const { ticketNumber } = req.params;
            const updatedData = req.body;

            // Check if candidate exists
            const existingCandidate = await this.wtcModel.getByTicketNumber(ticketNumber);
            if (!existingCandidate) {
                return res.status(404).json({
                    success: false,
                    message: 'WTC Candidate not found'
                });
            }

            // Handle image upload
            if (req.file) {
                // Delete old image if exists
                if (existingCandidate.picture) {
                    const oldImagePath = path.join(__dirname, '../../', existingCandidate.picture);
                    if (fs.existsSync(oldImagePath)) {
                        fs.unlinkSync(oldImagePath);
                    }
                }
                
                const imagePath = await this.handleImageUpload(req.file, ticketNumber, 'wtc');
                updatedData.picture = imagePath;
            }

            const updatedCandidate = await this.wtcModel.updateByTicketNumber(ticketNumber, updatedData);
            
            res.status(200).json({
                success: true,
                message: 'WTC Candidate updated successfully',
                data: updatedCandidate
            });
        } catch (error) {
            console.error('Error updating WTC candidate:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to update WTC candidate'
            });
        }
    }

    async deleteCandidateByTicketNumber(req, res) {
        try {
            const { ticketNumber } = req.params;
            
            // Get candidate to check image
            const candidate = await this.wtcModel.getByTicketNumber(ticketNumber);
            if (!candidate) {
                return res.status(404).json({
                    success: false,
                    message: 'WTC Candidate not found'
                });
            }

            // Delete candidate
            const deleted = await this.wtcModel.deleteByTicketNumber(ticketNumber);
            
            // Delete image file if exists
            if (candidate.picture) {
                const imagePath = path.join(__dirname, '../../', candidate.picture);
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
            }
            
            res.status(200).json({
                success: true,
                message: 'WTC Candidate deleted successfully'
            });
        } catch (error) {
            console.error('Error deleting WTC candidate:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to delete WTC candidate'
            });
        }
    }

    async getCandidatesByDesignation(req, res) {
        try {
            const { designation } = req.params;
            const candidates = await this.wtcModel.getByDesignation(designation);
            
            res.status(200).json({
                success: true,
                message: `WTC Candidates with designation ${designation} retrieved successfully`,
                data: candidates,
                count: candidates.length
            });
        } catch (error) {
            console.error('Error getting WTC candidates by designation:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve WTC candidates by designation'
            });
        }
    }

    // WTC specific methods
    async getCandidatesByCourseType(req, res) {
        try {
            const { courseType } = req.params;
            const candidates = await this.wtcModel.getByCourseType(courseType);
            
            res.status(200).json({
                success: true,
                message: `WTC Candidates with course type ${courseType} retrieved successfully`,
                data: candidates,
                count: candidates.length
            });
        } catch (error) {
            console.error('Error getting WTC candidates by course type:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve WTC candidates by course type'
            });
        }
    }

    async getCandidatesByUnit(req, res) {
        try {
            const { unit } = req.params;
            const candidates = await this.wtcModel.getByUnit(unit);
            
            res.status(200).json({
                success: true,
                message: `WTC Candidates with unit ${unit} retrieved successfully`,
                data: candidates,
                count: candidates.length
            });
        } catch (error) {
            console.error('Error getting WTC candidates by unit:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve WTC candidates by unit'
            });
        }
    }

    // async getCandidatesByTrainingPeriod(req, res) {
    //     try {
    //         const { trainingPeriod } = req.params;
    //         const candidates = await this.wtcModel.getByTrainingPeriod(trainingPeriod);
            
    //         res.status(200).json({
    //             success: true,
    //             message: `WTC Candidates with training period ${trainingPeriod} retrieved successfully`,
    //             data: candidates,
    //             count: candidates.length
    //         });
    //     } catch (error) {
    //         console.error('Error getting WTC candidates by training period:', error);
    //         res.status(500).json({
    //             success: false,
    //             message: 'Failed to retrieve WTC candidates by training period'
    //         });
    //     }
    // }

    // async getCandidatesByTheoryDuration(req, res) {
    //     try {
    //         const { theoryDuration } = req.params;
    //         const candidates = await this.wtcModel.getByTheoryDuration(theoryDuration);
            
    //         res.status(200).json({
    //             success: true,
    //             message: `WTC Candidates with theory duration ${theoryDuration} retrieved successfully`,
    //             data: candidates,
    //             count: candidates.length
    //         });
    //     } catch (error) {
    //         console.error('Error getting WTC candidates by theory duration:', error);
    //         res.status(500).json({
    //             success: false,
    //             message: 'Failed to retrieve WTC candidates by theory duration'
    //         });
    //     }
    // }

    // async getCandidatesByPracticalDuration(req, res) {
    //     try {
    //         const { practicalDuration } = req.params;
    //         const candidates = await this.wtcModel.getByPracticalDuration(practicalDuration);
            
    //         res.status(200).json({
    //             success: true,
    //             message: `WTC Candidates with practical duration ${practicalDuration} retrieved successfully`,
    //             data: candidates,
    //             count: candidates.length
    //         });
    //     } catch (error) {
    //         console.error('Error getting WTC candidates by practical duration:', error);
    //         res.status(500).json({
    //             success: false,
    //             message: 'Failed to retrieve WTC candidates by practical duration'
    //         });
    //     }
    // }

    // Image upload handler
    
    async handleImageUpload(file, ticketNumber, traineeType) {
        try {
            const oldPath = file.path;
            const fileExtension = path.extname(file.originalname);
            const newFileName = `${ticketNumber}${fileExtension}`;
            
            const uploadDir = path.join(__dirname, '../../uploads', traineeType);
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
            throw new Error('Error handling image upload: ' + error.message);
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

module.exports = WtcController;