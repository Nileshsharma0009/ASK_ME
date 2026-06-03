// MongoDB connection placeholder
const mongoose = require('mongoose');

module.exports = {
  connect: async (uri) => {
    // TODO: implement connection logic
    return mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  }
};
