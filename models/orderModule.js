const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Order = sequelize.define("Order", {
    orderId: { type: DataTypes.STRING, allowNull: false, primaryKey: true },
    orderAmount: { type: DataTypes.FLOAT, allowNull: false },
    orderStatus: { type: DataTypes.STRING, },
    customerId: { type: DataTypes.STRING, allowNull: false },
    customerPhone: { type: DataTypes.STRING, allowNull: false },
}, { timestamps: true });

module.exports = Order;