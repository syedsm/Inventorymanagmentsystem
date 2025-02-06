import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Contextapi } from "../../contexts/Authcontext";
import { Link, useNavigate } from "react-router-dom";
import FlipCardSection from "./FlipCardSection";

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { cart, setCart, setbuyitem } = useContext(Contextapi);
  const navigate = useNavigate();
  // Fetch products on component mount
  useEffect(() => {
    axios
      .get("/api/user/homepage")
      .then((res) => {
        // console.log("Data Received", res.data);
        setProducts(res.data.products);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data", err);
        setError("There was an error loading the products.");
        setLoading(false);
      });
  }, []);

  // Loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  // Error handling
  if (error) {
    return <div>{error}</div>;
  }

  // Function to chunk the products into groups of 4
  const chunkProducts = (arr, size) => {
    const result = [];
    for (let i = 0; i < arr.length; i += size) {
      result.push(arr.slice(i, i + size));
    }
    return result;
  };

  const productChunks = chunkProducts(products, 4); // Chunk the products into sets of 4

  // Function to handle adding product to cart
  const addToCart = (product) => {
    const updatedCart = { ...cart };
    const { _id } = product;

    if (!updatedCart.item) {
      updatedCart.item = {};
    }
    if (typeof updatedCart.totalItems === "undefined") {
      updatedCart.totalItems = 0;
    }
    if (updatedCart.item[_id]) {
      updatedCart.item[_id] += 1;
    } else {
      updatedCart.item[_id] = 1;
    }
    updatedCart.totalItems += 1;
    setCart(updatedCart);
    alert(`${product.Productname} has been added to the cart.`);
  };

  // Function to handle buying the product directly
  const buyNow = (product) => {
    if (localStorage.getItem("authToken")) {
      let _buyitem = {};
      _buyitem.item = {
        [product._id]: 1,
      };
      setbuyitem(_buyitem);
      navigate("/buypage");
    } else {
      navigate("/");
    }
  };

  return (
    <>
      <section>
        {/* Carousel Section */}
        <div
          id="carouselExampleCaptions"
          className="carousel slide"
          data-bs-ride="carousel"
        >
          <div className="carousel-indicators">
            <button
              type="button"
              data-bs-target="#carouselExampleCaptions"
              data-bs-slide-to="0"
              className="active"
              aria-current="true"
              aria-label="Slide 1"
            ></button>
            <button
              type="button"
              data-bs-target="#carouselExampleCaptions"
              data-bs-slide-to="1"
              aria-label="Slide 2"
            ></button>
            <button
              type="button"
              data-bs-target="#carouselExampleCaptions"
              data-bs-slide-to="2"
              aria-label="Slide 3"
            ></button>
          </div>
          <div className="carousel-inner">
            <div className="carousel-item active">
              <img
                src="/19238.jpg"
                className="d-block w-100 image-darken"
                alt="First slide"
              />
              <div className="carousel-caption">
                <h5>Welcome to Our Inventory System</h5>
                <p>
                  Efficiently manage your inventory with our top-notch
                  solutions.
                </p>
              </div>
            </div>
            <div className="carousel-item">
              <img
                src="/still-life-supply-chain-representation.jpg"
                className="d-block w-100 image-darken"
                alt="Second slide"
              />
              <div className="carousel-caption">
                <h5>Streamline Your Operations</h5>
                <p>
                  Reduce waste and maximize productivity with our innovative
                  tools.
                </p>
              </div>
            </div>
            <div className="carousel-item">
              <img
                src="/3rdsldie.jpg"
                className="d-block w-100 image-darken"
                alt="Third slide"
              />
              <div className="carousel-caption">
                <h5>Trusted Partner in Inventory Management</h5>
                <p>
                  Join countless businesses who trust us for their inventory
                  needs.
                </p>
              </div>
            </div>
          </div>
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#carouselExampleCaptions"
            data-bs-slide="prev"
          >
            <span
              className="carousel-control-prev-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#carouselExampleCaptions"
            data-bs-slide="next"
          >
            <span
              className="carousel-control-next-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </section>

      {/* Top Product List Section */}
      <div className="container-fluid">
        <section className="product text-center p-4">
          <h2 className="mb-4">Top Products</h2>

          {/* Short Description About the Top Products */}
          <p className="text-muted mb-4">
            Explore our top-selling products that offer great value, quality,
            and innovation. Each product is carefully crafted to meet your
            needs.
          </p>

          {/* Slider Buttons */}
          <div className="d-flex justify-content-center mb-4">
            <button
              className="btn btn-primary btn-lg"
              type="button"
              data-bs-target="#cardCarousel"
              data-bs-slide="prev"
            >
              <i className="bi bi-arrow-left-circle"></i> Previous
            </button>
            <button
              className="btn btn-primary btn-lg ms-3"
              type="button"
              data-bs-target="#cardCarousel"
              data-bs-slide="next"
            >
              Next <i className="bi bi-arrow-right-circle"></i>
            </button>
          </div>

          {/* Carousel for Top Products */}
          <div
            id="cardCarousel"
            className="carousel slide"
            data-bs-ride="carousel"
          >
            <div className="carousel-inner">
              {/* Dynamically render carousel items */}
              {productChunks.length === 0 ? (
                <div className="carousel-item active">
                  <p>No products available.</p>
                </div>
              ) : (
                productChunks.map((chunk, index) => (
                  <div
                    className={`carousel-item ${index === 0 ? "active" : ""}`}
                    key={`carousel-item-${index}`} // Unique key for each carousel item
                  >
                    <div className="row justify-content-center">
                      {chunk.map((product) => (
                        <div className="col-md-3 mb-4" key={product._id}>
                          {" "}
                          {/* Using _id as a unique key */}
                          <div className="card border-0 rounded">
                            <Link to={`/productpage/${product._id}`}>
                              <img
                                src={product.Images}
                                className="card-img-top"
                                alt={product.name}
                                style={{ height: "250px", objectFit: "cover" }}
                              />
                            </Link>

                            <div className="card-body">
                              <h5 className="card-title">
                                {product.Productname}
                              </h5>
                              <p className="card-text">{product.Description}</p>
                              <p className="card-text">
                                <strong>Price: ${product.Price}</strong>
                              </p>
                              <div className="d-flex justify-content-center">
                                {/* Add to Cart Icon */}
                                <button
                                  className="btn btn-outline-primary me-5"
                                  onClick={() => addToCart(product)}
                                  aria-label="Add to Cart"
                                >
                                  <i className="bi bi-cart-plus"></i>{" "}
                                  {/* Cart icon */}
                                </button>
                                {/* Buy Now Icon */}
                                <button
                                  className="btn btn-outline-danger"
                                  onClick={() => buyNow(product)}
                                  aria-label="Buy Now"
                                >
                                  <i className="bi bi-cart-check"></i>{" "}
                                  {/* Buy icon */}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </div>
      {/* create a card flip section according to category wise  */}
      <h2 className="text-center mb-4">Shop by Category</h2>
      <FlipCardSection />
    </>
  );
};

export default HomePage;
