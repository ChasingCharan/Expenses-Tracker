const express = require('express');
const { Cashfree } = require("cashfree-pg");
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const sequelize = require('./config/dbconfig');
const authRoute = require('./routes/authRoutes');
const expenseRoute = require('./routes/expenseRoutes');
const premiumRoute = require('./routes/premiumRoutes');

const path = require('path');


const PORT = process.env.PORT || 3000;

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname,'public')));
app.use(express.static(path.join(__dirname,'views')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});
app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'signup.html'));
});


app.use('/auth', authRoute);
app.use("/api/expenses", expenseRoute);

app.use("/api/premium", premiumRoute);



// Cashfree credentials
Cashfree.XClientId = process.env.CASHFREE_APP_ID;
Cashfree.XClientSecret = process.env.CASHFREE_SECRET_KEY;
Cashfree.XEnvironment = Cashfree.Environment.SANDBOX;

exports.createOrder = async (
    orderId,
    orderAmount,
    orderCurrency = "INR",
    customerID,
    customerPhone
) => {
    try {
        const  expiryDate = new Date(Date.now()+60*60*1000);
        const formattedExpiryDate = expiryDate.toISOString();

        const request = {
            order_amount: orderAmount,
            order_currency: orderCurrency,
            order_id: orderId,
            customer_details: {
                customer_id: customerID,
                customer_phone: customerPhone,
            },
            order_meta:{
                return_url: `http://localhost:3000/payment-status/${orderId}`,
                payment_modes: "cc,dc,nb,upi,emi,wallet"
            },
            order_expiry_time:formattedExpiryDate,
        };
        const response = await Cashfree.PGCreateOrder("2023-08-01",request);
        return response.data.payment_session_id;

    } catch (error) {    
        console.log(error.message);
    }
};

exports.getPaymentStatus = async (orderId) => {
    try {
        const response = await Cashfree.PGOrderFetchPayments("2023-08-01",orderId);
        let getOrderResponse = response.data;
        let orderStatus;
        if(getOrderResponse.filter((transaction) => transaction.payment_status === "SUCCESS").length > 0){
            orderStatus = "SUCCESS";
        }else if(getOrderResponse.filter((transaction) => transaction.payment_status === "PENDING").length > 0){
            orderStatus = "PENDING";
        }else{
            orderStatus = "FAILED";
        }
        return orderStatus;
    } catch (error) {
        console.log(error.message);
    }
};

app.post("/pay", async (req, res) => {
    try {
        const { orderId, orderAmount, customerID, customerPhone } = req.body;
        const paymentSessionId = await exports.createOrder(orderId, orderAmount, customerID, customerPhone);
        res.json({ paymentSessionId });
    } catch (error) {
        res.status(500).json({ error: "Payment initiation failed" });
    }
});






sequelize.sync()
    .then(() => { app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`)) })
    .catch((error) => console.log(error));