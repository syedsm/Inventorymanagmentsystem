// const router = require('express').Router();
// const axios = require('axios');
// const { json } = require('express');
// require('dotenv').config();

// // Function to get PayPal access token
// const AccessToken = async () => {
//   try {
//     // Log the attempt to fetch access token for debugging
//     console.log('Attempting to get PayPal access token...');

//     // Use URLSearchParams to encode form data
//     const params = new URLSearchParams();
//     params.append('grant_type', 'client_credentials');  // Sending the correct form data

//     const response = await axios.post(
//       'https://api.sandbox.paypal.com/v1/oauth2/token',
//       params,  // Send the URLSearchParams formatted data
//       {
//         auth: {
//           username: process.env.PAYPAL_CLIENT_ID,
//           password: process.env.PAYPAL_SECRET,
//         },
//         headers: {
//           'Content-Type': 'application/x-www-form-urlencoded', // Proper content type
//         },
//       }
//     );

//     // Log the response for debugging purposes
//     console.log('Access token response:', response.data);

//     return response.data.access_token;

//   } catch (error) {
//     // Log the error to the console for debugging
//     console.error('Error in getting PayPal access token:', error.message);
//     throw new Error('Error in getting access token: ' + error.message);
//   }
// };
// const qs = require('querystring');

// const getAccessToken = async () => {
//     const clientId = 'YOUR_CLIENT_ID';
//     const secret = 'YOUR_CLIENT_SECRET';

//     const auth = Buffer.from(`${clientId}:${secret}`).toString('base64');

//     const response = await axios.post(
//         'https://api.sandbox.paypal.com/v1/oauth2/token',
//         qs.stringify({ grant_type: 'client_credentials' }),
//         {
//             headers: {
//                 'Authorization': `Basic ${auth}`,
//                 'Content-Type': 'application/x-www-form-urlencoded',
//             },
//         }
//     );

//     return response.data.access_token;
// };

// // Function to create an order using the access token
// const createOrder = async (req, res) => {
//   const { totalAmount, description } = req.body;

//   try {
//     const accessToken = await AccessToken();  // Get PayPal access token
//     const orderResponse = await axios.post(
//       'https://api.sandbox.paypal.com/v2/checkout/orders',
//       {
//         intent: 'CAPTURE',
//         purchase_units: [
//           {
//             amount: {
//               currency_code: 'USD',
//               value: totalAmount.toString(), // Use dynamic totalAmount
//             },
//             description: description,
//           },
//         ],
//         application_context: {
//           brand_name: 'Checkout',
//           shipping_preference: 'NO_SHIPPING',
//           user_action: 'PAY_NOW',
//           return_url: 'http://localhost:5173/success',  // The URL to redirect to after approval
//           cancel_url: 'http://localhost:5173/failed',   // The URL to redirect to if user cancels payment
//         },
//       },
//       {
//         headers: {
//           'Authorization': `Bearer ${accessToken}`,
//           'Content-Type': 'application/json',
//         },
//       }
//     );

//     // Check if order was created successfully
//     if (orderResponse.data && orderResponse.data.id) {
//       // Find the approval URL from PayPal response
//       const approvalUrl = orderResponse.data.links.find(link => link.rel === 'approve').href;

//       return res.status(200).json({
//         message: 'Order created successfully',
//         orderId: orderResponse.data.id,  // Send orderId to frontend
//         approvalUrl: approvalUrl,  // PayPal approval URL for redirect
//       });
//     } else {
//       return res.status(500).json({ message: 'Error creating PayPal order' });
//     }
//   } catch (error) {
//     console.error('Error creating PayPal order:', error.message);
//     return res.status(500).json({ message: 'Error creating PayPal order', error: error.message });
//   }
// };

// // Function to capture payment
// const capturePayment = async (req, res) => {
//   const { token, payerId } = req.params; // Capture token and PayerID from the URL
//   console.log('Capture payment called for token:', token, 'and payerId:', payerId);

//   try {
//     const accessToken = await AccessToken(); // Get PayPal access token
//     console.log('Access token fetched:', accessToken);

