
require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const API_KEY = process.env.API_FOOTBALL_KEY;
const API_URL = "https://v3.football.api-sports.io";

app.get("/", (req, res) => {
  res.json({
    name: "GG Master AI",
    status: "Running",
    purpose: "GG YES Football Predictions"
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    apiKeyConfigured: Boolean(API_KEY)
  });
});

app.get("/api/fixtures", async (req, res) => {
  try {
    if (!API_KEY) {
      return res.status(500).json({
        error: "Football API key is not configured"
      });
    }

    const date = req.query.date;

    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({
        error: "Please provide a date in YYYY-MM-DD format"
      });
    }

    const response = await fetch(
      `${API_URL}/fixtures?date=${date}`,
      {
        headers: {
          "x-apisports-key": API_KEY
        }
      }
    );

    const data = await response.json();

    if (!response.ok || data.errors?.length) {
      return res.status(502).json({
        error: "Football data provider returned an error"
      });
    }

    res.json({
      total: data.results,
      fixtures: data.response
    });

  } catch (error) {
    res.status(500).json({
      error: "Unable to retrieve football fixtures"
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`GG Master AI running on port ${PORT}`);
});
        
