import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const Paymentform = () => {
  // const Navigate = useNavigate();
  const { totalAmount } = useParams();
  // console.log("totalAmount Received:", totalAmount);

  // Form state and handling
  const [userDetails, setUserDetails] = useState({
    name: "",
    number: "",
    address: "",
  });

  const [isPayPalVisible, setIsPayPalVisible] = useState(false);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  // Form submission logic
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate the user details
    if (!userDetails.name || !userDetails.number || !userDetails.address) {
      toast.error("Please fill in all the details.");
      return;
    }

    // Save userDetails to sessionStorage
    sessionStorage.setItem("userDetails", JSON.stringify(userDetails));

    // Set the PayPal section to visible
    setIsPayPalVisible(true);
  };

  // Function to create the order on the backend
  const onCreateOrder = async () => {
    try {
      const response = await axios.post("https://inventorymanagmentsystembackend.onrender.com/paypal/createOrder", {
        totalAmount: totalAmount,
        description: "Payment for items in cart",
      });

      if (response.data.orderId && response.data.approvalUrl) {
        console.log("Order created successfully:", response.data);
        // Redirect user to PayPal for approval
        window.location.href = response.data.approvalUrl;
        // This will take the user to PayPal for approval
      } else {
        console.error("Error: No order ID or approval URL received");
      }
    } catch (error) {
      console.error("Error creating PayPal order:", error);
      alert("Error creating order. Please try again.");
    }
  };

  // Handle approval after payment
  const onApproveOrder = async (data) => {
    try {
      if (!data?.orderID) throw toast.error("Invalid Order ID");
      console.log("Order Id ", data.orderID); // The orderId from PayPal approval callback

      const paymentId = data.orderID; // PayPal sends orderID after approval

      // Call the backend to capture the payment
      const response = await axios.get(
        `https://inventorymanagmentsystembackend.onrender.com/paypal/capturepayment/${paymentId}`
      );
      console.log("Payment Successful:", response.data);
      alert("Payment Successful");
      // Navigate(`/success/${OrderType}`);
    } catch (error) {
      console.error("Error capturing PayPal order:", error);
      alert("Payment Failed. Please try again.");
    }
  };

  // Handle errors from PayPal
  const onError = (error) => {
    console.error("Error with PayPal payment:", error);
    alert(
      "There was an issue processing your payment. Please try again later."
    );
  };

  return (
    <div className="container-fluid" style={{ paddingTop: "50px" }}>
      <div className="row justify-content-center">
        {/* User Details Form */}
        <div className="col-md-6 col-lg-5">
          <h1 className="text-center mb-4">Enter Your Details</h1>
          <form
            onSubmit={handleSubmit}
            className="bg-light p-4 rounded shadow-sm"
          >
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-control"
                value={userDetails.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="number" className="form-label">
                Phone Number
              </label>
              <input
                type="tel"
                id="number"
                name="number"
                className="form-control"
                value={userDetails.number}
                onChange={handleChange}
                required
                pattern="^\d{10}$"
                title="Please enter a valid 10-digit phone number"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="address" className="form-label">
                Address
              </label>
              <textarea
                id="address"
                name="address"
                className="form-control"
                value={userDetails.address}
                onChange={handleChange}
                required
                rows="3"
              ></textarea>
            </div>

            <button
              className="btn btn-warning btn-block mt-3 w-100"
              type="submit"
            >
              Proceed to Payment
            </button>
          </form>
        </div>

        {/* PayPal Button Section */}
        <div
          className="col-md-6 col-lg-5 mt-md-0"
          style={{ paddingTop: "150px" }}
        >
          {/* PayPal Button */}
          {isPayPalVisible && (
            <PayPalScriptProvider
              options={{
                "client-id": import.meta.env.VITE_paypal_clientId,
              }}
            >
              <PayPalButtons
                createOrder={onCreateOrder}
                onApprove={onApproveOrder}
                onError={onError}
                style={{
                  layout: "vertical",
                  shape: "pill",
                  color: "gold",
                  label: "pay",
                }}
              />
            </PayPalScriptProvider>
          )}
        </div>
      </div>
    </div>
  );
};

export default Paymentform;
