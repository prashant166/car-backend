const Car = require('../models/Car');
const { Op } = require('sequelize');

// Create a new car
const createCar = async (req, res) => {
  const { title, description, tags } = req.body;

  const tagsArray = Array.isArray(tags) ? tags : [tags];
  const images = req.files ? req.files.map(file => file.path) : (Array.isArray(req.body.images) ? req.body.images : []);

  try {
    const car = await Car.create({
      title,
      description,
      tags: tagsArray,
      images,
      userId: req.user.userId
    });
    res.status(201).json({ message: 'Car created successfully', car });
  } catch (error) {
    console.error('Error creating car:', error);
    res.status(500).json({ error: 'Error creating car' });
  }
};


// Get all cars with search functionality
const getCars = async (req, res) => {
  const { q } = req.query; // Change to 'q' to match the frontend query parameter
  let whereClause = {};

  // Search based on title, description, or tags if a query is provided
  if (q) {
    whereClause = {
      [Op.or]: [
        { title: { [Op.iLike]: `%${q}%` } },
        { description: { [Op.iLike]: `%${q}%` } },
        { tags: { [Op.contains]: [q] } }, // Assumes tags is an array
      ],
    };
  }

  try {
    const cars = await Car.findAll({ where: whereClause });
    res.status(200).json(cars);
  } catch (error) {
    console.error('Error fetching cars:', error);
    res.status(500).json({ error: 'Error fetching cars' });
  }
};

// Get all cars for a specific user
const getUserCars = async (req, res) => {
  try {
    const cars = await Car.findAll({ where: { userId: req.user.userId } });
    res.status(200).json(cars);
  } catch (error) {
    console.error('Error fetching user cars:', error);
    res.status(500).json({ error: 'Error fetching user cars' });
  }
};

// Get a specific car by ID
const getCarById = async (req, res) => {
  try {
    const car = await Car.findOne({
      where: { id: req.params.id, userId: req.user.userId }
    });
    if (!car) return res.status(404).json({ error: 'Car not found' });
    res.status(200).json(car);
  } catch (error) {
    console.error('Error fetching car:', error);
    res.status(500).json({ error: 'Error fetching car' });
  }
};

// Update a car by ID
const updateCar = async (req, res) => {
  try {
    // Find the car by ID and ensure it belongs to the authenticated user
    const car = await Car.findOne({
      where: { id: req.params.id, userId: req.user.userId }
    });

    if (!car) {
      return res.status(404).json({ error: 'Car not found' });
    }

    // Extract updated fields from req.body
    const { title, description, tags } = req.body;

    // Handle uploaded files if any are provided
    let images = car.images || []; // Use existing images if no new files are uploaded
    if (req.files && req.files.length > 0) {
      const uploadedImages = req.files.map(file => file.path); // Get paths of new images
      images = [...images, ...uploadedImages].slice(0, 10); // Limit to max 10 images
    }

    // Update the car record with the new data
    await car.update({
      title: title || car.title,
      description: description || car.description,
      tags: tags ? JSON.parse(tags) : car.tags, // Parse tags if sent as a JSON string
      images
    });

    res.status(200).json({ message: 'Car updated successfully', car });
  } catch (error) {
    console.error('Error updating car:', error);
    res.status(500).json({ error: 'Error updating car' });
  }
};


// Delete a car by ID
const deleteCar = async (req, res) => {
  try {
    const car = await Car.findOne({
      where: { id: req.params.id, userId: req.user.userId }
    });
    if (!car) return res.status(404).json({ error: 'Car not found' });

    await car.destroy();
    res.status(200).json({ message: 'Car deleted successfully' });
  } catch (error) {
    console.error('Error deleting car:', error);
    res.status(500).json({ error: 'Error deleting car' });
  }
};

module.exports = { createCar, getCars, getUserCars, getCarById, updateCar, deleteCar };
