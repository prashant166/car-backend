const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const {
  createCar,
  getCars,
  getUserCars,
  getCarById,
  updateCar,
  deleteCar
} = require('../controllers/carController');

const router = express.Router();

// Route to create a new car
router.post('/', authMiddleware, upload, createCar);

// Route to search cars by title, description, or tags
router.get('/search', authMiddleware, getCars); // Dedicated search route

// Route to get all cars (without search functionality)
router.get('/', authMiddleware, getCars); // This can be used to list all cars without filtering

// Route to get all cars for a specific user
router.get('/user', authMiddleware, getUserCars);

// Route to get a car by ID
router.get('/:id', authMiddleware, getCarById);

// Route to update a car by ID
router.put('/:id', authMiddleware, upload, updateCar);

// Route to delete a car by ID
router.delete('/:id', authMiddleware, deleteCar);

module.exports = router;
