import axios from "axios";
import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Productupdate = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const Navigate = useNavigate();

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get("/api/product/fetchproduct", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(response.data.data);
        setProducts(response.data.data);

        const uniqueCategories = [
          ...new Set(response.data.data.map((item) => item.Category)),
        ];
        setCategories(uniqueCategories);
      } catch (err) {
        console.error("Error fetching data:", err);
        toast.error("Unable to fetch products. Please try again later.");
      }
    };
    fetchData();
  }, []);

  // Handle category selection
  useEffect(() => {
    if (selectedCategory) {
      const filtered = products.filter(
        (product) => product.Category === selectedCategory
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [selectedCategory, products]);

// {handleDelete product}
  const handleDelete = (productId) => {
    if (localStorage.getItem("userRole") == "staff") {
      return toast.error("You are not authorized to delete products");
    } else {
      window.confirm("Are you sure you want to delete this product?");
    }
    const token = localStorage.getItem("authToken");
    axios
      .delete(`/api/product/deleteproduct/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.status === 200) {
          toast.success("Product deleted successfully!", {
            onClose: () =>
              setProducts(
                products.filter((product) => product._id !== productId)
              ),
          });
        } else {
          toast.error(res.error);
        }
      })
      .catch((err) => {
        console.error("Error deleting product:", err);
        toast.error("Error deleting product.");
      });
  };

// handleEdit product
  const handleEdit = (productId) => {
    if (
      localStorage.getItem("userRole") == "staff" ||
      localStorage.getItem("userRole") == "admin"
    ) {
      return toast.error("You are not authorized to edit products");
    }
    Navigate(`/editproduct/${productId}`);
  };
  return (
    <div className="container-fluid " style={{ marginTop: "100px" }}>
      <h1 className="text-center mb-4">Product List</h1>

      {/* Category Selector */}
      <div className="row mb-3">
        <div className="col-md-6 offset-md-3">
          <label htmlFor="category" className="form-label fw-bold">
            Filter by Category :
          </label>
          <select
            id="category"
            className="form-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Product Table */}
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Product Name</th>
              <th>Brand</th>
              <th>Category</th>
              <th>Description</th>
              {selectedCategory === "groceries" && <th>Groceries Details</th>}
              {selectedCategory === "clothing" && <th>Clothing Details</th>}
              {selectedCategory === "furniture" && <th>Furniture Details</th>}
              {selectedCategory === "electronics" && (
                <th>Electronics Details</th>
              )}
              <th>Images</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Stock Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product, index) => (
              <tr key={product.id || index}>
                <td>{index + 1}</td>
                <td>{product.Productname}</td>
                <td>{product.Brand}</td>
                <td>{product.Category}</td>
                <td className="text-truncate" style={{ maxWidth: "150px" }}>
                  {product.Description}
                </td>
                {selectedCategory === "groceries" && (
                  <td>
                    {product.Groceriesdetails
                      ? `Weight: ${
                          product.Groceriesdetails.weight
                        }, Expiry: ${new Date(
                          product.Groceriesdetails.Expirationdate
                        ).toLocaleDateString()}`
                      : "N/A"}
                  </td>
                )}
                {selectedCategory === "electronics" && (
                  <td>
                    {product.Electronicsdetails
                      ? `Warranty: ${product.Electronicsdetails.Warranty}`
                      : "N/A"}
                  </td>
                )}
                {selectedCategory === "clothing" && (
                  <td>
                    {product.Clothingedetails
                      ? `Material: ${product.Clothingedetails.Material}`
                      : "N/A"}
                  </td>
                )}
                {selectedCategory === "furniture" && (
                  <td>
                    {product.Furnituredetails
                      ? `Material: ${product.Furnituredetails.Material} , Dimensions: ${product.Furnituredetails.Dimensions}`
                      : "N/A"}
                  </td>
                )}
                <td>
                  {product.Images && product.Images.length > 0 && (
                    <img
                      src={`${product.Images[0]}`}
                      alt={`Product`}
                      style={{
                        width: "50px",
                        height: "50px",
                        objectFit: "cover",
                        marginRight: "5px",
                        borderRadius: "5px",
                        border: "1px solid #ddd",
                      }}
                    />
                  )}
                </td>

                <td>${product.Price}</td>
                <td>{product.Quantity}</td>
                <td>
                  <span
                    className={`badge ${
                      product.Stockstatus === "IN-STOCK"
                        ? "bg-success"
                        : "bg-danger"
                    }`}
                  >
                    {product.Stockstatus}
                  </span>
                </td>
                <td>
                  {/* Edit and Delete Buttons */}
                  <button
                    // to={`/editproduct/${product._id}`}
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => handleEdit(product._id)}
                  >
                    <i className="bi bi-pencil-fill"></i>
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(product._id)}
                  >
                    <i className="bi bi-trash3"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* No Products Message */}
      {filteredProducts.length === 0 && (
        <div className="text-center mt-4">
          <h5>No products found for the selected category.</h5>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default Productupdate;
