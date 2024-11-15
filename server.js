const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const sequelize = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const carRoutes = require('./routes/carRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4646;

// Middleware
app.use(cors({
  origin: "https://spontaneous-longma-2f7107.netlify.app", 
  credentials: true,              
}));
app.use(express.json()); // Parses JSON bodies

// Placeholder route to test the server
app.get('/', (req, res) => {
  res.send('Car Management API is running');
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);

//Images URL
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Test DB connection and sync
sequelize.authenticate()
  .then(() => {
    console.log('Database connected...');
    return sequelize.sync(); // Sync models with the database
  })
  .then(() => console.log('Database synced successfully'))
  .catch((err) => console.error('Unable to connect or sync to the database:', err));

// Start server
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
