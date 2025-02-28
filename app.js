const express = require('express');
const { Cashfree } = require("cashfree-pg");
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const sequelize = require('./config/dbconfig');
const authRoute = require('./routes/authRoutes');
const expenseRoute = require('./routes/expenseRoutes');
const premiumRoute = require('./routes/premiumRoutes');
const passwordRoute = require('./routes/resetPasswordRoutes');
const paymentRoute = require('./routes/paymentRoutes');

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
app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'dashboard.html'));
});




app.use('/auth', authRoute);
app.use("/api/expenses", expenseRoute);

app.use("/api/premium", premiumRoute);

app.use('/api/password', passwordRoute);

app.use('/api/payments', paymentRoute);






sequelize.sync()
    .then(() => { app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`)) })
    .catch((error) => console.log(error));