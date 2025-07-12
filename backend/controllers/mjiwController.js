const { generateTicketNumber } = require('../utils/ticketGenerator');
const fs = require('fs');
const path = require('path');

class MjiWController {
    constructor(mjiWModel, stcModel) {
        this.mjiWModel = mjiWModel;
        this.stcModel = stcModel;
    }

    async createScore(req, res) {
        try {
            const scoreData = req.body;
            
            // Validate if STC candidate exists
            if (scoreData.ticket_no || scoreData.ticketNumber) {
                const ticketNo = scoreData.ticket_no || scoreData.ticketNumber;
                const stcCandidate = await this.stcModel.getByTicketNumber(ticketNo);
                
                if (!stcCandidate) {
                    return res.status(404).json({
                        success: false,
                        message: 'STC Candidate not found. Please create STC candidate first.'
                    });
                }
                
                // Validate designation
                // if (stcCandidate.designation !== 'MJI-W') {
                //     return res.status(400).json({
                //         success: false,
                //         message: `Candidate designation is ${stcCandidate.designation}, not MJI-W`
                //     });
                // }
            }

            const newScore = await this.mjiWModel.create(scoreData);
            res.status(201).json({
                success: true,
                message: 'MJI-W Score created successfully',
                data: newScore
            });
        } catch (error) {
            console.error('Error creating MJI-W score:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to create MJI-W score'
            });
        }
    }

    async getScores(req, res) {
        try {
            const scores = await this.mjiWModel.getAll();
            res.status(200).json({
                success: true,
                message: 'MJI-W Scores retrieved successfully',
                data: scores,
                count: scores.length
            });
        } catch (error) {
            console.error('Error getting MJI-W scores:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve MJI-W scores'
            });
        }
    }

    async getScoreByTicketNumber(req, res) {
        try {
            const { ticketNumber } = req.params;
            const score = await this.mjiWModel.getByTicketNumber(ticketNumber);
            
            if (!score) {
                return res.status(404).json({
                    success: false,
                    message: 'MJI-W Score not found'
                });
            }

            res.status(200).json({
                success: true,
                message: 'MJI-W Score retrieved successfully',
                data: score
            });
        } catch (error) {
            console.error('Error getting MJI-W score:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve MJI-W score'
            });
        }
    }

    async updateScoreByTicketNumber(req, res) {
        try {
            const { ticketNumber } = req.params;
            const updatedData = req.body;

            // Check if score exists
            const existingScore = await this.mjiWModel.getByTicketNumber(ticketNumber);
            if (!existingScore) {
                return res.status(404).json({
                    success: false,
                    message: 'MJI-W Score not found'
                });
            }

            const updatedScore = await this.mjiWModel.updateByTicketNumber(ticketNumber, updatedData);
            
            res.status(200).json({
                success: true,
                message: 'MJI-W Score updated successfully',
                data: updatedScore
            });
        } catch (error) {
            console.error('Error updating MJI-W score:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to update MJI-W score'
            });
        }
    }

    async deleteScoreByTicketNumber(req, res) {
        try {
            const { ticketNumber } = req.params;
            
            // Check if score exists
            const score = await this.mjiWModel.getByTicketNumber(ticketNumber);
            if (!score) {
                return res.status(404).json({
                    success: false,
                    message: 'MJI-W Score not found'
                });
            }

            const deleted = await this.mjiWModel.deleteByTicketNumber(ticketNumber);
            
            res.status(200).json({
                success: true,
                message: 'MJI-W Score deleted successfully'
            });
        } catch (error) {
            console.error('Error deleting MJI-W score:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to delete MJI-W score'
            });
        }
    }

    async updatePaperMarks(req, res) {
        try {
            const { ticketNumber, paperCode } = req.params;
            const { marks } = req.body;

            // Validate marks
            if (marks === undefined || marks === null) {
                return res.status(400).json({
                    success: false,
                    message: 'Marks value is required'
                });
            }

            // Check if score exists
            const existingScore = await this.mjiWModel.getByTicketNumber(ticketNumber);
            if (!existingScore) {
                return res.status(404).json({
                    success: false,
                    message: 'MJI-W Score not found'
                });
            }

            const updated = await this.mjiWModel.updatePaperMarks(ticketNumber, paperCode, marks);
            
            if (!updated) {
                return res.status(404).json({
                    success: false,
                    message: 'Failed to update paper marks'
                });
            }

            res.status(200).json({
                success: true,
                message: `${paperCode} marks updated successfully`,
                data: { ticketNumber, paperCode, marks }
            });
        } catch (error) {
            console.error('Error updating paper marks:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to update paper marks'
            });
        }
    }

    async getMarksSummary(req, res) {
        try {
            const { ticketNumber } = req.params;
            const summary = await this.mjiWModel.getMarksSummary(ticketNumber);
            
            if (!summary) {
                return res.status(404).json({
                    success: false,
                    message: 'MJI-W Score not found'
                });
            }

            res.status(200).json({
                success: true,
                message: 'MJI-W Marks summary retrieved successfully',
                data: summary
            });
        } catch (error) {
            console.error('Error getting marks summary:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve marks summary'
            });
        }
    }

    async getScoresWithCandidateDetails(req, res) {
        try {
            const scoresWithDetails = await this.mjiWModel.getScoresWithCandidateDetails();
            res.status(200).json({
                success: true,
                message: 'MJI-W Scores with candidate details retrieved successfully',
                data: scoresWithDetails,
                count: scoresWithDetails.length
            });
        } catch (error) {
            console.error('Error getting scores with candidate details:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve scores with candidate details'
            });
        }
    }

    async getScoreWithCandidateDetails(req, res) {
        try {
            const { ticketNumber } = req.params;
            const scoreWithDetails = await this.mjiWModel.getScoreWithCandidateDetails(ticketNumber);
            
            if (!scoreWithDetails) {
                return res.status(404).json({
                    success: false,
                    message: 'MJI-W Candidate or Score not found'
                });
            }

            res.status(200).json({
                success: true,
                message: 'MJI-W Score with candidate details retrieved successfully',
                data: scoreWithDetails
            });
        } catch (error) {
            console.error('Error getting score with candidate details:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve score with candidate details'
            });
        }
    }

    // Session-wise marks methods
    async getSessionMarks(req, res) {
        try {
            const { ticketNumber, session } = req.params;
            const score = await this.mjiWModel.getByTicketNumber(ticketNumber);
            
            if (!score) {
                return res.status(404).json({
                    success: false,
                    message: 'MJI-W Score not found'
                });
            }

            let sessionMarks = {};
            switch(session) {
                case '1':
                    sessionMarks = {
                        s1p1_marks: score.s1p1_marks,
                        s1p2_marks: score.s1p2_marks,
                        s1p3_marks: score.s1p3_marks,
                        s1p4_marks: score.s1p4_marks,
                        s1p5_marks: score.s1p5_marks,
                        s1p6_marks: score.s1p6_marks,
                        s1p7_marks: score.s1p7_marks,
                        total: (score.s1p1_marks || 0) + (score.s1p2_marks || 0) + (score.s1p3_marks || 0) + 
                               (score.s1p4_marks || 0) + (score.s1p5_marks || 0) + (score.s1p6_marks || 0) + (score.s1p7_marks || 0),
                        max_total: 700
                    };
                    break;
                case '2':
                    sessionMarks = {
                        s2p1_marks: score.s2p1_marks,
                        s2p2_marks: score.s2p2_marks,
                        s2p3_marks: score.s2p3_marks,
                        s2p4_marks: score.s2p4_marks,
                        s2p5_marks: score.s2p5_marks,
                        s2p6_marks: score.s2p6_marks,
                        s2p7_marks: score.s2p7_marks,
                        s2p8_marks: score.s2p8_marks,
                        total: (score.s2p1_marks || 0) + (score.s2p2_marks || 0) + (score.s2p3_marks || 0) + 
                               (score.s2p4_marks || 0) + (score.s2p5_marks || 0) + (score.s2p6_marks || 0) + 
                               (score.s2p7_marks || 0) + (score.s2p8_marks || 0),
                        max_total: 525
                    };
                    break;
                case '3':
                    sessionMarks = {
                        s3p1_marks: score.s3p1_marks,
                        s3p2_marks: score.s3p2_marks,
                        total: (score.s3p1_marks || 0) + (score.s3p2_marks || 0),
                        max_total: 225
                    };
                    break;
                case '4':
                    sessionMarks = {
                        s4p1_marks: score.s4p1_marks,
                        s4p2_marks: score.s4p2_marks,
                        s4pr_marks: score.s4pr_marks,
                        s4int_marks: score.s4int_marks,
                        total: (score.s4p1_marks || 0) + (score.s4p2_marks || 0) + (score.s4pr_marks || 0) + (score.s4int_marks || 0),
                        max_total: 300
                    };
                    break;
                default:
                    return res.status(400).json({
                        success: false,
                        message: 'Invalid session number. Valid sessions are 1, 2, 3, 4'
                    });
            }

            res.status(200).json({
                success: true,
                message: `MJI-W Session ${session} marks retrieved successfully`,
                data: {
                    ticket_no: ticketNumber,
                    session: session,
                    marks: sessionMarks
                }
            });
        } catch (error) {
            console.error('Error getting session marks:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve session marks'
            });
        }
    }

    // Analysis methods
    async getSessionAnalysis(req, res) {
        try {
            const { session } = req.params;
            const allScores = await this.mjiWModel.getAll();
            
            if (allScores.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'No MJI-W scores found'
                });
            }

            let analysis = {};
            switch(session) {
                case '1':
                    analysis = this.calculateSessionAnalysis(allScores, 's1', ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7'], 700);
                    break;
                case '2':
                    analysis = this.calculateSessionAnalysis(allScores, 's2', ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8'], 525);
                    break;
                case '3':
                    analysis = this.calculateSessionAnalysis(allScores, 's3', ['p1', 'p2'], 225);
                    break;
                case '4':
                    analysis = this.calculateSessionAnalysis(allScores, 's4', ['p1', 'p2', 'pr', 'int'], 300);
                    break;
                default:
                    return res.status(400).json({
                        success: false,
                        message: 'Invalid session number. Valid sessions are 1, 2, 3, 4'
                    });
            }

            res.status(200).json({
                success: true,
                message: `MJI-W Session ${session} analysis retrieved successfully`,
                data: analysis
            });
        } catch (error) {
            console.error('Error getting session analysis:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve session analysis'
            });
        }
    }

    calculateSessionAnalysis(scores, sessionPrefix, papers, maxTotal) {
        const analysis = {
            total_candidates: scores.length,
            session_stats: {
                max_possible: maxTotal,
                highest_score: 0,
                lowest_score: maxTotal,
                average_score: 0,
                pass_count: 0,
                pass_percentage: 0
            },
            paper_stats: {}
        };

        let totalSessionScores = 0;
        const passThreshold = maxTotal * 0.5; // 50% pass mark

        scores.forEach(score => {
            let sessionTotal = 0;
            
            papers.forEach(paper => {
                const paperField = `${sessionPrefix}${paper}_marks`;
                const marks = score[paperField] || 0;
                sessionTotal += marks;
                
                if (!analysis.paper_stats[paper]) {
                    analysis.paper_stats[paper] = {
                        highest: 0,
                        lowest: 100,
                        average: 0,
                        total: 0
                    };
                }
                
                analysis.paper_stats[paper].highest = Math.max(analysis.paper_stats[paper].highest, marks);
                analysis.paper_stats[paper].lowest = Math.min(analysis.paper_stats[paper].lowest, marks);
                analysis.paper_stats[paper].total += marks;
            });

            totalSessionScores += sessionTotal;
            analysis.session_stats.highest_score = Math.max(analysis.session_stats.highest_score, sessionTotal);
            analysis.session_stats.lowest_score = Math.min(analysis.session_stats.lowest_score, sessionTotal);
            
            if (sessionTotal >= passThreshold) {
                analysis.session_stats.pass_count++;
            }
        });

        // Calculate averages
        analysis.session_stats.average_score = totalSessionScores / scores.length;
        analysis.session_stats.pass_percentage = (analysis.session_stats.pass_count / scores.length) * 100;

        papers.forEach(paper => {
            analysis.paper_stats[paper].average = analysis.paper_stats[paper].total / scores.length;
            delete analysis.paper_stats[paper].total;
        });

        return analysis;
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
                    
                    // Validate STC candidate for each score
                    const ticketNo = score.ticket_no || score.ticketNumber;
                    if (ticketNo) {
                        const stcCandidate = await this.stcModel.getByTicketNumber(ticketNo);
                        
                        if (!stcCandidate) {
                            throw new Error('STC Candidate not found');
                        }
                        
                        if (stcCandidate.designation !== 'MJI-W') {
                            throw new Error(`Candidate designation is ${stcCandidate.designation}, not MJI-W`);
                        }
                    }
                    
                    const newScore = await this.mjiWModel.create(score);
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
            console.error('Error in bulk upload MJI-W scores:', error);
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

            // Validate STC candidate
            const stcCandidate = await this.stcModel.getByTicketNumber(ticketNumber);
            
            if (!stcCandidate) {
                return res.status(404).json({
                    success: false,
                    message: 'STC Candidate not found. Please create STC candidate first.'
                });
            }
            
            if (stcCandidate.designation !== 'MJI-W') {
                return res.status(400).json({
                    success: false,
                    message: `Candidate designation is ${stcCandidate.designation}, not MJI-W`
                });
            }

            // Check if score exists
            const existingScore = await this.mjiWModel.getByTicketNumber(ticketNumber);

            let result;
            let message;

            if (existingScore) {
                // Update existing score
                result = await this.mjiWModel.updateByTicketNumber(ticketNumber, scoreData);
                message = 'MJI-W Score updated successfully';
            } else {
                // Create new score
                result = await this.mjiWModel.create(scoreData);
                message = 'MJI-W Score created successfully';
            }

            res.status(200).json({
                success: true,
                message: message,
                data: result,
                operation: existingScore ? 'updated' : 'created'
            });
        } catch (error) {
            console.error('Error in upsert MJI-W score:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to upsert MJI-W score'
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

module.exports = MjiWController;