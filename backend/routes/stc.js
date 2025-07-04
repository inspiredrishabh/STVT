
// Bhai Ye Tumne Phle Se Bnaya Hai Is Liye Mai Isme Changes Nhi Kar Rha Hu
//I guess ye hatega


const express = require('express');
const router = express.Router();

// POST /api/stc/register - Submit STC registration form
router.post('/register', async (req, res) => {
  console.log('Entered')
  try {
    const formData = req.body;
    
    // Basic validation
    const requiredFields = ['name', 'email', 'phoneNumber', 'designation'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    console.log("1");
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }
    console.log("2");
    // Log the received data (replace with database save)
    console.log('STC Registration Data:', {
      name: formData.name,
      email: formData.email,
      designation: formData.designation,
      phoneNumber: formData.phoneNumber,
      submittedAt: new Date().toISOString()
    });
    console.log("3");
    // TODO: Save to database here
    // const savedRecord = await STCModel.create(formData);

    // Success response
    res.status(201).json({
      success: true,
      message: 'Registration submitted successfully',
      data: {
        id: Date.now(), // Replace with actual database ID
        submittedAt: new Date().toISOString(),
        name: formData.name,
        email: formData.email
      }
    });
    console.log("4");

  } catch (error) {
    console.error('STC Registration Error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// GET /api/stc/health - Health check
router.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    service: 'STC Registration API',
    timestamp: new Date().toISOString() 
  });
});

module.exports = router;
