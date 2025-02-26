const DataTypes = require('sequelize');
const bcrypt = require("bcrypt");
const sequelize = require('../config/dbconfig');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    totalExpenses: {
        type: DataTypes.FLOAT,
        defaultValue: 0
    }

}
);

module.exports = User;