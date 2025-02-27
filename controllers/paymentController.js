const { or } = require("sequelize");
const Cashfree = require("../config/cashfreeConfig");
const Payment = require("../models/paymentModel");
const User = require("../models/User");
// Create an order with Cashfree and associate it with a User
exports.createOrder = async (req, res) => {

    try {
        
        // Check if user exists
        const user = await User.findByPk( req.user.id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Save order details in DB
        const payment = await Payment.create({
            orderAmount:2000,
            orderCurrency: "INR",
            customerID: user.id, // Associate payment with user
            paymentStatus: "PENDING",
        });

        // Generate order expiry time (1 hour from now)
        const expiryDate = new Date(Date.now() + 60 * 60 * 1000).toISOString();

        console.log(payment.orderId);

        const request = {
            order_amount: 2000,
            order_currency: "INR",
            order_id: payment.orderId,
            customer_details: {
                customer_id: user.id,
                customer_phone: user.phoneNumber,
            },
            order_meta: {
                return_url: `http://localhost:3000//api/payments/payment-status/${order_id}`,
                payment_modes: "cc,dc,nb,upi,emi,wallet",
            },
            order_expiry_time: expiryDate,
        };

        console.log("Creating Order:", request);
        const response = await Cashfree.PGCreateOrder("2023-08-01", request);

        res.json({ paymentSessionId: response.data.payment_session_id });
    } catch (error) {
        console.error("Error creating order:", error.message);
        res.status(500).json({ error: "Payment initiation failed" });
    }
};

// Get payment status for a given order
exports.getPaymentStatus = async (req, res) => {
    try {
        
        const response = await Cashfree.PGGetOrderDetails("2023-08-01",order_id);

        let getOrderResponse = response.data;
        let orderStatus;

        if(getOrderResponse.filter(
            (transaction) => transaction.payment_status === "SUCCESS"
        ).length > 0){
            orderStatus = "SUCCESS";
        }
        else if(getOrderResponse.filter(
            (transaction) => transaction.payment_status === "PENDING"
        ).length > 0){
            orderStatus = "PENDING";
        }
        else{
            orderStatus = "FAILED";
        }

        return orderStatus;
    
    }catch (error) {
        console.error("Error fetching order status:", error.message);
        res.status(500).json({ error: "Failed to fetch order status" });
    };
};

exports.getUserPayments = async (req, res) => {
    try {
        const { customerID } = req.params;

        // Check if user exists
        const user = await User.findByPk(customerID, {
            include: Payment,
        });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json({ userPayments: user.Payments });
    } catch (error) {
        console.error("Error fetching user payments:", error.message);
        res.status(500).json({ error: "Failed to fetch payments" });
    }
};