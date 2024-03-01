const express = require('express');
const router = express.Router();
const Post = require('./server/models/Post.js');
const User = require('./server/models/User.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { EMAIL, PASSWORD } = require('./env.js'); // Importing email and password from env.js

const adminLayout = '../views/layouts/admin';
const jwtSecret = process.env.JWT_SECRET;

// Routes
app.use('/', require('./server/routes/main'));
app.use('/', require('./server/routes/admin'));
const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized' });
  }
};


router.post('admin2', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id}, jwtSecret );
    res.cookie('token', token, { httpOnly: true });
    res.redirect('/indexd');

  } catch (error) {
    console.log(error);
  }
});