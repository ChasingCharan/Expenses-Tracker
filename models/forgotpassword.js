const DataTypes = require('sequelize');
const sequelize = require('../config/dbconfig');
const User = require('./User');

const ForgotPassword = sequelize.define('ForgotPassword', {
    id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    active: DataTypes.BOOLEAN,
    expiresby: DataTypes.DATE
});     

User.hasOne(ForgotPassword, { foreignKey: 'userId' });
ForgotPassword.belongsTo(User, { foreignKey: 'userId' });

module.exports = ForgotPassword;    