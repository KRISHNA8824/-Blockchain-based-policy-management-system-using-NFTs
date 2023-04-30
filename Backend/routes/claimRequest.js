const express = require('express');
const router = express.Router();

const myDataController = require('../controllers/claimRequestController');

// Handle GET requests to /data
router.get('/', myDataController.getData);

// Handle POST requests to /data
router.post('/', myDataController.addData);

// Handle PUT requests to /data/:id
router.put('/:id', myDataController.updateData);

// Handle DELETE requests to /data/:id
router.delete('/:id', myDataController.deleteData);

module.exports = router;
