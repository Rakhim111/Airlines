// currencyRoute.js

const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/currency', async (req, res) => {
  const apiKeyExchangeRate = "a2547ad56f42448125c63fad"; 
  const currencyAPIUrl = `https://open.er-api.com/v6/latest/USD`;  
  let exchangeRatesData;
  let error = null;

  try {
    const response = await axios.get(currencyAPIUrl, {
      headers: {
        'X-RapidAPI-Key': apiKeyExchangeRate,
      },
    });

    exchangeRatesData = response.data.rates;
  } catch (err) {
    console.error("Error fetching exchange rates:", err.response ? err.response.data : err.message);
    error = "Error fetching exchange rates";
    exchangeRatesData = null;
  }

  res.render("currency", { exchangeRates: exchangeRatesData, error });
});

module.exports = router;
