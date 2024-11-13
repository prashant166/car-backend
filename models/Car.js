const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

class Car extends Model {}

Car.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true,
  },
  images: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true,
    validate: {
      // Custom validator to ensure no more than 10 images
      maxImages(value) {
        if (value && value.length > 10) {
          throw new Error('You can only upload up to 10 images');
        }
      }
    }
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
}, {
  sequelize,
  modelName: 'Car',
});

// Define associations
User.hasMany(Car, { foreignKey: 'userId' });
Car.belongsTo(User, { foreignKey: 'userId' });

module.exports = Car;
