import { useState, useEffect, useContext } from "react";
import { Contextapi } from "../../contexts/Authcontext";
import axios from "axios";

function MyOrder() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { login } = useContext(Contextapi);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("/api/order/userorder/", {
          headers: {
            Authorization: `Bearer ${login}`,
          },
        });

        if (response.status !== 200) {
          throw new Error("Failed to fetch orders");
        }

        setOrders(response.data); // Store orders data
      } catch (error) {
        console.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [login]);

  return (
    <div className="container-fluid" style={{ paddingTop: "50px" }}>
      <h1 className="text-center mb-4">My Orders</h1>
      {loading && <p className="text-center">Loading orders...</p>}

      <div className="row">
        {/* If no orders are found */}
        {orders.length === 0 ? (
          <div className="col-12 text-center">
            <img src="./noorder.jpg" alt="no order img" className="img-fluid" style={{width:"300px",height:"auto"}} />{" "}
          </div>
        ) : (
          orders.map((order) => (
            <div className="col-12 col-md-6 col-lg-4 mb-4" key={order._id}>
              <div className="order-card shadow-sm p-3 rounded border">
                <div className="order-header d-flex justify-content-between">
                  <h5>Order #{order._id}</h5>
                  <span
                    className={`badge bg-${
                      order.status === "APPROVED" ? "success" : "warning"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>

                <div>
                  <h6>Items:</h6>
                  <ul className="list-unstyled">
                    {/* Mapping through items to display product details */}
                    {order.items.map((item, index) => (
                      <li
                        key={index}
                        className="d-flex align-items-center mb-3"
                      >
                        <img
                          src={item.productId.Images[0]}
                          alt={item.productId.Productname}
                          className="img-thumbnail me-3"
                          style={{
                            width: "100px",
                            height: "100px",
                            objectFit: "cover",
                          }}
                        />
                        <div>
                          <strong>{item.productId.Productname}</strong> <br />
                          <span>Quantity: {item.quantity}</span> <br />
                          <span>Price: ${item.productId.Price}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="order-footer mt-4">
                  <p>
                    <strong>Total Amount:</strong> ${order.totalAmount}
                  </p>
                  <p>
                    <strong>Order Date:</strong>{" "}
                    {new Date(order.orderDate).toLocaleDateString()}
                  </p>

                  <button className="btn btn-info w-100 mt-3">
                    View Order Details
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default MyOrder;
