import mongoose from "mongoose";

const { Schema, model } = mongoose;

const clubSchema = new Schema({
  name: {
    type: String,
    required: true,
  },

  category: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  image: {
    type: String,
    default: "",
  },

  gallery: {
    type: [String],
    default: [],
  },

  emoji: {
    type: String,
    default: "🎓",
  },

  gradient: {
    type: String,
    default: "from-brand-lt to-violet-200",
  },

  members: {
    type: Number,
    default: 0,
  },

  location: {
    type: String,
    default: "",
  },

  status: {
    type: String,
    enum: ["Active Club", "Upcoming Event"],
    default: "Active Club",
  },

  tags: {
    type: [String],
    default: [],
  },

  foundedYear: {
    type: Number,
  },

  contact: {
    type: String,
  },

  website: {
    type: String,
  },

  socialLinks: {
    facebook: String,
    instagram: String,
    youtube: String,
    apply: String,
  },

  mission: {
    type: String,
  },

  vision: {
    type: String,
  },

  activities: {
    type: [String],
    default: [],
  },

  schedule: {
    type: String,
  },

  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }
  ],

  createdAt: {
    type: Date,
    default: Date.now,
  }
});


export default model("Club", clubSchema);