//     // Check if the order has already been captured
//     const captureResponse = await axios.get(
//       `https://api.sandbox.paypal.com/v2/checkout/orders/${token}`,
//       {
//         headers: {
//           'Authorization': `Bearer ${accessToken}`,
//           'Content-Type': 'application/json',
//         },
//       }
//     );

//     console.log('Capture response from PayPal:', captureResponse.data);

//     // If the status is already completed, it means the payment was already captured.
//     if (captureResponse.data.status === 'COMPLETED') {
//       console.log('Payment already captured:', captureResponse.data);
//       // Return the payment details to show success page
//       return res.status(200).json({
//         paymentId: captureResponse.data.id,
//         amount: captureResponse.data.purchase_units[0].amount.value,
//         status: captureResponse.data.status,
//         description: captureResponse.data.purchase_units[0].description,
//       });
//     } else {
//       // If the order has not been captured, proceed with capturing the payment
//       const capturePaymentResponse = await axios.post(
//         `https://api.sandbox.paypal.com/v2/checkout/orders/${token}/capture`,
//         { payer_id: payerId },
//         {
//           headers: {
//             'Authorization': `Bearer ${accessToken}`,
//             'Content-Type': 'application/json',
//           },
//         }
//       );

//       console.log('Capture payment response from PayPal:', capturePaymentResponse.data);

//       // Check the response after capturing the payment
//       if (capturePaymentResponse.data.status === 'COMPLETED') {
//         console.log('Payment captured successfully:', capturePaymentResponse.data);
//         return res.status(200).json({
//           paymentId: capturePaymentResponse.data.id,
//           amount: capturePaymentResponse.data.purchase_units[0].amount.value,
//           status: capturePaymentResponse.data.status,
//           description: capturePaymentResponse.data.purchase_units[0].description,
//         });
//       } else {
//         console.error('Error capturing payment:', capturePaymentResponse.data);
//         return res.status(500).json({ message: 'Error capturing payment', details: capturePaymentResponse.data });
//       }
//     }
//   } catch (error) {
//     console.error('Error capturing payment:', error.response ? error.response.data : error.message);
//     return res.status(500).json({ message: 'Error capturing payment', error: error.message });
//   }
// };

// // New function to fetch order details using order ID (Token)
// // const getOrderDetails = async (req, res) => {
// //   const { token } = req.params; // Capture the order ID (token) from the URL
// //   console.log('Get order details called for token:', token); // Log the received token

// //   try {
// //     const accessToken = await AccessToken();  // Get PayPal access token
// //     console.log('Access token fetched:', accessToken);  // Log the access token

// //     // Make the API request to PayPal to get the order details
// //     const orderDetailsResponse = await axios.get(
// //       `https://api.sandbox.paypal.com/v2/checkout/orders/${token}`,
// //       {
// //         headers: {
// //           'Authorization': `Bearer ${accessToken}`,
// //           'Content-Type': 'application/json',
// //         },
// //       }
// //     );

// //     // Debugging the PayPal response
// //     console.log('PayPal Order Details Response:', orderDetailsResponse.data);

// //     if (orderDetailsResponse.data) {
// //       return res.status(200).json({
// //         orderId: orderDetailsResponse.data.id,
// //         status: orderDetailsResponse.data.status,
// //         amount: orderDetailsResponse.data.purchase_units[0].amount.value,
// //         description: orderDetailsResponse.data.purchase_units[0].description,
// //         payer: orderDetailsResponse.data.payer.name,
// //       });
// //     } else {
// //       console.error('No order details found for token:', token);
// //       return res.status(404).json({ message: 'Order details not found' });
// //     }
// //   } catch (error) {
// //     console.error('Error fetching order details:', error.message);
// //     return res.status(500).json({ message: 'Error fetching order details', error: error.message });
// //   }
// // };

// // Define routes
// router.post('/createOrder', createOrder);
// router.get('/capturepayment/:token/:payerId', capturePayment);
// // router.get('/getOrderDetails/:token', getOrderDetails); // New route to fetch order details

// module.exports = router;


