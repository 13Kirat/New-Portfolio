import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { Project } from "../models/projectSchema.js";
import { v2 as cloudinary } from "cloudinary";
import { GoogleGenAI } from "@google/genai";
import fs from "fs";

const BANNER_MODEL = "gemini-2.5-flash-image";

export const generateProjectBanner = catchAsyncErrors(async (req, res, next) => {
  if (!process.env.GEMINI_API_KEY) {
    return next(
      new ErrorHandler(
        "GEMINI_API_KEY is not configured on the server. Add it to Backend/config/config.env and restart the server.",
        500
      )
    );
  }

  const { title, description, technologies, styleNotes } = req.body;
  if (!title || !description) {
    return next(new ErrorHandler("Title and description are required to generate a banner.", 400));
  }

  const promptParts = [
    "Create a minimalist, modern, flat-design digital illustration to use as a 16:9 project banner/cover image.",
    `Project title: "${title}".`,
    `Project description: ${description}.`,
    technologies ? `Technology stack: ${technologies}.` : "",
    styleNotes ? `Additional style notes: ${styleNotes}.` : "",
    "Use a clean, cohesive, limited color palette and simple geometric shapes or abstract iconography that represent the idea of the project.",
    "Do not render any readable text, words, letters, or UI mockups in the image — keep it purely visual and abstract.",
    "The image must look professional, polished, and suitable for a developer portfolio.",
  ]
    .filter(Boolean)
    .join(" ");

  const contentParts = [{ text: promptParts }];

  if (req.files && req.files.referenceImage) {
    const referenceImage = req.files.referenceImage;
    const base64Data = await fs.promises.readFile(referenceImage.tempFilePath, {
      encoding: "base64",
    });
    contentParts.push({
      inlineData: {
        mimeType: referenceImage.mimetype,
        data: base64Data,
      },
    });
    contentParts.push({
      text:
        "The attached image is a screenshot of the actual site/app for reference. " +
        "Take inspiration from its color palette and general mood only — do not copy its layout, " +
        "text, or content directly. Keep the final result minimalist and abstract.",
    });
  }

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  let response;
  try {
    response = await ai.models.generateContent({
      model: BANNER_MODEL,
      contents: contentParts,
    });
  } catch (err) {
    return next(
      new ErrorHandler(`Gemini request failed: ${err.message || "Unknown error"}`, 502)
    );
  }

  const parts = response?.candidates?.[0]?.content?.parts || [];
  const imagePart = parts.find((part) => part.inlineData);

  if (!imagePart) {
    const textPart = parts.find((part) => part.text);
    return next(
      new ErrorHandler(
        textPart?.text
          ? `Gemini did not return an image: ${textPart.text}`
          : "Gemini did not return an image. Try adjusting the title/description and generate again.",
        502
      )
    );
  }

  res.status(200).json({
    success: true,
    mimeType: imagePart.inlineData.mimeType || "image/png",
    image: imagePart.inlineData.data,
  });
});

export const addNewProject = catchAsyncErrors(async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Project Banner Image Required!", 404));
  }
  const { projectBanner } = req.files;
  const {
    title,
    description,
    domain,
    category,
    projectType,
    gitRepoLink,
    projectLink,
    stack,
    status,
    visible,
    technologies,
  } = req.body;
  if (
    !title ||
    !description ||
    !domain ||
    !category ||
    !projectLink ||
    !stack ||
    !status ||
    !technologies
  ) {
    return next(new ErrorHandler("Please Provide All Details!", 400));
  }
  const cloudinaryResponse = await cloudinary.uploader.upload(
    projectBanner.tempFilePath,
    { folder: "PORTFOLIO PROJECT IMAGES" }
  );
  if (!cloudinaryResponse || cloudinaryResponse.error) {
    console.error(
      "Cloudinary Error:",
      cloudinaryResponse.error || "Unknown Cloudinary error"
    );
    return next(new ErrorHandler("Failed to upload avatar to Cloudinary", 500));
  }
  const project = await Project.create({
    title,
    description,
    domain,
    category,
    projectType,
    gitRepoLink,
    projectLink,
    stack,
    status,
    visible: visible === "false" ? false : true,
    technologies,
    projectBanner: {
      public_id: cloudinaryResponse.public_id, // Set your cloudinary public_id here
      url: cloudinaryResponse.secure_url, // Set your cloudinary secure_url here
    },
  });
  res.status(201).json({
    success: true,
    message: "New Project Added!",
    project,
  });
});

export const updateProject = catchAsyncErrors(async (req, res, next) => {
  const newProjectData = {
    title: req.body.title,
    description: req.body.description,
    domain: req.body.domain,
    category: req.body.category,
    projectType: req.body.projectType,
    stack: req.body.stack,
    status: req.body.status,
    visible: req.body.visible === "false" ? false : true,
    technologies: req.body.technologies,
    projectLink: req.body.projectLink,
    gitRepoLink: req.body.gitRepoLink,
  };
  if (req.files && req.files.projectBanner) {
    const projectBanner = req.files.projectBanner;
    const project = await Project.findById(req.params.id);
    const projectImageId = project.projectBanner.public_id;
    await cloudinary.uploader.destroy(projectImageId);
    const newProjectImage = await cloudinary.uploader.upload(
      projectBanner.tempFilePath,
      {
        folder: "PORTFOLIO PROJECT IMAGES",
      }
    );
    newProjectData.projectBanner = {
      public_id: newProjectImage.public_id,
      url: newProjectImage.secure_url,
    };
  }
  const project = await Project.findByIdAndUpdate(
    req.params.id,
    newProjectData,
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );
  res.status(200).json({
    success: true,
    message: "Project Updated!",
    project,
  });
});

export const deleteProject = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const project = await Project.findById(id);
  if (!project) {
    return next(new ErrorHandler("Already Deleted!", 404));
  }
  const projectImageId = project.projectBanner.public_id;
  await cloudinary.uploader.destroy(projectImageId);
  await project.deleteOne();
  res.status(200).json({
    success: true,
    message: "Project Deleted!",
  });
});

export const getAllProjects = catchAsyncErrors(async (req, res, next) => {
  const includeHidden = req.query.includeHidden === "true";
  const filter = includeHidden ? {} : { visible: true };
  const projects = await Project.find(filter);
  res.status(200).json({
    success: true,
    projects,
  });
});

export const getSingleProject = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  try {
    const project = await Project.findById(id);
    if (!project) {
      return next(new ErrorHandler("Project not found.", 404));
    }

    const includeHidden = req.query.includeHidden === "true";
    if (!includeHidden && project.visible === false) {
      return next(new ErrorHandler("Project not found.", 404));
    }

    res.status(200).json({
      success: true,
      project,
    });
  } catch (error) {
    res.status(400).json({
      error,
    });
  }
});
