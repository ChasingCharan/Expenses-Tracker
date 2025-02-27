const { Cashfree } = require("cashfree-pg");
require("dotenv").config();

// Initialize Cashfree credentials
Cashfree.XClientId = process.env.CASHFREE_APP_ID;
Cashfree.XClientSecret = process.env.CASHFREE_SECRET_KEY;
Cashfree.XEnvironment = Cashfree.Environment.SANDBOX; 

module.exports = Cashfree;
