const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password and create a new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.login = async (req, res) => {
  try {
    // console.log("check point 0");
    const { email, password } = req.body;

    // console.log("check point 1");
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // console.log("check point 2");
    // Check if the password is correct
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    // console.log("check point 3");
    // console.log(process.env.JWT_SECRET);
    // Generate a token and send it to the client
    const token = jwt.sign({ name: user.name, email: user.email }, process.env.JWT_SECRET);
    // console.log("check point 4");
    res.json({ token, name: user.name, email: user.email });
    // console.log("check point 5");
    
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};