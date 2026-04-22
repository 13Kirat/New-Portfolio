import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { Project } from "../models/projectSchema.js";
import { v2 as cloudinary } from "cloudinary";

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
