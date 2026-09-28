import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  title: String,
  description: String,
  domain: {
    type: String,
    trim: true,
  },
  category: {
    type: String,
    trim: true,
  },
  projectType: {
    type: String,
    trim: true,
  },
  gitRepoLink: String,
  projectLink: String,
  technologies: String,
  stack: String,
  status: {
    type: String,
    trim: true,
  },
  visible: {
    type: Boolean,
    default: true,
  },
  projectBanner: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
});

export const Project = mongoose.model("Project", projectSchema);
