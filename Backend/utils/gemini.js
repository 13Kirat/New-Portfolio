import { GoogleGenAI } from "@google/genai";

let client = null;

export const getGeminiClient = () => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error(
      "GEMINI_API_KEY is not set. Add it to Backend/config/config.env to enable AI banner generation."
    );
  }
  if (!client) {
    client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return client;
};

// "gemini-2.5-flash-image" is Google's "Nano Banana" image generation/editing
// model. Override via GEMINI_IMAGE_MODEL (e.g. to "gemini-3-pro-image-preview"
// aka "Nano Banana Pro") if you want a different one.
export const getGeminiImageModel = () =>
  process.env.GEMINI_IMAGE_MODEL || "gemini-2.5-flash-image";
