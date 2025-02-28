const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbconfig");
const User = require("./User");

const Payment = sequelize.define("Payment", {
    orderId: {
        type: DataTypes.STRING(36),
        primaryKey: true
    },
    orderAmount: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    orderCurrency: {
        type: DataTypes.STRING,
        defaultValue: "INR",
    },
    paymentStatus: {
        type: DataTypes.ENUM("PENDING", "SUCCESS", "FAILED"),
        defaultValue: "PENDING",
    },
    customerID: {
        type: DataTypes.INTEGER,  // Match User ID type
        allowNull: false,
        references: {
            model: User,
            key: "id",
        }
    },

});

// Define Relationship: One User can have multiple Payments
User.hasMany(Payment, { foreignKey: "customerID", onDelete: "CASCADE" });
Payment.belongsTo(User, { foreignKey: "customerID" });

module.exports = Payment;
