import mongoose from "mongoose";

const { Schema, model } = mongoose;

const favoriteSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  itemType: {
    type: String,
    enum: ['club', 'event'],
    required: true,
  },

  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'itemModel',
  },

  itemModel: {
    type: String,
    enum: ['Club', 'Event'],
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  }
});

favoriteSchema.index({ user: 1, itemType: 1, itemId: 1 }, { unique: true });

export default model("Favorite", favoriteSchema);
