const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const axios = require("axios");
const path = require("path");

dotenv.config();

const app = express();

// ✅ CORS: Allow your GitHub Pages portfolio domain
app.use(cors({
  origin: "https://chaitanyaratnaparkhi.github.io",
}));

app.use(express.json());

// ✅ Serve static files from the public folder
app.use(express.static(path.join(__dirname, "public")));

// ✅ Serve index.html on root path
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const API_KEY = process.env.OPENROUTER_API_KEY;

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-3.5-turbo-16k", // ✅ Updated to Turbo 16k
        messages: [
          {
            role: "system",
            content: `You are a helpful personal assistant chatbot for Chaitanya Ratnaparkhi's portfolio website.
You know everything about Chaitanya's background, skills, education, and experience. 
If users ask about Chaitanya's work, interests, resume, or contact details, respond clearly and professionally.
Chaitanya's email is chaitanyaratnaparkhi366@gmail.com and his LinkedIn is https://www.linkedin.com/in/chaitanyar12.
Respond in a professional, friendly, and concise manner.`,
          },
          { role: "user", content: userMessage },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`, // ✅ Corrected here
          "Content-Type": "application/json",
        },
      }
    );

    res.json({ reply: response.data.choices[0].message.content });
  } catch (err) {
    console.error("Error status:", err.response?.status);
    console.error("Error data:", err.response?.data);
    console.error("Error headers:", err.response?.headers);
    res
      .status(500)
      .json({ reply: "Oops! Something went wrong with OpenRouter." });
  }
});

// ✅ Use dynamic port for Render, fallback to 5000 locally
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
