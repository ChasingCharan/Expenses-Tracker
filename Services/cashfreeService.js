const { Cashfree } = require("cashfree-pg");

Cashfree.XClientId = process.env.CASHFREE_APP_ID;
Cashfree.XClientSecret = process.env.CASHFREE_SECRET_KEY;
Cashfree.XEnvironment = Cashfree.Environment.SANDBOX;


exports.createOrder = async (
  orderId,
  orderAmount,
  orderCurrency="INR",
  customerID,
  customerPhone
) => {
  
  try {

    const expiryDate = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now
    const formattedExpiryDate = expiryDate.toISOString();

    const request = {
      order_amount: orderAmount,
      order_currency: orderCurrency,
      order_id: orderId,
      
      customer_details: {
        customer_id: String(customerID),  
        customer_phone: String(customerPhone),
      },

      order_meta: {
        return_url: `http://localhost:3000/api/payments/payment-status/${orderId}`, //? calling getPaymentStatus
        payment_methods: "ccc, upi, nb"
      },
      order_expiry_time: formattedExpiryDate, //!? Set the valid expiry date
    };

    const response = await Cashfree.PGCreateOrder("2023-08-01", request);


    return response.data.payment_session_id;
  } catch (error) {
    console.error("Error creating order:", error.message);
  }
};


exports.getPaymentStatus = async (orderId) => {
  try {

    const response = await Cashfree.PGOrderFetchPayments("2023-08-01", orderId);

    let getOrderResponse = response.data;
    let orderStatus;

    if (
      getOrderResponse.filter(
        (transaction) => transaction.payment_status === "SUCCESS"
      ).length > 0
    ) {
      orderStatus = "SUCCESS"; 
    } else if (
      getOrderResponse.filter(
        (transaction) => transaction.payment_status === "PENDING"
      ).length > 0
    ) {
      orderStatus = "PENDING"; 
    } else {
      orderStatus = "FAILURE";
    }

    return orderStatus;
    
  } catch (error) {
    console.error("Error fetching order status:", error.message);
  }
};

