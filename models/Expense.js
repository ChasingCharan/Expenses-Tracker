const DataTypes = require('sequelize');
const sequelize = require('../config/dbconfig');
const User = require('./User');

const Expense = sequelize.define('Expense', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    amount: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    }

});

User.hasMany(Expense, {foreignKey: 'userId'}, {onDelete: 'CASCADE'});
Expense.belongsTo(User, {foreignKey: 'userId'}, {onDelete: 'CASCADE'});
module.exports = Expense;