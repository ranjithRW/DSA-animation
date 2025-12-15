import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import OpenAI from "openai";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: "1mb" }));

// Serve static files from dist in production, or public in development
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "dist")));
} else {
  app.use(express.static(path.join(__dirname, "public")));
}

const port = process.env.PORT || 5173;
const hasOpenAiKey = Boolean(process.env.OPENAI_API_KEY);
const openai = hasOpenAiKey ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

app.post("/api/explain", async (req, res) => {
  if (!openai) {
    return res.status(400).json({ error: "OPENAI_API_KEY is not set in .env" });
  }

  const { algorithm, array, target } = req.body || {};
  if (!algorithm || !Array.isArray(array)) {
    return res.status(400).json({ error: "algorithm and array are required" });
  }

  const prompt = [
    "You are helping a learner visualize algorithms step by step.",
    `Algorithm: ${algorithm}`,
    `Input array: [${array.join(", ")}]`,
    target !== undefined ? `Target (for searches): ${target}` : "",
    "Give a concise, 4-6 sentence explanation of what happens at each stage, focusing on comparisons, swaps, and how the algorithm converges.",
    "Avoid pseudocode; be plain language and under 120 words.",
  ]
    .filter(Boolean)
    .join("\n");

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    const text =
      completion?.choices?.[0]?.message?.content?.trim() ||
      "No explanation returned. Please try again.";

    res.json({ explanation: text });
  } catch (error) {
    const message = error?.response?.data || error?.message || "Unknown error";
    res.status(500).json({ error: `OpenAI request failed: ${message}` });
  }
});

app.post("/api/generate-code", async (req, res) => {
  console.log("Generate code request received:", req.body);
  
  if (!openai) {
    return res.status(400).json({ error: "OPENAI_API_KEY is not set in .env" });
  }

  const { algorithm, language, array, target } = req.body || {};
  
  if (!algorithm) {
    return res.status(400).json({ error: "algorithm is required" });
  }
  if (!language) {
    return res.status(400).json({ error: "language is required" });
  }
  if (!Array.isArray(array) || array.length === 0) {
    return res.status(400).json({ error: "array is required and must not be empty" });
  }

  const languageNames = {
    python: "Python",
    javascript: "JavaScript",
    java: "Java",
    cpp: "C++",
    c: "C",
  };

  const languageName = languageNames[language] || language;

  const prompt = [
    `Generate a complete, well-commented ${languageName} implementation of ${algorithm}.`,
    `Input array: [${array.join(", ")}]`,
    target !== undefined ? `Target value (for search algorithms): ${target}` : "",
    "",
    "Requirements:",
    `1. Write clean, production-ready ${languageName} code`,
    "2. Include proper comments explaining key steps",
    "3. Include a main function or example usage that demonstrates the algorithm with the provided input",
    "4. For search algorithms, show how to search for the target value",
    "5. For sorting algorithms, show the array before and after sorting",
    "6. Use clear variable names and follow best practices for the language",
    "",
    "Return ONLY the code, no explanations or markdown formatting. Just the pure code.",
  ]
    .filter(Boolean)
    .join("\n");

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    let code =
      completion?.choices?.[0]?.message?.content?.trim() ||
      "No code returned. Please try again.";

    // Remove markdown code blocks if present
    code = code.replace(/^```[\w]*\n?/gm, "").replace(/\n?```$/gm, "").trim();

    res.json({ code });
  } catch (error) {
    const message = error?.response?.data || error?.message || "Unknown error";
    res.status(500).json({ error: `OpenAI request failed: ${message}` });
  }
});

// API routes must be defined before the catch-all route
// Catch-all route for serving React app (must be last)
app.get("*", (req, res, next) => {
  // Skip API routes
  if (req.path.startsWith('/api')) {
    return next();
  }
  const indexPath = process.env.NODE_ENV === "production" 
    ? path.join(__dirname, "dist", "index.html")
    : path.join(__dirname, "public", "index.html");
  res.sendFile(indexPath);
});

app.listen(port, () => {
  console.log(`DSA animation server running on http://localhost:${port}`);
});

