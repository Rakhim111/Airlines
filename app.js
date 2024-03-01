// app.js

require('dotenv').config();

const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const axios = require('axios');
const fs = require('fs');
const bodyParser = require('body-parser');
const connectDB = require('./server/config/db');
const { isActiveRoute } = require('./server/helpers/routeHelpers');
const router = express.Router();

const app = express();
const PORT = process.env.PORT || 3000;
var carouselImages;
// Connect to DB
connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride('_method'));

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI
  }),
  cookie: { maxAge: new Date(Date.now() + 3600000) }
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Route to update environment variables in .env file
app.post('/update-carousel', (req, res) => {
  const { slide1, slide2, slide3 } = req.body;

  // Read the index.ejs file
  fs.readFile('./views/index3.ejs', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading index3.ejs:', err);
      return res.status(500).send('Internal Server Error');
    }

    // Replace the placeholder URLs with the new ones
    const updatedIndex = data
      .replace(/<%= slide1Url %>/g, slide1)
      .replace(/<%= slide2Url %>/g, slide2)
      .replace(/<%= slide3Url %>/g, slide3);

    // Send the updated index.ejs file as a response
    res.send(updatedIndex);
  });
});
// Assuming you're using Express.js

// Route to render the specific page without header
app.get('/hi', (req, res) => {
  // Set includeHeader to false since you don't want the header in this page
  const includeHeader = false;
  
  // Render the specific-page.ejs template and pass includeHeader variable
  res.render('hi', { includeHeader });
});
app.get('/index2', (req, res) => {
  // Set includeHeader to false since you don't want the header in this page
  const includeHeader = false;
  
  // Render the specific-page.ejs template and pass includeHeader variable
  res.render('index2', { includeHeader });
});
app.get('/index3', (req, res) => {
  // Set includeHeader to false since you don't want the header in this page
  const includeHeader = false;
  
  // Render the specific-page.ejs template and pass includeHeader variable
  res.render('index3', { includeHeader });
});


app.use(express.static('public'));

// Templating Engine
app.use(expressLayouts);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

app.locals.isActiveRoute = isActiveRoute;

// Middleware to set current route
app.use((req, res, next) => {
  res.locals.currentRoute = req.path;
  next();
});

// Route to render about page
app.get('/about', async (req, res) => {
  try {
    const response = await axios.get('http://api.aviationstack.com/v1/flights', {
      params: {
        access_key: process.env.AVIATIONSTACK_API_KEY
      }
    });

    const flights = response.data.data;

    res.render('about', { flights });
  } catch (error) {
    console.error('Error fetching data from aviationstack:', error.message);
    res.render('about', { flights: [] });
  }
});

app.get('/about2', (req, res) => {
  res.render('about2');
});
app.get('/index2', (req, res) => {
  res.render('index2');
});
app.get('/about3', (req, res) => {
  res.render('about3');
});

// Use currency route
// Currency Route
// Assuming you're using Express.js
app.get('/hi', (req, res) => {
  // Set includeHeader to true or false based on your condition
  const includeHeader = false; // Or false depending on your logic
  
  // Render the page.ejs template and pass includeHeader variable
  res.render('hi', { includeHeader });
});

app.get('/currency', async (req, res) => {
  try {
    const apiKey = process.env.CURRENCY_API_KEY; // Load your API key from environment variables
    const currencyAPIUrl = `https://open.er-api.com/v6/latest/USD`;  

    const response = await axios.get(currencyAPIUrl, {
      headers: {
        'X-RapidAPI-Key': apiKey,
      },
    });

    const exchangeRates = response.data.rates;
    res.render('currency', { exchangeRates, error: null }); // Pass error as null
  } catch (error) {
    console.error('Error fetching exchange rates:', error.message);
    res.render('currency', { exchangeRates: null, error: 'Failed to fetch exchange rates' });
  }
});

module.exports = router;
// Routes
app.use('/', require('./server/routes/main'));
app.use('/', require('./server/routes/admin'));

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
