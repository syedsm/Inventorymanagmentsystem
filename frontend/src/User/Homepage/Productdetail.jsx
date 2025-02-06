import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Contextapi } from "../../contexts/Authcontext";

function ProductDetail() {
  const { isDarkMode, cart, setCart, setbuyitem } = useContext(Contextapi);
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentMainImg, setCurrentMainImg] = useState("");

  useEffect(() => {
    axios
      .get(`https://inventorymanagmentsystembackend.onrender.com/api/user/singleproductfetch/${id}`)
      .then((response) => {
        setProduct(response.data);
        const mainImage = response.data.Images;
        setCurrentMainImg(mainImage);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching product:", error);
        setLoading(false);
      });
  }, [id]);

  let _cart = { ...cart };
  function handlecart(e, product) {
    if (!_cart.item) {
      _cart.item = {};
    }
    if (!_cart.item[product._id]) {
      _cart.item[product._id] = 1;
    } else {
      _cart.item[product._id] += 1;
    }
    if (!_cart.totalItems) {
      _cart.totalItems = 1;
    } else {
      _cart.totalItems += 1;
    }
    setCart(_cart);
  }

  let Navigate = useNavigate();

  function handlebuy() {
    if (localStorage.getItem("authToken")) {
      let _buyitem = {};
      _buyitem.item = {
        [product._id]: 1,
      };
      setbuyitem(_buyitem);
      Navigate("/buy");
    } else {
      Navigate("/"); 
    }
  }

  return (
    <div
      className={`container-fluid ${
        isDarkMode ? "bg-dark text-white" : "bg-light text-dark"
      }`}
      style={{ paddingTop: "100px" }}
    >
      <div className="row justify-content-center">
        <div className="col-lg-5 col-md-6 mb-4">
          <div
            className={`card shadow-lg ${
              isDarkMode ? "bg-dark text-white" : "bg-light text-dark"
            }`}
            style={{
              borderRadius: "12px",
              overflow: "hidden",
            }}
          >
            {loading ? (
              <div className="d-flex justify-content-center align-items-center p-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            ) : product ? (
              <>
                <img
                  src={
                    currentMainImg[0]
                      ? `/${currentMainImg[0]}`
                      : "/1732951772668.jpg"
                  }
                  alt={product.Productname}
                  onError={(e) => {
                    e.target.src = "/1732951772668.jpg"; // Fallback image
                  }}
                  className="card-img-top"
                  style={{
                    objectFit: "cover",
                    borderRadius: "12px 12px 0 0",
                    height: "350px",
                    width: "100%",
                  }}
                />
                <div className="d-flex flex-wrap mt-2 justify-content-center">
                  {product.Images &&
                    product.Images.map((img, index) => (
                      <img
                        key={index}
                        src={`/${img}`}
                        alt={`Additional ${index + 1}`}
                        className="img-thumbnail"
                        onClick={() => setCurrentMainImg([img])}
                        style={{
                          width: "80px",
                          height: "80px",
                          objectFit: "cover",
                          marginRight: "10px",
                          marginBottom: "10px",
                          cursor: "pointer",
                          transition: "transform 0.3s ease",
                        }}
                        onMouseOver={(e) => {
                          e.target.style.transform = "scale(1.1)";
                        }}
                        onMouseOut={(e) => {
                          e.target.style.transform = "scale(1)";
                        }}
                      />
                    ))}
                </div>
              </>
            ) : (
              <p className="card-text p-4">Product not found</p>
            )}
          </div>
        </div>

        <div className="col-lg-7 col-md-10">
          {loading ? (
            <div className="d-flex justify-content-center align-items-center p-5">
              <div className="spinner-border text-primary" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          ) : product ? (
            <div className="card shadow-lg" style={{marginBottom:"50px"}}>
              <div className="card-body">
                <h2 className="card-title text-center mb-3">
                  {product.Productname}
                </h2>
                <p className="card-text mb-4">{product.Description}</p>
                <h3 className="card-text mb-3 text-primary">
                  Price: ${product.Price}
                </h3>
                <h5 className="card-text">Brand: {product.Brand}</h5>
                <h5 className="card-text">Category: {product.Category}</h5>

                {product.Groceriesdetails && (
                  <div>
                    <h5>Groceries Details:</h5>
                    <p>Weight: {product.Groceriesdetails.weight} kg</p>
                    <p>
                      Expiration Date:{" "}
                      {new Date(
                        product.Groceriesdetails.Expirationdate
                      ).toLocaleDateString()}
                    </p>
                  </div>
                )}

                <p className="card-text mb-3">
                  Stock Status:{" "}
                  <span
                    className={`badge ${
                      product.Stockstatus === "In Stock"
                        ? "bg-success"
                        : "bg-danger"
                    }`}
                  >
                    {product.Stockstatus}
                  </span>
                </p>
                <p className="card-text mb-3">
                  Quantity Available: {product.Quantity}
                </p>

                {/* Product Ratings */}
                <div className="d-flex align-items-center mb-3">
                  <div className="me-3">
                    <span className="badge bg-warning text-dark">4.5 ⭐</span>
                    {/* <span>({product.Reviews.length} reviews)</span> */}
                  </div>
                </div>

                {/* Shipping and Return Policy */}
                <div className="mt-3">
                  <h5>Shipping Info:</h5>
                  <p>Free delivery within 3-5 business days.</p>
                  <h5>Return Policy:</h5>
                  <p>30-day return window, no questions asked.</p>
                </div>

                <div className="d-flex justify-content-between">
                  <button
                    className="btn btn-outline-primary"
                    onClick={(e) => handlecart(e, product)}
                    style={{ width: "48%" }}
                  >
                    Add to Cart
                  </button>
                  <button
                    className="btn btn-outline-success"
                    onClick={handlebuy}
                    style={{ width: "48%" }}
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <p>Product not found</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
