const { generateTicketNumber } = require('../utils/ticketGenerator');
const fs = require('fs');
const path = require('path');


class StcController {
    constructor(stcModel) {
        this.stcModel = stcModel;
    }

    async createCandidate(req, res) {
        try {
            console.log('Creating STC candidate...');
            const candidateData = req.body;
            // console.log("Request body:", req.body);
            // console.log("Request file:", req.file);
            // console.log(candidateData)
            // console.log('1');

            // Generate ticket number
            const ticketNumber =  await generateTicketNumber(candidateData.designation);
            candidateData.ticket_no = ticketNumber;
            // /* console.log('2') */
            // // Handle image upload
            if (req.file) {
                const imagePath = await this.handleImageUpload(req.file, ticketNumber, 'stc');
                candidateData.picture = imagePath;
            }
            // console.log('3');
            const newCandidate = await this.stcModel.create(candidateData);
            res.status(201).json({
                success: true,
                message: 'STC Candidate created successfully',
                data: newCandidate
            });
            
            // console.log('4 done');

        } catch (error) {
            console.error('Error creating STC candidate:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to create STC candidate'
            });
        }
    }

    async getCandidates(req, res) {
        try {
            const candidates = await this.stcModel.getAll();
            res.status(200).json({
                success: true,
                message: 'STC Candidates retrieved successfully',
                data: candidates,
                count: candidates.length
            });
        } catch (error) {
            console.error('Error getting STC candidates:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve STC candidates'
            });
        }
    }

    async getCandidateByTicketNumber(req, res) {
        try {
            const { ticketNumber } = req.params;
            const candidate = await this.stcModel.getByTicketNumber(ticketNumber);
            console.log(`candidate Name  :- ${candidate.name}`);
            // console.log(`candidate fetched from database :- ${JSON.stringify(candidate, null, 2)}`);
            if (!candidate) {
                return res.status(404).json({
                    success: false,
                    message: 'STC Candidate not found'
                });
            }

            res.status(200).json({
                success: true,
                message: 'STC Candidate retrieved successfully',
                data: candidate
            });
        } catch (error) {
            console.error('Error getting STC candidate:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve STC candidate'
            });
        }
    }

    async updateCandidateByTicketNumber(req, res) {
        try {
            const { ticketNumber } = req.params;
            const updatedData = req.body;

            // Check if candidate exists
            const existingCandidate = await this.stcModel.getByTicketNumber(ticketNumber);
            if (!existingCandidate) {
                return res.status(404).json({
                    success: false,
                    message: 'STC Candidate not found'
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
                
                const imagePath = await this.handleImageUpload(req.file, ticketNumber, 'stc');
                updatedData.picture = imagePath;
            }

            const updatedCandidate = await this.stcModel.updateByTicketNumber(ticketNumber, updatedData);
            
            res.status(200).json({
                success: true,
                message: 'STC Candidate updated successfully',
                data: updatedCandidate
            });
        } catch (error) {
            console.error('Error updating STC candidate:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to update STC candidate'
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
                    message: 'STC Candidate not found'
                });
            }

            // Delete candidate
            const deleted = await this.stcModel.deleteByTicketNumber(ticketNumber);
            
            // Delete image file if exists
            if (candidate.picture) {
                const imagePath = path.join(__dirname, '../../', candidate.picture);
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
            }
            
            res.status(200).json({
                success: true,
                message: 'STC Candidate deleted successfully'
            });
        } catch (error) {
            console.error('Error deleting STC candidate:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to delete STC candidate'
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
                count: candidates.length
            });
        } catch (error) {
            console.error('Error getting STC candidates by designation:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve STC candidates by designation'
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
                count: candidates.length
            });
        } catch (error) {
            console.error('Error getting STC candidates by unit:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve STC candidates by unit'
            });
        }
    }

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

    
    // async getCandidatesByTrainingPeriod(req, res) {
    //     try {
    //         const { trainingPeriod } = req.params;
    //         const candidates = await this.stcModel.getByTrainingPeriod(trainingPeriod);
    //         res.status(200).json({
    //             success: true,
    //             message: `STC Candidates with training period ${trainingPeriod} retrieved successfully`,
    //             data: candidates,
    //             count: candidates.length
    //         });
    //     } catch (error) {
    //         console.error('Error getting STC candidates by training period:', error);
    //         res.status(500).json({
    //             success: false,
    //             message: 'Failed to retrieve STC candidates by training period'
    //         });
    //     }
    // }

    // async getCandidatesByTheoryDuration(req, res) {
    //     try {
    //         const { theoryDuration } = req.params;
    //         const candidates = await this.stcModel.getByTheoryDuration(theoryDuration);
    //         res.status(200).json({
    //             success: true,
    //             message: `STC Candidates with theory duration ${theoryDuration} retrieved successfully`,
    //             data: candidates,
    //             count: candidates.length
    //         });
    //     } catch (error) {
    //         console.error('Error getting STC candidates by theory duration:', error);
    //         res.status(500).json({
    //             success: false,
    //             message: 'Failed to retrieve STC candidates by theory duration'
    //         });
    //     }
    // }

    // async getCandidatesByPracticalDuration(req, res) {
    //     try {
    //         const { practicalDuration } = req.params;
    //         const candidates = await this.stcModel.getByPracticalDuration(practicalDuration);
    //         res.status(200).json({
    //             success: true,
    //             message: `STC Candidates with practical duration ${practicalDuration} retrieved successfully`,
    //             data: candidates,
    //             count: candidates.length
    //         });
    //     } catch (error) {
    //         console.error('Error getting STC candidates by practical duration:', error);
    //         res.status(500).json({
    //             success: false,
    //             message: 'Failed to retrieve STC candidates by practical duration'
    //         });
    //     }
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