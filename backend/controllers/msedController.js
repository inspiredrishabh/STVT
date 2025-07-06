const fs = require('fs');
const path = require('path');

class MseDController {
    constructor(mseDModel) {
        this.mseDModel = mseDModel;
    }

    async createScore(req, res) {
        try {
            const scoreData = req.body;
            
            const newScore = await this.mseDModel.create(scoreData);
            res.status(201).json({
                success: true,
                message: 'MSE - D Score created successfully',
                data: newScore
            });
        } catch (error) {
            console.error('Error creating MSE - D score:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to create MSE - D score'
            });
        }
    }

    async getScores(req, res) {
        try {
            const scores = await this.mseDModel.getAll();
            res.status(200).json({
                success: true,
                message: 'MSE - D Scores retrieved successfully',
                data: scores,
                count: scores.length
            });
        } catch (error) {
            console.error('Error getting MSE - D scores:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve MSE - D scores'
            });
        }
    }

    async getScoreByTicketNumber(req, res) {
        try {
            const { ticketNumber } = req.params;
            const score = await this.mseDModel.getByTicketNumber(ticketNumber);
            
            if (!score) {
                return res.status(404).json({
                    success: false,
                    message: 'MSE - D Score not found'
                });
            }

            res.status(200).json({
                success: true,
                message: 'MSE - D Score retrieved successfully',
                data: score
            });
        } catch (error) {
            console.error('Error getting MSE - D score:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve MSE - D score'
            });
        }
    }

    async updateScoreByTicketNumber(req, res) {
        try {
            const { ticketNumber } = req.params;
            const updatedData = req.body;

            // Check if score exists
            const existingScore = await this.mseDModel.getByTicketNumber(ticketNumber);
            if (!existingScore) {
                return res.status(404).json({
                    success: false,
                    message: 'MSE - D Score not found'
                });
            }

            const updatedScore = await this.mseDModel.updateByTicketNumber(ticketNumber, updatedData);
            
            res.status(200).json({
                success: true,
                message: 'MSE - D Score updated successfully',
                data: updatedScore
            });
        } catch (error) {
            console.error('Error updating MSE - D score:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to update MSE - D score'
            });
        }
    }

    async deleteScoreByTicketNumber(req, res) {
        try {
            const { ticketNumber } = req.params;
            
            // Check if score exists
            const score = await this.mseDModel.getByTicketNumber(ticketNumber);
            if (!score) {
                return res.status(404).json({
                    success: false,
                    message: 'MSE - D Score not found'
                });
            }

            // Delete score
            const deleted = await this.mseDModel.deleteByTicketNumber(ticketNumber);
            
            res.status(200).json({
                success: true,
                message: 'MSE - D Score deleted successfully'
            });
        } catch (error) {
            console.error('Error deleting MSE - D score:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to delete MSE - D score'
            });
        }
    }

    async getScoresWithCandidateDetails(req, res) {
        try {
            const scoresWithDetails = await this.mseDModel.getScoresWithCandidateDetails();
            res.status(200).json({
                success: true,
                message: 'MSE - D Scores with candidate details retrieved successfully',
                data: scoresWithDetails,
                count: scoresWithDetails.length
            });
        } catch (error) {
            console.error('Error getting MSE - D scores with candidate details:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve MSE - D scores with candidate details'
            });
        }
    }

    async getScoreWithCandidateDetails(req, res) {
        try {
            const { ticketNumber } = req.params;
            const scoreWithDetails = await this.mseDModel.getScoreWithCandidateDetails(ticketNumber);
            
            if (!scoreWithDetails) {
                return res.status(404).json({
                    success: false,
                    message: 'MSE - D Score with candidate details not found'
                });
            }

            res.status(200).json({
                success: true,
                message: 'MSE - D Score with candidate details retrieved successfully',
                data: scoreWithDetails
            });
        } catch (error) {
            console.error('Error getting MSE - D score with candidate details:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve MSE - D score with candidate details'
            });
        }
    }

    // Bulk upload scores
    async bulkUploadScores(req, res) {
        try {
            const { scores } = req.body;
            
            if (!Array.isArray(scores) || scores.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid scores data. Expected an array of scores.'
                });
            }

            const results = [];
            const errors = [];

            for (let i = 0; i < scores.length; i++) {
                try {
                    const score = scores[i];
                    const newScore = await this.mseDModel.create(score);
                    results.push(newScore);
                } catch (error) {
                    errors.push({
                        index: i,
                        ticket_no: scores[i].ticket_no || scores[i].ticketNumber,
                        error: error.message
                    });
                }
            }

            res.status(200).json({
                success: true,
                message: `Bulk upload completed. ${results.length} scores created, ${errors.length} errors.`,
                data: {
                    created: results,
                    errors: errors,
                    summary: {
                        total: scores.length,
                        created: results.length,
                        failed: errors.length
                    }
                }
            });
        } catch (error) {
            console.error('Error in bulk upload MSE - D scores:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to process bulk upload'
            });
        }
    }

    // Upsert score (create if not exists, update if exists)
    async upsertScore(req, res) {
        try {
            const scoreData = req.body;
            const ticketNumber = scoreData.ticket_no || scoreData.ticketNumber;

            if (!ticketNumber) {
                return res.status(400).json({
                    success: false,
                    message: 'Ticket number is required'
                });
            }

            // Check if score exists
            const existingScore = await this.mseDModel.getByTicketNumber(ticketNumber);

            let result;
            let message;

            if (existingScore) {
                // Update existing score
                result = await this.mseDModel.updateByTicketNumber(ticketNumber, scoreData);
                message = 'MSE - D Score updated successfully';
            } else {
                // Create new score
                result = await this.mseDModel.create(scoreData);
                message = 'MSE - D Score created successfully';
            }

            res.status(200).json({
                success: true,
                message: message,
                data: result,
                operation: existingScore ? 'updated' : 'created'
            });
        } catch (error) {
            console.error('Error in upsert MSE - D score:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to upsert MSE - D score'
            });
        }
    }

    // Backward Compatibility Methods
    async getScoreById(req, res) {
        req.params.ticketNumber = req.params.id;
        return this.getScoreByTicketNumber(req, res);
    }

    async updateScore(req, res) {
        req.params.ticketNumber = req.params.id;
        return this.updateScoreByTicketNumber(req, res);
    }

    async deleteScore(req, res) {
        req.params.ticketNumber = req.params.id;
        return this.deleteScoreByTicketNumber(req, res);
    }
}

module.exports = MseDController;