const {
    createOrder,
    getPaymentStatus,
  } = require("../Services/cashfreeService");

const { v4: uuidv4 } = require("uuid");

// const Cashfree = require("../config/cashfreeConfig");
const Payment = require("../models/paymentModel");
const User = require("../models/User");

exports.processPayment = async (req, res) => {

    const user =await User.findByPk(req.user.id);

    const orderId = uuidv4();
    const orderAmount = 2000;
    const orderCurrency = "INR";
    const customerID = req.user.id;
    const customerPhone = `+91${user.phoneNumber}`;

    try {


        const paymentSessionId = await createOrder(
            orderId,
            orderAmount,
            orderCurrency,
            customerID,
            customerPhone,
          );


        if(!paymentSessionId){
            console.log("Failed to receive a valid payment session ID");
            return res.status(500).json({ error: "Failed to receive a valid payment session ID" });
        }
        

        // Save order details in DB
        const payment = await Payment.create({
            orderId,
            paymentSessionId,
            orderAmount,
            orderCurrency,
            customerID,
            paymentStatus: "Pending",
        });

        res.json({ paymentSessionId, orderId });

    } catch (error) {
        console.error("Error creating order:", error.message);
        res.status(500).json({ error: "Payment initiation failed" });
    }

};


// Get payment status for a given order
exports.getPaymentStatus = async (req, res) => {
    const  paymentSessionId = req.params.paymentSessionId;
    try {
        
        const orderStatus = await getPaymentStatus(paymentSessionId);

        const order = await Payment.findOne({ paymentSessionId });

        order.paymentStatus = orderStatus;
        await order.save();

        console.log(orderStatus);
        // make user premium if payment is successful
        if(orderStatus === "SUCCESS"){
            const user = await User.findByPk(order.customerID);
            console.log("user not found ", user);
            console.log(user.isPremium);
            user.isPremium = true;
            await user.save();
        }
        return res.redirect("/dashboard");
        
    
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