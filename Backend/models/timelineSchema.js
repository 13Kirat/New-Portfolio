import mongoose from "mongoose";

const timelineSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title Required!"],
  },
  description: {
    type: String,
    required: [true, "Description Required!"],
  },
  timeline: {
    from: {
      type: String,
    },
    to: {
      type: String,
    },
  },
  employmentType: {
    type: String,
    trim: true,
  },
  locationType: {
    type: String,
    trim: true,
  },
  location: {
    type: String,
    trim: true,
  },
});

export const Timeline = mongoose.model("Timeline", timelineSchema);
