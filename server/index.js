const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');
const shipmentRoutes = require('./routes/shipmentRoutes');
const contactRoutes = require('./routes/contactRoutes');

const app = express();
const port = process.env.PORT || 3001;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/shipments', shipmentRoutes);
app.use('/api/contact', contactRoutes);

app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is running!' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
