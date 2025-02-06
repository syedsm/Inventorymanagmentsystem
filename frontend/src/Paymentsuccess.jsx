import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Contextapi } from "./contexts/Authcontext";

const Paymentsuccess = () => {
  const { setCart, setbuyitem, OrderType, setOrderType } =
    useContext(Contextapi);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [error, setError] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Extract query parameters from the URL
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    const payerId = params.get("PayerID");

    if (!token || !payerId) {
      setError("Missing token or PayerID.");
      return;
    }

    const fetchPaymentDetails = async () => {
      try {
        // Fetch the PayPal access token from your backend
        const tokenResponse = await axios.get("https://inventorymanagmentsystembackend.onrender.com/api/paypal/accessToken");
        const accessToken = tokenResponse.data.accessToken;

        // Now use this token to make the API call to PayPal
        const response = await axios.get(
          `https://api.sandbox.paypal.com/v2/checkout/orders/${token}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`, // Use the valid access token from your backend
              "Content-Type": "application/json",
            },
          }
        );

        // console.log("PayPal API Response:", response.data);

        if (response.data) {
          // Set payment details state with necessary fields
          const {
            id: paymentId,
            status,
            payment_source: { paypal: paymentSource },
            purchase_units: [{ amount, description }],
          } = response.data;

          const { value: amountValue, currency_code: currency } = amount;
          const { email_address: payerEmail, name: payerName } = paymentSource;
          const { given_name: firstName, surname: lastName } = payerName;

          setPaymentDetails({
            paymentId,
            amount: amountValue,
            status,
            description,
            payerEmail,
            payerName: `${firstName} ${lastName}`,
            currency,
          });
        } else {
          setError("No payment details found.");
        }
      } catch (err) {
        console.error("Error fetching payment details:", err);
        setError("Failed to fetch payment details.");
      }
    };

    // Fetch payment details immediately after mounting
    fetchPaymentDetails();
  }, [location.search]);
  useEffect(() => {
    if (!OrderType) {
      toast.error("Type parameter is missing in the URL.");
      return;
    }

    if (paymentDetails && !showToast) {
      toast.success("Items Successfully Ordered");
      setShowToast(true);

      // Function to save payment details to the server
      const savePaymentDetails = async () => {
        try {
          if (OrderType === "cart") {
            // Retrieve and parse 'cart' from localStorage
            const cart = JSON.parse(localStorage.getItem("cart"));

            // Check if cart or its items are missing
            if (!cart || !cart.item) {
              toast.error("Cart is empty or not available.");
              return;
            }

            // Extract product IDs and quantities
            const productIds = Object.keys(cart.item);
            const quantities = Object.values(cart.item);

            // Ensure productIds and quantities are valid
            if (
              productIds.length !== quantities.length ||
              productIds.length === 0
            ) {
              toast.error("Cart data is invalid.");
              return;
            }

            // Create items array with productId and quantity
            const items = productIds.map((productId, index) => ({
              productId,
              quantity: quantities[index],
            }));

            // Prepare the order data
            const data = {
              paymentId: paymentDetails.paymentId,
              amount: paymentDetails.amount,
              status: paymentDetails.status,
              description: paymentDetails.description,
              payerEmail: paymentDetails.payerEmail,
              payerName: paymentDetails.payerName,
              currency: paymentDetails.currency,
              userId: localStorage.getItem("authToken"),
              cartItem: JSON.stringify(cart.item),
              items,
              paymentMethod: "PayPal",
              userDetails: JSON.parse(sessionStorage.getItem("userDetails")),
            };

            // console.log("Order data to save:", data);

            // Send the order data to the server
            const response = await axios.post("https://inventorymanagmentsystembackend.onrender.com/api/order/saveorder", data);
            if (response.status === 201) {
              // Successfully saved the order, clear cart and session data
              localStorage.removeItem("cart");
              setCart(""); // Clear cart state
              sessionStorage.clear(); // Clear session storage
              toast.success("Order saved successfully!");
            } else {
              toast.error("Failed to save order.");
            }
          } else if (OrderType === "buyitem") {
            // Handle 'buyitem' logic similarly
            const buyitem = JSON.parse(localStorage.getItem("buyitem"));
            if (!buyitem || !buyitem.item) {
              toast.error("Buy item is empty or not available.");
              return;
            }

            const productIds = Object.keys(buyitem.item);
            const quantities = Object.values(buyitem.item);

            if (
              productIds.length !== quantities.length ||
              productIds.length === 0
            ) {
              toast.error("Buy item data is invalid.");
              return;
            }

            const items = productIds.map((productId, index) => ({
              productId,
              quantity: quantities[index],
            }));

            const data = {
              paymentId: paymentDetails.paymentId,
              amount: paymentDetails.amount,
              status: paymentDetails.status,
              description: paymentDetails.description,
              payerEmail: paymentDetails.payerEmail,
              payerName: paymentDetails.payerName,
              currency: paymentDetails.currency,
              userId: localStorage.getItem("authToken"),
              buyItem: JSON.stringify(buyitem.item),
              items,
              paymentMethod: "PayPal",
              userDetails: JSON.parse(sessionStorage.getItem("userDetails")),
            };

            console.log("Buy item data to save:", data);

            // Send the buy item order data to the server
            const response = await axios.post("https://inventorymanagmentsystembackend.onrender.com/api/order/saveorder", data);
            if (response.status === 201) {
              // Successfully saved the order, clear buyitem and session data
              localStorage.removeItem("buyitem");
              setbuyitem(""); // Clear buyitem state
              sessionStorage.clear(); // Clear session storage
              toast.success("Order saved successfully!");
            } else {
              toast.error("Failed to save order.");
            }
          } else {
            // Handle case if OrderType is not 'cart' or 'buyitem'
            toast.error("Invalid type parameter.");
          }
        } catch (err) {
          console.error("Error occurred while processing payment data:", err);
          toast.error("Failed to save payment data.");
        }
      };

      // Call the function to save payment details
      savePaymentDetails();
    }
  }, [
    paymentDetails,
    showToast,
    navigate,
    setCart,
    setbuyitem,
    location.search,
    OrderType, // Trigger the effect when location.search changes
  ]);

  // Error handling
  if (error) {
    return (
      <div className="container text-center">
        <h1>Error</h1>
        <p>{error}</p>
        <button className="btn btn-primary" onClick={() => navigate("/")}>
          Go Back
        </button>
      </div>
    );
  }

  const handleredirect = () => {
    navigate("/home");
  };
  // Render payment details once fetched
  return (
    <>
      <div className="container d-flex flex-column justify-content-center align-items-center min-vh-100 px-3">
        <h1 className="display-4 text-primary mb-4 text-center">
          <span className="text-warning font-weight-bold">
            Payment Successful!
          </span>
        </h1>

        {paymentDetails ? (
          <div
            className="card shadow-sm p-4 w-100"
            style={{ maxWidth: "600px" }}
          >
            <div className="mb-3">
              <strong>Payment ID:</strong>
              <span className="d-block text-muted">
                {paymentDetails.paymentId}
              </span>
            </div>
            <div className="mb-3">
              <strong>Amount:</strong>
              <span className="d-block text-muted">
                ${paymentDetails.amount}
              </span>
            </div>
            <div className="mb-3">
              <strong>Status:</strong>
              <span className="d-block text-muted">
                {paymentDetails.status}
              </span>
            </div>
            <button
              className="btn btn-primary btn-lg w-100"
              onClick={handleredirect}
            >
              Go to Dashboard
            </button>
          </div>
        ) : (
          <p className="text-muted">Loading payment details...</p>
        )}
      </div>

      <ToastContainer />
    </>
  );
};

export default Paymentsuccess;
