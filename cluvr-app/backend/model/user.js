import mongoose from "mongoose";

const { Schema, model } = mongoose;

const userSchema = new Schema({

  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  university: {
    type: String,
    default: "",
  },

  major: {
    type: String,
    default: "",
  },

  interests: {
    type: [String],
    default: [],
  },

  quizResults: {
    interests: {
      type: [String],
      default: [],
    },
    completedAt: {
      type: Date,
    },
    recommendations: {
      clubs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Club",
      }],
      events: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
      }],
    },
  },

  savedClubs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Club",
    }
  ],

  joinedEvents: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
    }
  ],

  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Club",
    }
  ],

  createdAt: {
    type: Date,
    default: Date.now,
  },

  updatedAt: {
    type: Date,
    default: Date.now,
  }

});


export default model("User", userSchema);