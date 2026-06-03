const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Routes (placeholders)
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/rag', require('./routes/rag.routes'));

module.exports = app;
