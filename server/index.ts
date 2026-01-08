import express, { type Request, type Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

type GenerateCoverBody = {
  eventTitle?: string;
  description?: string;
  occasion?: string;
  vibe?: string;
  style?: string;
  colors?: string[];
  layout?: string;
  lighting?: string;
  texture?: string;
  typography?: string;
  includeText?: boolean;
  extraDetails?: string;
};

const app = express();
app.use(express.json({ limit: "1mb" }));

app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST"],
  })
);

const PORT = Number(process.env.PORT || 5179);

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  throw new Error("Missing OPENAI_API_KEY in .env");
}

const openai = new OpenAI({ apiKey });

app.get("/health", (_req: Request, res: Response) => {
  res.json({ ok: true });
});

app.post(
  "/api/generate-cover",
  async (req: Request<{}, {}, GenerateCoverBody>, res: Response) => {
    try {
      const {
        eventTitle = "Untitled Event",
        description = "",
        occasion,
        vibe,
        style,
        colors = [],
        layout,
        lighting,
        texture,
        typography,
        includeText = true,
        extraDetails = "",
      } = req.body || {};

      if (!occasion || !vibe || !style) {
        return res
          .status(400)
          .json({ error: "Missing required fields: occasion, vibe, style" });
      }

      const descTrim = String(description).trim();
      if (descTrim.length > 100) {
        return res
          .status(400)
          .json({ error: "Description must be 100 characters or less" });
      }

      const safeColors = Array.isArray(colors) ? colors.slice(0, 5).join(", ") : "";
      const safeExtra = String(extraDetails || "").trim();
      const safeTypography = String(typography || "").trim();
      const safeLayout = String(layout || "").trim();
      const safeLighting = String(lighting || "").trim();
      const safeTexture = String(texture || "").trim();

      const promptParts: string[] = [];

      promptParts.push("Create a premium square cover image for an event invite.");
      promptParts.push("The output must be high quality, modern, visually striking.");
      promptParts.push("No logos, no watermarks, no brand names.");

      promptParts.push(`Occasion: ${occasion}`);
      promptParts.push(`Vibe: ${vibe}`);
      promptParts.push(`Style: ${style}`);

      if (safeColors) promptParts.push(`Dominant colors: ${safeColors}`);
      if (safeLayout) promptParts.push(`Layout/composition: ${safeLayout}`);
      if (safeLighting) promptParts.push(`Lighting: ${safeLighting}`);
      if (safeTexture) promptParts.push(`Texture/finish: ${safeTexture}`);

      if (descTrim) promptParts.push(`User description (max 100 chars): ${descTrim}`);

      const wantText = includeText && safeTypography.toLowerCase() !== "no text";
      if (wantText) {
        promptParts.push(`Include the text "${eventTitle}" in a tasteful way.`);
        if (safeTypography) promptParts.push(`Typography direction: ${safeTypography}`);
        promptParts.push("Keep text legible and integrated with the design.");
      } else {
        promptParts.push("Do not include any text.");
      }

      if (safeExtra) promptParts.push(`Extra details: ${safeExtra}`);

      promptParts.push("Design should feel premium and invite-worthy.");

      const prompt = promptParts.join("\n");

      const result = await openai.images.generate({
        model: "gpt-image-1",
        prompt,
        size: "1024x1024",
        output_format: "webp",
      });

      const imageBase64 = result.data?.[0]?.b64_json;
      if (!imageBase64) {
        return res.status(500).json({ error: "No image returned from OpenAI" });
      }

      return res.json({
        b64: imageBase64,
        mime: "image/webp",
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Image generation failed" });
    }
  }
);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
