const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const axios = require("axios");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.OPENROUTER_API_KEY;

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-3.5-turbo", // or try 'mistralai/mistral-7b-instruct'
        messages: [{ role: "user", content: userMessage }],
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "HTTP-Referer": "http://localhost:5000", // Optional but polite
          "Content-Type": "application/json",
        },
      }
    );

    res.json({ reply: response.data.choices[0].message.content });
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).json({ reply: "Oops! Something went wrong with OpenRouter." });
  }
});

app.listen(5000, () => console.log("Server running at http://localhost:5000"));
