import { useContext, useEffect, useState } from "react";
import { Contextapi } from "./contexts/Authcontext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

function Cart() {
  const { cart, setCart, loginemail, themeMode, setOrderType } =
    useContext(Contextapi);
  const [product, setProducts] = useState([]);
  const [message, setMessage] = useState("");
  const [isPayPalVisible, setIsPayPalVisible] = useState(false);
  let navigate = useNavigate();
  let totalAmount = 0;

  // Fetch cart products when cart changes
  useEffect(() => {
    if (!cart || !cart.item) {
      console.warn("Cart items are not defined");
      return;
    }
    axios
      .post("https://inventorymanagmentsystembackend.onrender.com/user/cartproducts", { ids: Object.keys(cart.item) })
      .then((res) => {
        console.log("res", res);
        if (res.status === 200) {
          setProducts(res.data.apiData);
        } else {
          setMessage(res.data.message);
        }
      })
      .catch((error) => {
        console.error("Error fetching cart products:", error);
        setMessage("Failed to load cart products");
      });
  }, [cart]);

  function handleQuan(id) {
    return cart.item ? cart.item[id] : 0;
  }

  function handleIncrement(e, id, qty) {
    if (!id) {
      console.error("Product ID is undefined");
      return;
    }
    let currentQty = handleQuan(id);
    if (qty === currentQty) {
      alert("Product Reached Maximum limit");
      return;
    }
    let _cart = { ...cart };
    _cart.item[id] = currentQty + 1;
    _cart.totalItems += 1;
    setCart(_cart);
  }

  function handleDecrement(e, id) {
    if (!id) {
      console.error("Product ID is undefined");
      return;
    }
    let currentQty = handleQuan(id);
    if (currentQty === 1) {
      return;
    }
    let _cart = { ...cart };
    _cart.item[id] = currentQty - 1;
    _cart.totalItems -= 1;
    setCart(_cart);
  }

  function handlePrice(id, price) {
    let currentPrice = handleQuan(id) * price;
    totalAmount += currentPrice;
    return currentPrice;
  }

  // Function to create the order on the backend
  const onCreateOrder = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/paypal/createOrder",
        {
          totalAmount: totalAmount, // Send dynamic total amount
          description: "Payment for items in cart", // Description of the items
        }
      );

      if (response.data.orderId && response.data.approvalUrl) {
        console.log("Order created successfully:", response.data);
        // Redirect user to PayPal for approval
        window.location.href = response.data.approvalUrl; // This will take the user to PayPal for approval
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
      if (!data?.orderID) throw new Error("Invalid Order ID");
      // console.log("Order Id ", data.orderID); // The orderId from PayPal approval callback

      const paymentId = data.orderID; // PayPal sends orderID after approval

      // Call the backend to capture the payment
      const response = await axios.get(
        `http://localhost:5000/paypal/capturepayment/${paymentId}`
      );

      // console.log("Payment Successful:", response.data);
      alert("Payment Successful");
      navigate("/success"); // Navigate to the success page
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

  function handleDelete(e, id) {
    const handleconfrim = window.confirm("Are you sure to delete");
    if (handleconfrim) {
      if (!id) {
        console.error("Product ID is undefined");
        return;
      }
      let currentQty = handleQuan(id);
      const updatedItems = Object.fromEntries(
        Object.entries(cart.item).filter(([itemId]) => itemId !== id)
      );
      const updatedTotalItems = cart.totalItems - currentQty;
      const updatedCart = {
        ...cart,
        item: updatedItems,
        totalItems: updatedTotalItems,
      };
      setCart(updatedCart);
    } else {
      console.log("error delete product in cart");
    }
  }

  function handleCheckout() {
    if (loginemail) {
      setOrderType("OrderType");
      localStorage.setItem("OrderType", "cart");
      navigate(`/paymentform/${totalAmount}`);
    } else {
      navigate("/");
    }
  }

  return (
    <>
      {message}
      <div className="container-fluid">
        {product.length ? (
          <div
            style={{ paddingTop: "100px" }}
            className={`container-fluid${
              themeMode === "dark" ? " dark-mode" : " light-mode"
            }`}
          >
            <div className="row">
              <div id="cart-items" className="col-lg-8 col-md-12">
                <div
                  className={`card mb-3 ${
                    themeMode === "dark"
                      ? "bg-dark text-white"
                      : "bg-light text-dark"
                  }`}
                >
                  <div className="card-header">
                    <h5>Items in Cart</h5>
                  </div>
                  <div className="card-body">
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>S.No</th>
                            <th>Product Name</th>
                            <th>Product Image</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Delete</th>
                          </tr>
                        </thead>
                        <tbody>
                          {product.map((result, key) => (
                            <tr key={result._id}>
                              <td>{key + 1}</td>
                              <td>{result.Productname}</td>
                              <td>
                                <img
                                  id={`product-img-${result._id}`}
                                  className="img-fluid"
                                  src={result.Images}
                                  alt={result.name}
                                  style={{ maxWidth: "100px" }}
                                />
                              </td>
                              <td>
                                <div className="d-flex align-items-center">
                                  <button
                                    className="btn btn-sm btn-primary rounded-circle me-2"
                                    onClick={(e) =>
                                      handleIncrement(e, result._id, result.qty)
                                    }
                                  >
                                    +
                                  </button>
                                  <span className="me-2">
                                    {handleQuan(result._id)}
                                  </span>
                                  <button
                                    className="btn btn-sm btn-primary rounded-circle"
                                    onClick={(e) =>
                                      handleDecrement(e, result._id)
                                    }
                                  >
                                    -
                                  </button>
                                </div>
                              </td>
                              <td>₹{handlePrice(result._id, result.Price)}</td>
                              <td>
                                <button
                                  onClick={(e) => handleDelete(e, result._id)}
                                  className="btn btn-danger btn-sm"
                                >
                                  <i className="bi bi-trash3"></i>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
              <div id="order-summary" className="col-lg-4 col-md-12">
                <div
                  className={`card ${
                    themeMode === "dark"
                      ? "bg-dark text-white"
                      : "bg-light text-dark"
                  }`}
                >
                  <div className="card-header">
                    <h5>Order Summary</h5>
                  </div>
                  <div className="card-body">
                    <ul className="list-group list-group-flush">
                      <li className="list-group-item d-flex justify-content-between align-items-center">
                        Price items <span>₹ {totalAmount}</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between align-items-center">
                        Delivery Charges <span>₹ 0</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between align-items-center">
                        Total Amount <span>₹ {totalAmount}</span>
                      </li>
                    </ul>

                    <button
                      className="btn btn-warning btn-block mt-3 w-100"
                      onClick={handleCheckout}
                    >
                      Checkout
                    </button>
                    {/* <Paymentform totalAmount={totalAmount}/> */}
                    <div className="text-center mt-3">
                      <span className="badge bg-success">
                        Safe and Secure Payment
                      </span>
                    </div>

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
                        />
                      </PayPalScriptProvider>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <section id="emptycard" className="pt-5">
            <div className="text-center">
              <img
                src="./noorder.jpg"
                className="img-fluid"
                alt="emptycart"
                style={{ width: "300px", height: "600px" }}
              />
            </div>
          </section>
        )}
      </div>
    </>
  );
}

export default Cart;
