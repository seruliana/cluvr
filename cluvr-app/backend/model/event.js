import mongoose from "mongoose";

const { Schema, model } = mongoose;

const eventSchema = new Schema({

  title: {
    type: String,
    required: true,
  },

  clubId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Club",
    required: true,
  },

  description: String,

  date: {
    type: String,
    required: true,
  },

  time: String,

  location: String,


  seats: {
    type: Number,
    default: 0,
  },

  category: String,

  image: {
    type: String,
    default: "",
  },

  likes: [
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


export default model("Event", eventSchema);