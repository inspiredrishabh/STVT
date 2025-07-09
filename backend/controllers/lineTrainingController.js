const { generateTicketNumber } = require('../utils/ticketGenerator');
const fs = require('fs');
const path = require('path');

class LineTrainingController {
    constructor(lineTrainingModel) {
        this.lineTrainingModel = lineTrainingModel;
    }

    async createCandidate(req, res) {
        try {
            const trainingData = req.body;
            console.log('Creating Line Training program with data:', trainingData);
            
            // Handle multiple ticket numbers - create a record for each trainee
            const ticketNumbers = Array.isArray(trainingData.ticketNumbers) 
                ? trainingData.ticketNumbers 
                : [trainingData.ticketNumbers];
            
            const createdCandidates = [];
            
            for (const ticketNo of ticketNumbers) {
                const candidateData = {
                    ticket_no: ticketNo,
                    name: '', // Will be populated from STC data if needed
                    designation: '', // Will be populated from STC data if needed
                    activity_centre: trainingData.activityCentre,
                    start_date: trainingData.startDate,
                    end_date: trainingData.endDate,
                    remark: trainingData.description || trainingData.remark || ''
                };
                
                const newCandidate = await this.lineTrainingModel.create(candidateData);
                createdCandidates.push(newCandidate);
            }

            res.status(201).json({
                success: true,
                message: `Line Training created successfully for ${createdCandidates.length} candidate(s)`,
                data: {
                    id: createdCandidates[0]?.id,
                    activityCentre: trainingData.activityCentre,
                    startDate: trainingData.startDate,
                    endDate: trainingData.endDate,
                    description: trainingData.description,
                    status: trainingData.status,
                    ticketNumbers: ticketNumbers,
                    candidates: createdCandidates
                }
            });
        } catch (error) {
            console.error('Error creating Line Training:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to create Line Training'
            });
        }
    }

    async getCandidates(req, res) {
        try {
            const candidates = await this.lineTrainingModel.getAll();
            
            // Group candidates by training program (same activity center, dates)
            const trainingPrograms = {};
            
            candidates.forEach(candidate => {
                const key = `${candidate.activity_centre}_${candidate.start_date}_${candidate.end_date}`;
                
                if (!trainingPrograms[key]) {
                    trainingPrograms[key] = {
                        id: candidate.id,
                        activityCentre: candidate.activity_centre,
                        startDate: candidate.start_date,
                        endDate: candidate.end_date,
                        description: candidate.remark || '',
                        status: this.determineStatus(candidate.start_date),
                        ticketNumbers: [],
                        created_at: candidate.created_at
                    };
                }
                
                trainingPrograms[key].ticketNumbers.push(candidate.ticket_no);
            });
            
            const programs = Object.values(trainingPrograms);
            
            res.status(200).json({
                success: true,
                message: 'Line Training Programs retrieved successfully',
                data: programs,
                count: programs.length
            });
        } catch (error) {
            console.error('Error getting Line Training programs:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve Line Training programs'
            });
        }
    }
    
    // Helper method to determine status based on start date
    determineStatus(startDate) {
        const today = new Date().toISOString().split('T')[0];
        const start = new Date(startDate);
        const now = new Date(today);
        
        if (start <= now) {
            return "In Progress";
        } else {
            return "Scheduled";
        }
    }

    async getCandidateByTicketNumber(req, res) {
        try {
            const { ticketNumber } = req.params;
            const candidate = await this.lineTrainingModel.getByTicketNumber(ticketNumber);
            
            if (!candidate) {
                return res.status(404).json({
                    success: false,
                    message: 'Line Training Candidate not found'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Line Training Candidate retrieved successfully',
                data: candidate
            });
        } catch (error) {
            console.error('Error getting Line Training candidate:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve Line Training candidate'
            });
        }
    }

    async updateCandidateByTicketNumber(req, res) {
        try {
            const { ticketNumber } = req.params;
            const updatedData = req.body;

            // Check if candidate exists
            const existingCandidate = await this.lineTrainingModel.getByTicketNumber(ticketNumber);
            if (!existingCandidate) {
                return res.status(404).json({
                    success: false,
                    message: 'Line Training Candidate not found'
                });
            }

            const updatedCandidate = await this.lineTrainingModel.updateByTicketNumber(ticketNumber, updatedData);
            
            res.status(200).json({
                success: true,
                message: 'Line Training Candidate updated successfully',
                data: updatedCandidate
            });
        } catch (error) {
            console.error('Error updating Line Training candidate:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to update Line Training candidate'
            });
        }
    }

    async deleteCandidateByTicketNumber(req, res) {
        try {
            const { ticketNumber } = req.params;
            
            // Get candidate to check if exists
            const candidate = await this.lineTrainingModel.getByTicketNumber(ticketNumber);
            if (!candidate) {
                return res.status(404).json({
                    success: false,
                    message: 'Line Training Candidate not found'
                });
            }

            // Delete candidate
            const deleted = await this.lineTrainingModel.deleteByTicketNumber(ticketNumber);
            
            res.status(200).json({
                success: true,
                message: 'Line Training Candidate deleted successfully'
            });
        } catch (error) {
            console.error('Error deleting Line Training candidate:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to delete Line Training candidate'
            });
        }
    }

    async getCandidatesByDesignation(req, res) {
        try {
            const { designation } = req.params;
            const candidates = await this.lineTrainingModel.getByDesignation(designation);
            
            res.status(200).json({
                success: true,
                message: `Line Training Candidates with designation ${designation} retrieved successfully`,
                data: candidates,
                count: candidates.length
            });
        } catch (error) {
            console.error('Error getting Line Training candidates by designation:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve Line Training candidates by designation'
            });
        }
    }

    async getCandidatesByActivityCentre(req, res) {
        try {
            const { activityCentre } = req.params;
            const candidates = await this.lineTrainingModel.getByActivityCentre(activityCentre);
            
            res.status(200).json({
                success: true,
                message: `Line Training Candidates with activity centre ${activityCentre} retrieved successfully`,
                data: candidates,
                count: candidates.length
            });
        } catch (error) {
            console.error('Error getting Line Training candidates by activity centre:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve Line Training candidates by activity centre'
            });
        }
    }

    async getCandidatesByDateRange(req, res) {
        try {
            const { startDate, endDate } = req.query;
            
            if (!startDate || !endDate) {
                return res.status(400).json({
                    success: false,
                    message: 'Start date and end date are required'
                });
            }

            const candidates = await this.lineTrainingModel.getByDateRange(startDate, endDate);
            
            res.status(200).json({
                success: true,
                message: `Line Training Candidates between ${startDate} and ${endDate} retrieved successfully`,
                data: candidates,
                count: candidates.length
            });
        } catch (error) {
            console.error('Error getting Line Training candidates by date range:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve Line Training candidates by date range'
            });
        }
    }

    // Update training program by ID
    async updateCandidate(req, res) {
        try {
            const { id } = req.params;
            const trainingData = req.body;
            
            // First, get the existing training program to find all candidates
            const existingCandidate = await this.lineTrainingModel.getById(id);
            if (!existingCandidate) {
                return res.status(404).json({
                    success: false,
                    message: 'Training program not found'
                });
            }
            
            // Find all candidates with same activity center and dates (same program)
            const allCandidates = await this.lineTrainingModel.getAll();
            const programCandidates = allCandidates.filter(c => 
                c.activity_centre === existingCandidate.activity_centre &&
                c.start_date === existingCandidate.start_date &&
                c.end_date === existingCandidate.end_date
            );
            
            // Delete old program candidates
            for (const candidate of programCandidates) {
                await this.lineTrainingModel.deleteByTicketNumber(candidate.ticket_no);
            }
            
            // Create new candidates with updated data
            const ticketNumbers = Array.isArray(trainingData.ticketNumbers) 
                ? trainingData.ticketNumbers 
                : [trainingData.ticketNumbers];
            
            const updatedCandidates = [];
            
            for (const ticketNo of ticketNumbers) {
                const candidateData = {
                    ticket_no: ticketNo,
                    name: '',
                    designation: '',
                    activity_centre: trainingData.activityCentre,
                    start_date: trainingData.startDate,
                    end_date: trainingData.endDate,
                    remark: trainingData.description || ''
                };
                
                const newCandidate = await this.lineTrainingModel.create(candidateData);
                updatedCandidates.push(newCandidate);
            }
            
            res.status(200).json({
                success: true,
                message: 'Training program updated successfully',
                data: {
                    id: updatedCandidates[0]?.id,
                    activityCentre: trainingData.activityCentre,
                    startDate: trainingData.startDate,
                    endDate: trainingData.endDate,
                    description: trainingData.description,
                    status: trainingData.status,
                    ticketNumbers: ticketNumbers
                }
            });
        } catch (error) {
            console.error('Error updating training program:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to update training program'
            });
        }
    }

    // Delete training program by ID
    async deleteCandidate(req, res) {
        try {
            const { id } = req.params;
            
            // Get the training program to find all related candidates
            const existingCandidate = await this.lineTrainingModel.getById(id);
            if (!existingCandidate) {
                return res.status(404).json({
                    success: false,
                    message: 'Training program not found'
                });
            }
            
            // Find all candidates with same activity center and dates (same program)
            const allCandidates = await this.lineTrainingModel.getAll();
            const programCandidates = allCandidates.filter(c => 
                c.activity_centre === existingCandidate.activity_centre &&
                c.start_date === existingCandidate.start_date &&
                c.end_date === existingCandidate.end_date
            );
            
            // Delete all candidates in this program
            for (const candidate of programCandidates) {
                await this.lineTrainingModel.deleteByTicketNumber(candidate.ticket_no);
            }
            
            res.status(200).json({
                success: true,
                message: 'Training program deleted successfully'
            });
        } catch (error) {
            console.error('Error deleting training program:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to delete training program'
            });
        }
    }

    // Get training program by ID
    async getCandidateById(req, res) {
        try {
            const { id } = req.params;
            const candidate = await this.lineTrainingModel.getById(id);
            
            if (!candidate) {
                return res.status(404).json({
                    success: false,
                    message: 'Training program not found'
                });
            }
            
            // Find all candidates in the same program
            const allCandidates = await this.lineTrainingModel.getAll();
            const programCandidates = allCandidates.filter(c => 
                c.activity_centre === candidate.activity_centre &&
                c.start_date === candidate.start_date &&
                c.end_date === candidate.end_date
            );
            
            const trainingProgram = {
                id: candidate.id,
                activityCentre: candidate.activity_centre,
                startDate: candidate.start_date,
                endDate: candidate.end_date,
                description: candidate.remark || '',
                status: this.determineStatus(candidate.start_date),
                ticketNumbers: programCandidates.map(c => c.ticket_no)
            };

            res.status(200).json({
                success: true,
                message: 'Training program retrieved successfully',
                data: trainingProgram
            });
        } catch (error) {
            console.error('Error getting training program:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve training program'
            });
        }
    }
}

module.exports = LineTrainingController;