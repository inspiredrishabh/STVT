const { generateTicketNumber } = require('../utils/ticketGenerator');
const fs = require('fs');
const path = require('path');

class LineTrainingController {
    constructor(lineTrainingModel) {
        this.lineTrainingModel = lineTrainingModel;
    }

    async createCandidate(req, res) {
        try {
            const candidateData = req.body;
            console.log('Creating Line Training candidate with data:', candidateData);
            
            // Generate ticket number
            // const ticketNumber = await generateTicketNumber(candidateData.designation);  //neeed to add designation and traineeType in frontend formData sending and also in line-training table 
            const ticketNumber = candidateData.ticketNumbers;
            candidateData.ticket_no = ticketNumber;

            const newCandidate = await this.lineTrainingModel.create(candidateData);
            res.status(201).json({
                success: true,
                message: 'Line Training Candidate created successfully',
                data: newCandidate
            });
        } catch (error) {
            console.error('Error creating Line Training candidate:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to create Line Training candidate'
            });
        }
    }

    async getCandidates(req, res) {
        try {
            const candidates = await this.lineTrainingModel.getAll();
            res.status(200).json({
                success: true,
                message: 'Line Training Candidates retrieved successfully',
                data: candidates,
                count: candidates.length
            });
        } catch (error) {
            console.error('Error getting Line Training candidates:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve Line Training candidates'
            });
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

module.exports = LineTrainingController;