const router = require('express').Router();
const axios = require('axios');
require('dotenv').config();

// Function to get PayPal access token
const getAccessToken = async () => {
  try {
    // console.log('Attempting to get PayPal access token...');
    const params = new URLSearchParams({ grant_type: 'client_credentials' });

    const response = await axios.post(
      'https://api.sandbox.paypal.com/v1/oauth2/token',
      params,
      {
        auth: {
          username: process.env.PAYPAL_CLIENT_ID,
          password: process.env.PAYPAL_SECRET,
        },
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      }
    );

    // console.log('Access token received.');
    return response.data.access_token;
  } catch (error) {
    console.error('Error fetching PayPal access token:', error.message);
    throw new Error('Failed to obtain access token.');
  }
};

// Function to create PayPal order
const createOrder = async (req, res) => {
  const { totalAmount, description } = req.body;
  // console.log("data recived", req.body);
  try {
    const accessToken = await getAccessToken();
    const orderResponse = await axios.post(
      'https://api.sandbox.paypal.com/v2/checkout/orders',
      {
        intent: 'CAPTURE',
        purchase_units: [{
          amount: { currency_code: 'USD', value: totalAmount.toString() },
          description,
        }],
        application_context: {
          brand_name: 'Checkout',
          shipping_preference: 'NO_SHIPPING',
          user_action: 'PAY_NOW',
          return_url: 'http://localhost:5173/success',
          cancel_url: 'http://localhost:5173/failed',
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const orderData = orderResponse.data;
    const approvalUrl = orderData.links.find(link => link.rel === 'approve')?.href;

    if (orderData.id && approvalUrl) {
      return res.status(200).json({
        message: 'Order created successfully',
        orderId: orderData.id,
        approvalUrl,
      });
    }

    return res.status(500).json({ message: 'Error creating PayPal order' });
  } catch (error) {
    console.error('Error creating PayPal order:', error.message);
    return res.status(500).json({ message: 'Error creating PayPal order', error: error.message });
  }
};

// Function to capture payment
const capturePayment = async (req, res) => {
  const { token, payerId } = req.params;
  // console.log("parmas", req.params);

  try {
    const accessToken = await getAccessToken();  // Get PayPal access token
    // console.log('Access token fetched:', accessToken);

    // Check if the order has already been captured
    const captureResponse = await axios.get(
      `https://api.sandbox.paypal.com/v2/checkout/orders/${token}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // console.log('Capture response from PayPal:', captureResponse.data);

    // If status is already 'COMPLETED', payment is already captured
    if (captureResponse.data.status === 'COMPLETED') {
      return res.status(200).json({
        paymentId: captureResponse.data.id,
        amount: captureResponse.data.purchase_units[0].amount.value,
        status: captureResponse.data.status,
        description: captureResponse.data.purchase_units[0].description,
      });
    } else {
      // Proceed with capturing the payment if not already completed
      const capturePaymentResponse = await axios.post(
        `https://api.sandbox.paypal.com/v2/checkout/orders/${token}/capture`,
        { payer_id: payerId },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      // console.log('Capture payment response from PayPal:', capturePaymentResponse.data);

      if (capturePaymentResponse.data.status === 'COMPLETED') {
        return res.status(200).json({
          paymentId: capturePaymentResponse.data.id,
          amount: capturePaymentResponse.data.purchase_units[0].amount.value,
          status: capturePaymentResponse.data.status,
          description: capturePaymentResponse.data.purchase_units[0].description,
        });
      } else {
        return res.status(500).json({ message: 'Error capturing payment', details: capturePaymentResponse.data });
      }
    }
  } catch (error) {
    console.error('Error capturing payment:', error.response ? error.response.data : error.message);
    return res.status(500).json({ message: 'Error capturing payment', error: error.message });
  }
};

// Route to fetch the access token
router.get('/accessToken', async (req, res) => {
  try {
    const token = await getAccessToken();
    res.json({ accessToken: token });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching PayPal access token' });
  }
});

// Define routes
router.post('/createOrder', createOrder);
router.get('/capturepayment/:token/:payerId', capturePayment);

module.exports = router;
