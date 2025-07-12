const { generateTicketNumber } = require('../utils/ticketGenerator');
const fs = require('fs');
const path = require('path');

class MseWController {
    constructor(mseWModel, stcModel) {
        this.mseWModel = mseWModel;
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
                // if (stcCandidate.designation !== 'MSE-W') {
                //     return res.status(400).json({
                //         success: false,
                //         message: `Candidate designation is ${stcCandidate.designation}, not MSE-W`
                //     });
                // }
            }

            const newScore = await this.mseWModel.create(scoreData);
            res.status(201).json({
                success: true,
                message: 'MSE-W Score created successfully',
                data: newScore
            });
        } catch (error) {
            console.error('Error creating MSE-W score:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to create MSE-W score'
            });
        }
    }

    async getScores(req, res) {
        try {
            const scores = await this.mseWModel.getAll();
            res.status(200).json({
                success: true,
                message: 'MSE-W Scores retrieved successfully',
                data: scores,
                count: scores.length
            });
        } catch (error) {
            console.error('Error getting MSE-W scores:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve MSE-W scores'
            });
        }
    }

    async getScoreByTicketNumber(req, res) {
        try {
            const { ticketNumber } = req.params;
            const score = await this.mseWModel.getByTicketNumber(ticketNumber);
            
            if (!score) {
                return res.status(404).json({
                    success: false,
                    message: 'MSE-W Score not found'
                });
            }

            res.status(200).json({
                success: true,
                message: 'MSE-W Score retrieved successfully',
                data: score
            });
        } catch (error) {
            console.error('Error getting MSE-W score:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve MSE-W score'
            });
        }
    }

    async updateScoreByTicketNumber(req, res) {
        try {
            const { ticketNumber } = req.params;
            const updatedData = req.body;

            // Check if score exists
            const existingScore = await this.mseWModel.getByTicketNumber(ticketNumber);
            if (!existingScore) {
                return res.status(404).json({
                    success: false,
                    message: 'MSE-W Score not found'
                });
            }

            const updatedScore = await this.mseWModel.updateByTicketNumber(ticketNumber, updatedData);
            
            res.status(200).json({
                success: true,
                message: 'MSE-W Score updated successfully',
                data: updatedScore
            });
        } catch (error) {
            console.error('Error updating MSE-W score:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to update MSE-W score'
            });
        }
    }

    async deleteScoreByTicketNumber(req, res) {
        try {
            const { ticketNumber } = req.params;
            
            // Check if score exists
            const score = await this.mseWModel.getByTicketNumber(ticketNumber);
            if (!score) {
                return res.status(404).json({
                    success: false,
                    message: 'MSE-W Score not found'
                });
            }

            const deleted = await this.mseWModel.deleteByTicketNumber(ticketNumber);
            
            res.status(200).json({
                success: true,
                message: 'MSE-W Score deleted successfully'
            });
        } catch (error) {
            console.error('Error deleting MSE-W score:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to delete MSE-W score'
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
            const existingScore = await this.mseWModel.getByTicketNumber(ticketNumber);
            if (!existingScore) {
                return res.status(404).json({
                    success: false,
                    message: 'MSE-W Score not found'
                });
            }

            const updated = await this.mseWModel.updatePaperMarks(ticketNumber, paperCode, marks);
            
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
            const summary = await this.mseWModel.getMarksSummary(ticketNumber);
            
            if (!summary) {
                return res.status(404).json({
                    success: false,
                    message: 'MSE-W Score not found'
                });
            }

            res.status(200).json({
                success: true,
                message: 'MSE-W Marks summary retrieved successfully',
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
            const scoresWithDetails = await this.mseWModel.getScoresWithCandidateDetails();
            res.status(200).json({
                success: true,
                message: 'MSE-W Scores with candidate details retrieved successfully',
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
            const scoreWithDetails = await this.mseWModel.getScoreWithCandidateDetails(ticketNumber);
            
            if (!scoreWithDetails) {
                return res.status(404).json({
                    success: false,
                    message: 'MSE-W Candidate or Score not found'
                });
            }

            res.status(200).json({
                success: true,
                message: 'MSE-W Score with candidate details retrieved successfully',
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
            const score = await this.mseWModel.getByTicketNumber(ticketNumber);
            
            if (!score) {
                return res.status(404).json({
                    success: false,
                    message: 'MSE-W Score not found'
                });
            }

            let sessionMarks = {};
            switch(session) {
                case '1':
                    sessionMarks = {
                        s1p1_marks: score.s1p1_marks,
                        s1p2_marks: score.s1p2_marks,
                        s1pr_marks: score.s1pr_marks,
                        total: (score.s1p1_marks || 0) + (score.s1p2_marks || 0) + (score.s1pr_marks || 0),
                        max_total: 250 // 100 + 100 + 50
                    };
                    break;
                case '2':
                    sessionMarks = {
                        s2p1_marks: score.s2p1_marks,
                        s2p2_marks: score.s2p2_marks,
                        s2pr_marks: score.s2pr_marks,
                        total: (score.s2p1_marks || 0) + (score.s2p2_marks || 0) + (score.s2pr_marks || 0),
                        max_total: 225 // 75 + 100 + 50
                    };
                    break;
                case '3':
                    sessionMarks = {
                        s3p1_marks: score.s3p1_marks,
                        s3p2_marks: score.s3p2_marks,
                        s3p3_marks: score.s3p3_marks,
                        s3p4_marks: score.s3p4_marks,
                        s3pr_marks: score.s3pr_marks,
                        total: (score.s3p1_marks || 0) + (score.s3p2_marks || 0) + (score.s3p3_marks || 0) + 
                               (score.s3p4_marks || 0) + (score.s3pr_marks || 0),
                        max_total: 275 // 100 + 50 + 25 + 50 + 50
                    };
                    break;
                case '4':
                    sessionMarks = {
                        s4p1_marks: score.s4p1_marks,
                        s4pr_marks: score.s4pr_marks,
                        s4int_marks: score.s4int_marks,
                        total: (score.s4p1_marks || 0) + (score.s4pr_marks || 0) + (score.s4int_marks || 0),
                        max_total: 250 // 100 + 50 + 100
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
                message: `MSE-W Session ${session} marks retrieved successfully`,
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
            const allScores = await this.mseWModel.getAll();
            
            if (allScores.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'No MSE-W scores found'
                });
            }

            let analysis = {};
            switch(session) {
                case '1':
                    analysis = this.calculateSessionAnalysis(allScores, 's1', ['p1', 'p2', 'pr'], 250);
                    break;
                case '2':
                    analysis = this.calculateSessionAnalysis(allScores, 's2', ['p1', 'p2', 'pr'], 225);
                    break;
                case '3':
                    analysis = this.calculateSessionAnalysis(allScores, 's3', ['p1', 'p2', 'p3', 'p4', 'pr'], 275);
                    break;
                case '4':
                    analysis = this.calculateSessionAnalysis(allScores, 's4', ['p1', 'pr', 'int'], 250);
                    break;
                default:
                    return res.status(400).json({
                        success: false,
                        message: 'Invalid session number. Valid sessions are 1, 2, 3, 4'
                    });
            }

            res.status(200).json({
                success: true,
                message: `MSE-W Session ${session} analysis retrieved successfully`,
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
                    // Define max marks based on session and paper
                    let maxMarks = 100; // default
                    if (sessionPrefix === 's1') {
                        maxMarks = paper === 'pr' ? 50 : 100;
                    } else if (sessionPrefix === 's2') {
                        maxMarks = paper === 'p1' ? 75 : paper === 'pr' ? 50 : 100;
                    } else if (sessionPrefix === 's3') {
                        maxMarks = paper === 'p1' ? 100 : paper === 'p2' ? 50 : 
                                  paper === 'p3' ? 25 : paper === 'p4' ? 50 : 50; // pr
                    } else if (sessionPrefix === 's4') {
                        maxMarks = paper === 'p1' ? 100 : paper === 'pr' ? 50 : 100; // int
                    }
                    
                    analysis.paper_stats[paper] = {
                        highest: 0,
                        lowest: maxMarks,
                        average: 0,
                        total: 0,
                        max_marks: maxMarks
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

    // Overall course analysis
    async getCourseAnalysis(req, res) {
        try {
            const allScores = await this.mseWModel.getAll();
            
            if (allScores.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'No MSE-W scores found'
                });
            }

            const totalMaxMarks = 1000; // 250 + 225 + 275 + 250
            const passThreshold = totalMaxMarks * 0.5; // 50% pass mark

            const analysis = {
                total_candidates: allScores.length,
                course_stats: {
                    max_possible: totalMaxMarks,
                    highest_score: 0,
                    lowest_score: totalMaxMarks,
                    average_score: 0,
                    pass_count: 0,
                    pass_percentage: 0
                },
                session_breakdown: {
                    session_1: { max: 250, avg: 0 },
                    session_2: { max: 225, avg: 0 },
                    session_3: { max: 275, avg: 0 },
                    session_4: { max: 250, avg: 0 }
                }
            };

            let totalCourseScores = 0;
            let totalS1Scores = 0;
            let totalS2Scores = 0;
            let totalS3Scores = 0;
            let totalS4Scores = 0;

            allScores.forEach(score => {
                const s1Total = (score.s1p1_marks || 0) + (score.s1p2_marks || 0) + (score.s1pr_marks || 0);
                const s2Total = (score.s2p1_marks || 0) + (score.s2p2_marks || 0) + (score.s2pr_marks || 0);
                const s3Total = (score.s3p1_marks || 0) + (score.s3p2_marks || 0) + (score.s3p3_marks || 0) + 
                               (score.s3p4_marks || 0) + (score.s3pr_marks || 0);
                const s4Total = (score.s4p1_marks || 0) + (score.s4pr_marks || 0) + (score.s4int_marks || 0);
                const courseTotal = s1Total + s2Total + s3Total + s4Total;

                totalCourseScores += courseTotal;
                totalS1Scores += s1Total;
                totalS2Scores += s2Total;
                totalS3Scores += s3Total;
                totalS4Scores += s4Total;

                analysis.course_stats.highest_score = Math.max(analysis.course_stats.highest_score, courseTotal);
                analysis.course_stats.lowest_score = Math.min(analysis.course_stats.lowest_score, courseTotal);
                
                if (courseTotal >= passThreshold) {
                    analysis.course_stats.pass_count++;
                }
            });

            // Calculate averages
            analysis.course_stats.average_score = totalCourseScores / allScores.length;
            analysis.course_stats.pass_percentage = (analysis.course_stats.pass_count / allScores.length) * 100;
            analysis.session_breakdown.session_1.avg = totalS1Scores / allScores.length;
            analysis.session_breakdown.session_2.avg = totalS2Scores / allScores.length;
            analysis.session_breakdown.session_3.avg = totalS3Scores / allScores.length;
            analysis.session_breakdown.session_4.avg = totalS4Scores / allScores.length;

            res.status(200).json({
                success: true,
                message: 'MSE-W Course analysis retrieved successfully',
                data: analysis
            });
        } catch (error) {
            console.error('Error getting course analysis:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve course analysis'
            });
        }
    }

    // Bulk upload scores with STC validation
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
                        
                        if (stcCandidate.designation !== 'MSE-W') {
                            throw new Error(`Candidate designation is ${stcCandidate.designation}, not MSE-W`);
                        }
                    }
                    
                    const newScore = await this.mseWModel.create(score);
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
            console.error('Error in bulk upload MSE-W scores:', error);
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
            
            if (stcCandidate.designation !== 'MSE-W') {
                return res.status(400).json({
                    success: false,
                    message: `Candidate designation is ${stcCandidate.designation}, not MSE-W`
                });
            }

            // Check if score exists
            const existingScore = await this.mseWModel.getByTicketNumber(ticketNumber);

            let result;
            let message;

            if (existingScore) {
                // Update existing score
                result = await this.mseWModel.updateByTicketNumber(ticketNumber, scoreData);
                message = 'MSE-W Score updated successfully';
            } else {
                // Create new score
                result = await this.mseWModel.create(scoreData);
                message = 'MSE-W Score created successfully';
            }

            res.status(200).json({
                success: true,
                message: message,
                data: result,
                operation: existingScore ? 'updated' : 'created'
            });
        } catch (error) {
            console.error('Error in upsert MSE-W score:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to upsert MSE-W score'
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

module.exports = MseWController;