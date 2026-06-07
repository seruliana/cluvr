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
      ref: "User",
    }
  ],


  createdAt: {
    type: Date,
    default: Date.now,
  }

});


export default model("User", userSchema);