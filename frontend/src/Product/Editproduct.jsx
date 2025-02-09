import { useEffect, useRef, useState } from "react";
import {
  useNavigate,
  useParams,
  //  useNavigate
} from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

function Editproduct() {
  const { id } = useParams();
  const [form, setForm] = useState([]);

  const fileInputRef = useRef(null);
  const [newImages, setNewImages] = useState([]);
  const navigate = useNavigate();

  // Fetch product details
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    axios
      .get(`https://inventorymanagmentsystembackend.onrender.com/api/product/singleproductfetch/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("Data received", res);
        if (res.status === 200) {
          if (
            res.data.data.Groceriesdetails &&
            res.data.data.Groceriesdetails.Expirationdate
          ) {
            res.data.data.Groceriesdetails.Expirationdate = new Date(
              res.data.data.Groceriesdetails.Expirationdate
            )
              .toISOString()
              .split("T")[0]; // Format to YYYY-MM-DD
          }
          setForm(res.data.data);
        }
      })
      .catch((err) => {
        console.error("Error fetching product:", err);
        toast.error("Error fetching product details.");
      });
  }, [id]);

  // const handleRemoveImage = (indexToRemove) => {
  //   const updatedImages = [...form.Images];
  //   updatedImages.splice(indexToRemove, 1);
  //   setForm(...form, updatedImages);
  // };

  // Handle form changes
  // const handleChange = (field, value) => {
  //   setForm((prev) => ({
  //     ...prev,
  //     [field]: value,
  //   }));
  // };

  const handleChange = (field, value) => {
    if (field.includes(".")) {
      const [mainKey, subKey] = field.split(".");
      setForm((prev) => ({
        ...prev,
        [mainKey]: {
          ...prev[mainKey],
          [subKey]: value,
        },
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    setNewImages((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    // console.log("files arived", files);
    if (selectedFiles.length + newImages.length <= 4) {
      const filePreviews = selectedFiles.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));
      setNewImages((prev) => [...prev, ...filePreviews]);
    } else {
      alert("You can only upload up to 4 images.");
    }
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    // console.log("Updated Data Received", form);
    // console.log("New Images Arrives", newImages);

    // Create FormData object
    const updatedform = new FormData();
    updatedform.append("Productname", form.Productname);
    updatedform.append("Brand", form.Brand);
    updatedform.append("Price", form.Price);
    updatedform.append("Quantity", form.Quantity);
    updatedform.append("Category", form.Category);
    updatedform.append("Stockstatus", form.Stockstatus);
    updatedform.append("Description", form.Description);

    if (form.Category === "groceries") {
      updatedform.append(
        "Expirationdate",
        form.Groceriesdetails?.Expirationdate || ""
      );
      updatedform.append("Weight", form.Groceriesdetails?.weight || "");
    }
    if (form.Category === "electronics") {
      updatedform.append("Warranty", form.Electronicsdetails?.Warranty || "");
    }
    if (form.Category === "furniture") {
      updatedform.append("Dimensions", form.Furnituredetails?.Dimensions || "");
      updatedform.append(
        "FurnitureMaterial",
        form.Furnituredetails?.Material || ""
      );
    }
    if (form.Category === "clothing") {
      updatedform.append(
        "ClothingeMaterial",
        form.Clothingedetails?.Material || ""
      );
    }

    // Attach files from newImages
    newImages.forEach((imageObj) => {
      updatedform.append(`Images`, imageObj.file);
    });

    // console.log("Data sent to backend", updatedform);
    // Debugging: Log FormData key-value pairs
    // console.log("Final FormData:");
    // for (let pair of updatedform.entries()) {
    //   console.log(pair[0], pair[1]);
    // }

    // Send data to backend

    const token = localStorage.getItem("authToken");
    axios
      .put(`https://inventorymanagmentsystembackend.onrender.com/api/product/singleproductupdate/${id}`, updatedform, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log("Response from backend:", response);
        if (response.status === 200) {
          toast.success(response.data.message, {
            onClose: () => navigate("/updateproduct"),
          });
        }
      })
      .catch((error) => {
        console.error("Error updating product:", error);
        toast.error("Failed to update product. Please try again.");
      });
  };

  return (
    <div className="container-fluid" style={{ marginTop: "100px" }}>
      <h1 className="text-center mb-4">Edit Product</h1>
      <div className="row">
        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label">Product Name</label>
            <input
              type="text"
              className="form-control"
              value={form.Productname}
              onChange={(e) => handleChange("Productname", e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label">Brand</label>
            <input
              type="text"
              className="form-control"
              value={form.Brand}
              onChange={(e) => handleChange("Brand", e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label">Price</label>
            <input
              type="number"
              className="form-control"
              value={form.Price}
              onChange={(e) => handleChange("Price", e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label">Quantity</label>
            <input
              type="number"
              className="form-control"
              value={form.Quantity || ""}
              onChange={(e) => handleChange("Quantity", e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label">Category</label>
            <input
              readOnly
              type="text"
              className="form-control"
              value={form.Category || ""}
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label">Stock Status</label>
            <select
              className="form-select"
              value={form.Stockstatus}
              onChange={(e) => handleChange("Stockstatus", e.target.value)}
            >
              <option value="IN-STOCK">In Stock</option>
              <option value="OUT-STOCK">Out of Stock</option>
            </select>
          </div>
        </div>
      </div>
      <div className="mb-3">
        <label className="form-label">Description</label>
        <textarea
          className="form-control"
          rows="4"
          value={form.Description}
          onChange={(e) => handleChange("Description", e.target.value)}
        />
      </div>

      {/* Category-specific Fields */}
      {form.Category === "electronics" && (
        <div className="mb-3">
          <label className="form-label">Warranty Period</label>
          <input
            type="text"
            className="form-control"
            value={form.Electronicsdetails?.Warranty || ""}
            onChange={(e) =>
              handleChange("Electronicsdetails.Warranty", e.target.value)
            }
          />
        </div>
      )}
      {form.Category === "groceries" && (
        <>
          <div className="mb-3">
            <label className="form-label">Expiry Date</label>
            <input
              type="date"
              className="form-control"
              value={form.Groceriesdetails?.Expirationdate || ""}
              onChange={(e) =>
                handleChange("Groceriesdetails.Expirationdate", e.target.value)
              }
            />
          </div>
          <div className="mb-3">
            <label className="form-label">weight</label>
            <input
              type="number"
              className="form-control"
              value={form.Groceriesdetails?.weight || ""}
              onChange={(e) =>
                handleChange("Groceriesdetails.weight", e.target.value)
              }
            />
          </div>
        </>
      )}
      {form.Category === "furniture" && (
        <>
          <div className="mb-3">
            <label className="form-label">Dimensions</label>
            <input
              type="text"
              className="form-control"
              value={form.Furnituredetails?.Dimensions || ""}
              onChange={(e) =>
                handleChange("Furnituredetails.Dimensions", e.target.value)
              }
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Material</label>
            <input
              type="text"
              className="form-control"
              value={form.Furnituredetails?.Material || ""}
              onChange={(e) =>
                handleChange("Furnituredetails.Material", e.target.value)
              }
            />
          </div>
        </>
      )}
      {form.Category === "clothing" && (
        <>
          <div className="mb-3">
            <label className="form-label">Material</label>
            <input
              type="text"
              className="form-control"
              value={form.Clothingedetails?.Material || ""}
              onChange={(e) =>
                handleChange("Clothingedetails.Material", e.target.value)
              }
            />
          </div>
        </>
      )}

      {/* Upload Product Images */}
      <div className="row">
        <div className="col-md-12 mb-4">
          <label htmlFor="imageUpload" className="form-label">
            Upload Product Images (up to 4)
          </label>
          {/* Styled upload box */}
          <div className="upload-box" onClick={handleClick}>
            <img
              src="/upload_icon.png"
              alt="Upload Icon"
              className="upload-icon"
            />
            <input
              type="file"
              id="imageUpload"
              ref={fileInputRef}
              onChange={handleFileChange}
              multiple
              accept="image/*"
              style={{ display: "none" }}
            />
          </div>
          {/* Upload Preview Product Images */}
          <p className=" mt-3 mb-2 text-center">Existing Images</p>
          <div className="image-previews mt-3 d-flex flex-wrap">
            {form.Images && form.Images.length > 0 ? (
              form.Images.map((image, index) => (
                <div
                  key={index}
                  className="img m-2"
                  style={{
                    position: "relative",
                    display: "inline-block",
                  }}
                >
                  {/* Image Preview */}
                  <img
                    src={image}
                    alt={`Preview ${index + 1}`}
                    className="preview-image"
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />
                </div>
              ))
            ) : (
              <p>No images uploaded.</p>
            )}
          </div>

          <p className=" mt-3 mb-2 text-center">Uploded Preview Images</p>
          <div className="image-previews mt-3 d-flex flex-wrap">
            {newImages && newImages.length > 0 ? (
              newImages.map((image, index) => (
                <div
                  key={index}
                  className="img m-2"
                  style={{
                    position: "relative",
                    display: "inline-block",
                  }}
                >
                  {/* Image Preview */}
                  <img
                    src={image.preview}
                    alt={`Preview ${index + 1}`}
                    className="preview-image"
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />
                  {/* Remove Button */}
                  <button
                    className="btn btn-danger btn-sm"
                    style={{
                      position: "absolute",
                      top: "-5px",
                      right: "-5px",
                      borderRadius: "50%",
                    }}
                    onClick={() => handleRemoveImage(index)}
                  >
                    &times;
                  </button>
                </div>
              ))
            ) : (
              <p>No images uploaded.</p>
            )}
          </div>
        </div>
      </div>

      <button className="btn btn-primary" onClick={handleUpdate}>
        Update
      </button>
      <ToastContainer />
    </div>
  );
}

export default Editproduct;
