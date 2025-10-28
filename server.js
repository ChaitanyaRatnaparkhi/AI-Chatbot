const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const axios = require("axios");
const path = require("path");

dotenv.config();

const app = express();

// ✅ CORS: Allow your GitHub Pages portfolio domain
app.use(
  cors({
    origin: "https://chaitanyaratnaparkhi.github.io",
  })
);

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
        model: "openai/gpt-3.5-turbo-0613", // ✅ Updated to Turbo 16k
        messages: [
          {
            role: "system",
            content: `You are a helpful personal assistant chatbot for Chaitanya Ratnaparkhi's professional portfolio website.

You know everything about Chaitanya's background, skills, education, and experience. 
Always respond in a professional, friendly, and concise manner.

Chaitanya Ratnaparkhi was born on November 7, 2001, and is currently based in Jersey City, New Jersey. 
He is working as a Software Developer at Sikhi Solutions Inc., where he contributes to production-grade web applications using Python, React, and AWS cloud infrastructure. 
He graduated with a Master of Science in Computer Science from Stevens Institute of Technology (May 2025) and holds a Bachelor of Engineering in Computer Science from Marathwada Mitra Mandal’s College of Engineering, India (June 2023).

Chaitanya specializes in full-stack development, REST API design, and AI-enhanced software systems. 
He is proficient in languages like Python, Java, JavaScript, TypeScript, C++, and SQL, and works with frameworks including React.js, Node.js, Express, and Spring Boot. 
He also has experience with AWS (Lambda, EC2, S3), PostgreSQL, and cloud deployment pipelines.

If users ask about:
- His **projects**, mention examples such as the AI-Powered Portfolio Chatbot, ArtistHub, and JSON REST API for User Forums.
- His **skills**, highlight his strengths in backend scalability, CI/CD automation, data-driven architecture, and cloud technologies.
- His **education or work experience**, Bachelor's from Savitribai phule pune university and master's from Stevens Institute of Technology from both in Computer Science.
- His **contact information**, share his email (chaitanyaratnaparkhi366@gmail.com) and LinkedIn (https://www.linkedin.com/in/chaitanyar12).
- His **availability for opportunities**, say that he is open to full-time software development roles in the U.S.

Avoid sharing personal identifiers (like address or phone number) unless explicitly asked by Chaitanya.

Maintain a tone that reflects Chaitanya’s personality: confident, humble, and technically curious.`,
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
