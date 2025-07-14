const express = require('express');
const router = express.Router();
const exportController = require('../controllers/exportController');

// Export database route
router.get('/', exportController.exportDatabase);

module.exports = router;