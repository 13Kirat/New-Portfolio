import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { getGeminiClient, getGeminiImageModel } from "../utils/gemini.js";
import fs from "fs";

const buildPrompt = ({ title, description, technologies, styleNotes, hasReference }) => {
  const lines = [
    "Design a minimalistic, modern project banner illustration for a developer portfolio.",
    "Style: flat design, clean geometric shapes, generous whitespace, a small limited color palette, no readable UI text or fake screenshots, 16:9 aspect ratio.",
    `Project title: ${title}`,
  ];
  if (description) lines.push(`Project description: ${description}`);
  if (technologies) lines.push(`Technologies used: ${technologies}`);
  if (styleNotes) lines.push(`Additional style notes: ${styleNotes}`);
  if (hasReference) {
    lines.push(
      "A reference screenshot of the actual site/app is attached — take inspiration from its color palette and general feel, but do not literally reproduce its UI or any text from it. Produce an original, abstract, minimalist banner."
    );
  }
  return lines.join("\n");
};

export const generateProjectBanner = catchAsyncErrors(async (req, res, next) => {
  const { title, description, technologies, styleNotes } = req.body;

  if (!title || !title.trim()) {
    return next(new ErrorHandler("Project title is required to generate a banner.", 400));
  }

  const referenceImage = req.files && req.files.referenceImage;

  const inputParts = [
    {
      type: "text",
      text: buildPrompt({
        title,
        description,
        technologies,
        styleNotes,
        hasReference: Boolean(referenceImage),
      }),
    },
  ];

  if (referenceImage) {
    const base64 = fs.readFileSync(referenceImage.tempFilePath).toString("base64");
    inputParts.push({
      type: "image",
      data: base64,
      mime_type: referenceImage.mimetype,
    });
  }

  let interaction;
  try {
    const ai = getGeminiClient();
    interaction = await ai.interactions.create({
      model: getGeminiImageModel(),
      input: inputParts,
      response_modalities: ["image"],
    });
  } catch (err) {
    console.error("Gemini banner generation error:", err);
    return next(
      new ErrorHandler(err.message || "Failed to generate banner with Gemini.", 502)
    );
  }

  const imageOutput = (interaction.outputs || []).find(
    (output) => output.type === "image" && output.data
  );

  if (!imageOutput) {
    return next(
      new ErrorHandler("Gemini did not return an image. Try adjusting the prompt.", 502)
    );
  }

  res.status(200).json({
    success: true,
    image: {
      data: imageOutput.data,
      mimeType: imageOutput.mime_type || "image/png",
    },
  });
});
