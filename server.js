const express = require('express');
const dotenv = require('dotenv');
const sequelize = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const carRoutes = require('./routes/carRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4646;

app.use(express.json()); // Parses JSON bodies

// Placeholder route to test the server
app.get('/', (req, res) => {
  res.send('Car Management API is running');
});

app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);

// Test DB connection
sequelize.authenticate()
  .then(() => console.log('Database connected...'))
  .catch((err) => console.error('Unable to connect to the database:', err));


app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
