// ChatHistory schema placeholder (Mongoose)
const mongoose = require('mongoose');

const ChatHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  messages: Array
}, { timestamps: true });

module.exports = mongoose.model('ChatHistory', ChatHistorySchema);
