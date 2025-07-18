const express = require("express");
const router = express.Router();
const LineTrainingController = require("../controllers/lineTrainingController");
const LineTrainingModel = require("../models/lineTraining");

const model = new LineTrainingModel();
const controller = new LineTrainingController(model);

// Main Routes
router.post("/", (req, res) => controller.createCandidate(req, res));
router.get("/", (req, res) => controller.getCandidates(req, res));

// Status update (must come before `/:id`)
router.put("/:id/status", (req, res) =>
  controller.updateTrainingStatus(req, res)
);

// Single‐program CRUD
router.get("/:id", (req, res) => controller.getCandidateById(req, res));
router.put("/:id", (req, res) => controller.updateCandidate(req, res));
router.delete("/:id", (req, res) => controller.deleteCandidate(req, res));

// Filters
router.get("/filter/designation/:designation", (req, res) =>
  controller.getCandidatesByDesignation(req, res)
);
router.get("/filter/activityCentre/:activityCentre", (req, res) =>
  controller.getCandidatesByActivityCentre(req, res)
);
router.get("/filter/dateRange", (req, res) =>
  controller.getCandidatesByDateRange(req, res)
);

// Fetch all line training records for a ticket number (excluding designation)
router.get("/by-ticket/:ticketNo", (req, res) =>
  controller.getAllByTicketNumber(req, res)
);

// Legacy aliases (optional)
router.get("/legacy/:id", (req, res) => controller.getCandidateById(req, res));
router.put("/legacy/:id", (req, res) => controller.updateCandidate(req, res));
router.delete("/legacy/:id", (req, res) =>
  controller.deleteCandidate(req, res)
);

module.exports = router;
