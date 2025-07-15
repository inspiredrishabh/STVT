const express = require("express");
const router = express.Router();
const MjrCwController = require("../controllers/mjrcwController");
const MjrCwModel = require("../models/mjrcw");
const StcModel = require("../models/stcModel");

// Initialize models and controller
const mjrCwModel = new MjrCwModel();
const stcModel = new StcModel();
const mjrCwController = new MjrCwController(mjrCwModel, stcModel);

// Main CRUD Routes - Using Ticket Number
router.post("/", (req, res) => {
  mjrCwController.createScore(req, res);
});

router.get("/", (req, res) => {
  mjrCwController.getScores(req, res);
});

router.get("/:ticketNumber", (req, res) => {
  mjrCwController.getScoreByTicketNumber(req, res);
});

router.put("/:ticketNumber", (req, res) => {
  mjrCwController.updateScoreByTicketNumber(req, res);
});

router.delete("/:ticketNumber", (req, res) => {
  mjrCwController.deleteScoreByTicketNumber(req, res);
});

// Paper-specific Updates
router.put("/:ticketNumber/paper/:paperCode", (req, res) => {
  mjrCwController.updatePaperMarks(req, res);
});

// Marks Summary and Details
router.get("/:ticketNumber/summary", (req, res) => {
  mjrCwController.getMarksSummary(req, res);
});

router.get("/details/with-candidates", (req, res) => {
  mjrCwController.getScoresWithCandidateDetails(req, res);
});

router.get("/:ticketNumber/details", (req, res) => {
  mjrCwController.getScoreWithCandidateDetails(req, res);
});

// Session-wise Routes
router.get("/:ticketNumber/session/:session", (req, res) => {
  mjrCwController.getSessionMarks(req, res);
});

router.get("/analysis/session/:session", (req, res) => {
  mjrCwController.getSessionAnalysis(req, res);
});

router.get("/analysis/course/overview", (req, res) => {
  mjrCwController.getCourseAnalysis(req, res);
});

// Bulk Operations
router.post("/bulk/upload", (req, res) => {
  mjrCwController.bulkUploadScores(req, res);
});

router.post("/upsert", (req, res) => {
  mjrCwController.upsertScore(req, res);
});

// Backward Compatibility Routes
router.get("/legacy/:id", (req, res) => {
  mjrCwController.getScoreById(req, res);
});

router.put("/legacy/:id", (req, res) => {
  mjrCwController.updateScore(req, res);
});

router.delete("/legacy/:id", (req, res) => {
  mjrCwController.deleteScore(req, res);
});

module.exports = router;
