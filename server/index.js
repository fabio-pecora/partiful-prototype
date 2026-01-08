import express from "express";
import cors from "cors";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json({ limit: "1mb" }));

app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["POST", "GET"],
  })
);

const PORT = process.env.PORT || 5174;

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing OPENAI_API_KEY in .env file");
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.post("/api/generate-cover", async (req, res) => {
  try {
    const {
      eventTitle = "Untitled Event",
      eventType,
      vibe,
      colors = [],
      style,
      includeText,
      extraDetails,
    } = req.body || {};

    if (!eventType || !vibe || !style) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const prompt =
      `Create a premium square cover image for an event invite.\n` +
      `Event type: ${eventType}\n` +
      `Mood: ${vibe}\n` +
      `Dominant colors: ${colors.join(", ") || "Auto"}\n` +
      `Visual style: ${style}\n` +
      (includeText
        ? `Include the text "${eventTitle}" in a tasteful modern way.\n`
        : `Do not include any text.\n`) +
      (extraDetails ? `Extra details: ${extraDetails}\n` : "") +
      `High quality, modern, visually striking, no watermarks, no logos.`;

    const result = await openai.images.generate({
      model: "gpt-image-1",
      prompt,
      size: "1024x1024",
      output_format: "webp",
    });

    const imageBase64 = result.data[0]?.b64_json;

    if (!imageBase64) {
      return res.status(500).json({ error: "No image returned" });
    }

    res.json({
      b64: imageBase64,
      mime: "image/webp",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Image generation failed" });
  }
});

app.listen(PORT, () => {
  console.log(`AI server running on http://localhost:${PORT}`);
});
