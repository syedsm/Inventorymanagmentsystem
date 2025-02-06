import { useContext, useEffect, useState } from "react";
import { Contextapi } from "../../contexts/Authcontext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { toast } from "react-toastify";

function Buypage() {
  const { buyitem, setbuyitem, themeMode, loginemail, setOrderType } =
    useContext(Contextapi);
  const [product, setProducts] = useState([]);
  const [message, setMessage] = useState("");
  // const [isPayPalVisible, setIsPayPalVisible] = useState(false);
  let navigate = useNavigate();
  let totalAmount = 0;

  useEffect(() => {
    if (!buyitem || !buyitem.item) {
      console.warn("Cart items are not defined");
      return;
    }
    // console.log("buyitem",buyitem);
    axios
      .post("https://inventorymanagmentsystembackend.onrender.com/api/user/cartproducts", { ids: Object.keys(buyitem.item) })
      .then((res) => {
        // console.log("res", res);
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
  }, [buyitem]);

  function handleQuan(id) {
    return buyitem.item ? buyitem.item[id] : 0;
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
    let _buyitem = { ...buyitem };
    _buyitem.item[id] = currentQty + 1;
    _buyitem.totalItems += 1;
    setbuyitem(_buyitem);
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
    let _cart = { ...buyitem };
    _cart.item[id] = currentQty - 1;
    _cart.totalItems -= 1;
    setbuyitem(_cart);
  }

  function handlePrice(id, price) {
    let currentPrice = handleQuan(id) * price;
    totalAmount += currentPrice;
    return currentPrice;
  }

  function handleDelete(e, id) {
    const handleconfrim = window.confirm("Are you sure to delete");
    if (handleconfrim) {
      if (!id) {
        console.error("Product ID is undefined");
        return;
      }
      let currentQty = handleQuan(id);
      const updatedItems = Object.fromEntries(
        Object.entries(buyitem.item).filter(([itemId]) => itemId !== id)
      );
      const updatedTotalItems = buyitem.totalItems - currentQty;
      const updatedCart = {
        ...buyitem,
        item: updatedItems,
        totalItems: updatedTotalItems,
      };
      setbuyitem(updatedCart);
    } else {
      console.log("error delete product in cart");
    }
  }

  function handleCheckout() {
    if (loginemail) {
      setOrderType("OrderType");
      localStorage.setItem("OrderType", "buyitem");
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
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <section id="emptycard">
            <div className="text-center">
              <img
                src="./noorder.jpg"
                className="img-fluid"
                alt="emptycart"
                style={{ width: "40%", height: "100vh" }}
              />
              <h3>Your Cart is Empty</h3>
            </div>
          </section>
        )}
      </div>
    </>
  );
}

export default Buypage;
