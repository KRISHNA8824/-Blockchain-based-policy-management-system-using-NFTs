const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config()

const app = express();

// Connect to MongoDB
const uri = 'mongodb+srv://krishankg2001:Krishan1001@cluster1.2ktejrv.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;
connection.once('open', () => {
  console.log('MongoDB database connection established successfully');
});

// Set up middleware
app.use(bodyParser.json());
app.use(cors());

// Create the routes for the REST API
const dataRoutes = require('./routes/policyDetails');

// Use the routes for the REST API
app.use('/policyDetails', dataRoutes);

const dataRoutes2 = require('./routes/auth');
app.use('/auth', dataRoutes2);

const dataRoutes3 = require('./routes/policyMintRequest');
app.use('/policyMintRequest', dataRoutes3);

const dataRoutes4 = require('./routes/claimRequest');
app.use('/claimRequest', dataRoutes4);

// Start the server
const port = 3009;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
