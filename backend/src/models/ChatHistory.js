import mongoose from "mongoose";

const chatMessageSchema = new mongoose.Schema(
  {
    sender: {
      type: String,
      enum: ["human", "ai"],
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
    metadata: {
      retrieval: {
        type: [String],
        default: [],
      },
      source: {
        type: String,
        default: "knowledge-base",
      },
    },
  },
  { _id: true, timestamps: true }
);

const chatHistorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    messages: {
      type: [chatMessageSchema],
      default: [],
    },
    lastMessageAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("ChatHistory", chatHistorySchema);
