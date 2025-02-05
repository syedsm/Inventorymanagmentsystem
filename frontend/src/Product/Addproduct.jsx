import { useState, useRef } from "react";
import "./products.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

function AddProduct() {
  const [images, setImages] = useState([]);
  const [fields, setFields] = useState([]);
  // const [showImageUpload, setShowImageUpload] = useState(false); // Control conditional rendering
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    category: "",
    Productname: "",
    price: "",
    description: "",
    status: "",
    quantity: "",
    expirationDate: "",
    weight: "",
    brand: "",
    warranty: "",
    material: "",
    dimensions: "",
  });

  const allowedFields = {
    groceries: [
      "ProductName",
      "Price",
      "Description",
      "ExpirationDate",
      "Weight",
      "Status",
      "Quantity",
      "Brand",
    ],
    electronics: [
      "ProductName",
      "Price",
      "Description",
      "Warranty",
      "Status",
      "Quantity",
      "Brand",
    ],
    furniture: [
      "ProductName",
      "Price",
      "Description",
      "Material",
      "Dimensions",
      "Status",
      "Quantity",
      "Brand",
    ],
    clothing: [
      "ProductName",
      "Price",
      "Description",
      "Material",
      "Brand",
      "Status",
      "Quantity",
    ],
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    console.log("selectedCategory", selectedCategory);
    setFormData((prev) => ({ ...prev, category: selectedCategory }));
    // setShowImageUpload(!!value); // Show image upload if category is selected

    if (selectedCategory === "") {
      // formData.category("");
      // setFormData({}); // Reset the form data
      setFields([]); // Clear fields if no category selected
    } else {
      const newFields = allowedFields[selectedCategory] || [];
      setFields(newFields);
    }
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length + images.length <= 4) {
      const imagePreviews = selectedFiles.map((file) =>
        URL.createObjectURL(file)
      );
      setImages((prevImages) => [...prevImages, ...imagePreviews]);
    } else {
      alert("You can only upload up to 4 images.");
    }
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleRemoveImage = (indexToRemove) => {
    const updatedImages = [...images];
    updatedImages.splice(indexToRemove, 1);
    setImages(updatedImages);
  };

  const validateForm = () => {
    let isValid = true;
    if (images.length === 0) {
      toast.error("Please upload at least one image.");
      isValid = false;
    }
    fields.forEach((field) => {
      const value = formData[field];
      // Check if field is empty
      if (!value) {
        toast.error(`${field} is required.`);
        isValid = false;
        return;
      }
      // Specific validations for certain fields
      if (field === "Price" || field === "Quantity" || field === "Weight") {
        if (isNaN(value)) {
          toast.error(`${field} must be a numeric value.`);
          isValid = false;
        } else if (parseFloat(value) <= 0) {
          toast.error(`${field} must be greater than zero.`);
          isValid = false;
        }
      } else if (field === "ExpirationDate") {
        const today = new Date().toISOString().split("T")[0];
        if (value < today) {
          toast.error("Expiration date must be in the future.");
          isValid = false;
        }
      } else if (field === "Description") {
        if (value.trim().length < 10) {
          toast.error("Description must be at least 10 characters long.");
          isValid = false;
        }
      } else if (field === "Brand") {
        const textRegex = /^[a-zA-Z\s]+$/; // Matches only letters and spaces
        if (!textRegex.test(value)) {
          toast.error("Brand must contain only letters and spaces.");
          isValid = false;
        }
      }
    });

    return isValid;
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   // console.log("Data Received", formData);
  //   try {
  //     if (validateForm()) {
  //       // toast.success("Form Validate Suuccessfully");
  //       // console.log("FormData before sending:", formData);
  //       // console.log("Selected images:", images);

  //       // Create a new FormData instance

  //       const formDataToSend = new FormData();
  //       formDataToSend.append("category", formData.category);
  //       // Append filtered fields to FormData
  //       Object.entries(formData).forEach(([key, value]) => {
  //         if (fields.includes(key) && value) {
  //           formDataToSend.append(key, value);
  //         }
  //       });
  //       // Append images to FormData
  //       Array.from(fileInputRef.current.files).forEach((file) => {
  //         formDataToSend.append("images", file);
  //       });

  //       // Debugging: Log FormData key-value pairs
  //       // console.log("Final FormData:");
  //       // for (let pair of formDataToSend.entries()) {
  //       //   console.log(pair[0], pair[1]);
  //       // }

  //       const token = localStorage.getItem("authToken");
  //       const res = await axios.post(
  //         "/api/product/addproduct",
  //         formDataToSend,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //           },
  //         }
  //       );

  //       // Handle server response
  //       if (res.status === 201) {
  //         // Reset form data and images
  //         setFormData((prev) => ({
  //           ...prev,
  //           category: formDataToSend.category, // Reset category to default or empty state
  //         }));
  //         fileInputRef.current.value = null; // Clear file input
  //           setImages([])
  //         // formData.category(formData);
  //         console.log("FormData",formData);
  //         toast.success("Product added successfully!");
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Error submitting form:", error);

  //     // Check if the error is due to duplicate product name
  //     if (
  //       error.response &&
  //       error.response.data.error === "Product name already exists"
  //     ) {
  //       toast.error(
  //         "Product name already exists. Please choose a different name."
  //       );
  //     } else {
  //       toast.error("Failed to add product. Please try again.");
  //     }
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      localStorage.getItem("userRole") == "admin" ||
      localStorage.getItem("userRole") == "staff"
    ) {
      return toast.error("You are not authorized to add product");
    }
    try {
      if (validateForm()) {
        const formDataToSend = new FormData();
        formDataToSend.append("category", formData.category);

        // Append filtered fields to FormData
        Object.entries(formData).forEach(([key, value]) => {
          if (fields.includes(key) && value) {
            formDataToSend.append(key, value);
          }
        });

        // Append images to FormData
        Array.from(fileInputRef.current.files).forEach((file) => {
          formDataToSend.append("images", file);
        });

        const token = localStorage.getItem("authToken");
        const res = await axios.post(
          "/api/product/addproduct",
          formDataToSend,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.status === 201) {
          toast.success("Product added successfully!");

          // Reset form data and fields

          setFormData({
            category: formData.category,
            Productname: "",
            price: "",
            description: "",
            status: "",
            quantity: "",
            expirationDate: "",
            weight: "",
            brand: "",
            warranty: "",
            material: "",
            dimensions: "",
          });

          // Clear file input and images
          fileInputRef.current.value = null;
          setImages([]);
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);

      if (
        error.response &&
        error.response.data.error === "Product name already exists"
      ) {
        toast.error(
          "Product name already exists. Please choose a different name."
        );
      } else {
        toast.error("Failed to add product. Please try again.");
      }
    }
  };

  return (
    <div className="container-fluid" style={{ marginTop: "100px" }}>
      <div className="shadow-lg p-5 border-0 rounded-4">
        <h2 className="text-center mb-4">Add New Product</h2>
        <form
        // onSubmit={handleSubmit}
        >
          <div className="mb-4">
            <label className="form-label">Category :</label>
            <select
              onChange={handleCategoryChange}
              id="category"
              className="form-select"
              value={formData.category}
            >
              <option value="">Select Category</option>
              <option value="groceries">Groceries</option>
              <option value="electronics">Electronics</option>
              <option value="furniture">Furniture</option>
              <option value="clothing">Clothing</option>
            </select>
          </div>
          <div className="row">
            {fields.map((field, index) => (
              <div className="col-md-6 mb-4" key={index}>
                <label className="form-label">{field} :</label>
                {field === "Status" ? (
                  // Dropdown for Status
                  <select
                    id={field}
                    className="form-select"
                    value={formData[field] || ""}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Status</option>
                    <option value="IN-STOCK">In-Stock</option>
                    <option value="OUT-OF-STOCK">Out-Stock</option>
                  </select>
                ) : field === "ExpirationDate" ? (
                  // Date Picker for Expiration Date
                  <input
                    type="date"
                    id={field}
                    className="form-control"
                    value={formData[field] || ""}
                    onChange={handleInputChange}
                  />
                ) : field === "Description" ? (
                  // Text Area for Description
                  <textarea
                    id={field}
                    className="form-control"
                    placeholder={`Enter ${field}`}
                    value={formData[field] || ""}
                    onChange={handleInputChange}
                  />
                ) : (
                  // Default Text Input
                  <input
                    type="text"
                    id={field}
                    className="form-control"
                    placeholder={`Enter ${field}`}
                    value={formData[field] || ""}
                    onChange={handleInputChange}
                  />
                )}
              </div>
            ))}
          </div>
          {formData.category && (
            <>
              {/* Upload Product Images */}
              <div className="row">
                <div className="col-md-12 mb-4">
                  <label htmlFor="imageUpload" className="form-label">
                    Upload Product Images (up to 4)
                  </label>
                  {/* Styled upload box */}
                  <div className="upload-box" onClick={handleClick}>
                    <img
                      src="./upload_icon.png"
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
                  {/* Image Previews */}
                  <div className="image-previews mt-3 d-flex flex-wrap">
                    {images.map((image, index) => (
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
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
          {formData.category == "" ? (
            ""
          ) : (
            <button
              type="submit"
              className="btn btn-success"
              onClick={handleSubmit}
            >
              Submit
            </button>
          )}
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}

export default AddProduct;
{/* <form onSubmit={handlesubmit}> */}
{/* Category Selection */}
{/* <div className="mb-4">
  <label className="form-label">Category</label>
  <select
    id="category"
    name="category"
    className="form-select"
    onChange={handleInputChange}
  >
    <option value="">Select Category</option>
    <option value="groceries">Groceries</option>
    <option value="electronics">Electronics</option>
    <option value="furniture">Furniture</option>
    <option value="clothing">Clothing</option>
  </select>
</div> */}

{/* General Product Information */}
{/* <div className="row">
  <div className="col-md-6 mb-4">
    <label className="form-label">Product Name</label>
    <input
      type="text"
      className="form-control"
      id="productName"
      placeholder="Enter product name"
      required
      // value={formData.productName}
      onChange={handleInputChange}
    />
  </div>
  <div className="col-md-6 mb-4">
    <label htmlFor="price" className="form-label">
      Price
    </label>
    <input
      type="text"
      className="form-control"
      id="price"
      placeholder="Enter price"
      required
      inputMode="numeric" // Shows numeric keypad on mobile devices
      pattern="^[0-9]*$" // Allows only numbers (positive integers)
      title="Please enter an integer value"
      onInput={(e) => {
        e.target.value = e.target.value.replace(/[^0-9]/g, ""); // Removes any non-numeric characters
      }}
      // value={formData.price}
      onChange={handleInputChange}
    />
  </div>
</div> */}

{/* Category-Specific Fields */}
// {formData.category === "groceries" && (
//   <>
//     <div className="row">
//       <div className="col-md-6 mb-4">
//         <div className="mb-4">
//           <label htmlFor="brand" className="form-label">
//             Brand
//           </label>
//           <input
//             type="string"
//             className="form-control"
//             id="brand"
//             placeholder="Enter brand name"
//             onChange={handleInputChange}
//             value={formData.brand}
//           />
//         </div>
//       </div>
//       <div className="col-md-6 mb-4">
//         <div className="mb-4">
//           <label htmlFor="expirationDate" className="form-label">
//             Expiration Date
//           </label>
//           <input
//             type="date"
//             className="form-control"
//             id="expirationDate"
//           />
//         </div>
//       </div>
//       <div className="col-md-6 mb-4">
//         <div className="mb-4">
//           <label htmlFor="weight" className="form-label">
//             Weight (kg)
//           </label>
//           <input
//             type="number"
//             className="form-control"
//             id="weight"
//             placeholder="Enter weight"
//             onChange={handleInputChange}
//           />
//         </div>
//       </div>
//     </div>
//   </>
// )}

// {formData.category === "electronics" && (
//   <>
//     <div className="row">
//       <div className="col-md-6 mb-4">
//         <div className="mb-4">
//           <label htmlFor="brand" className="form-label">
//             Brand
//           </label>
//           <input
//             type="string"
//             className="form-control"
//             id="brand"
//             placeholder="Enter brand name"
//             onChange={handleInputChange}
//             value={formData.brand}
//           />
//         </div>
//       </div>
//       <div className="col-md-6 mb-4">
//         <div className="mb-4">
//           <label htmlFor="warranty" className="form-label">
//             Warranty (months)
//           </label>
//           <input
//             type="number"
//             className="form-control"
//             id="warranty"
//             placeholder="Enter warranty period"
//             onChange={handleInputChange}
//           />
//         </div>
//       </div>
//     </div>
//   </>
// )}

// {formData.category === "furniture" && (
//   <>
//     <div className="row">
//       <div className="col-md-6 mb-4">
//         <div className="mb-4">
//           <label htmlFor="brand" className="form-label">
//             Brand
//           </label>
//           <input
//             type="string"
//             className="form-control"
//             id="brand"
//             placeholder="Enter brand name"
//             onChange={handleInputChange}
//             value={formData.brand}
//           />
//         </div>
//       </div>
//       <div className="col-md-6 mb-4">
//         <div className="mb-4">
//           <label htmlFor="material" className="form-label">
//             Material
//           </label>
//           <input
//             type="text"
//             className="form-control"
//             id="material"
//             placeholder="Enter material name"
//             onChange={handleInputChange}
//           />
//         </div>
//       </div>
//       <div className="col-md-6 mb-4">
//         <div className="mb-4">
//           <label htmlFor="dimensions" className="form-label">
//             Dimensions
//           </label>
//           <input
//             type="number"
//             className="form-control"
//             id="dimensions"
//             placeholder="Enter dimensions"
//             onChange={handleInputChange}
//           />
//         </div>
//       </div>
//     </div>
//   </>
// )}

// {formData.category === "clothing" && (
//   <>
//     <div className="row">
//       <div className="col-md-6 mb-4">
//         <div className="mb-4">
//           <label htmlFor="brand" className="form-label">
//             Brand
//           </label>
//           <input
//             type="string"
//             className="form-control"
//             id="brand"
//             placeholder="Enter brand name"
//             onChange={handleInputChange}
//             value={formData.brand}
//           />
//         </div>
//       </div>
//       <div className="col-md-6 mb-4">
//         <div className="mb-4">
//           <label htmlFor="material" className="form-label">
//             Material
//           </label>
//           <input
//             type="text"
//             className="form-control"
//             id="material"
//             placeholder="Enter material name"
//             onChange={handleInputChange}
//           />
//         </div>
//       </div>
//     </div>
//   </>
// )}

{/* Description */}
{/* <div className="mb-4">
  <label htmlFor="description" className="form-label">
    Description
  </label>
  <textarea
    className="form-control"
    id="description"
    rows="3"
    placeholder="Enter product description"
    // value={formData.description}
    onChange={handleInputChange}
  ></textarea>
</div> */}

{/*Status & Qauntity*/}
{/* <div className="row">
  <div className="col-md-6 mb-4">
    <div className="mb-4">
      <label htmlFor="status" className="form-label">
        Status
      </label>
      <select
        name="value"
        id="value"
        className="form-select"
        onChange={handleInputChange}
      >
        <option>Select Status</option>
        <option value="IN">IN-STOCK</option>
        <option value="OUT">OUT-OF-STOCK</option>
      </select>
    </div>
  </div>
  {/* Quantity and Image Upload */}
  // <div className="col-md-6 mb-4">
  //   <label htmlFor="quantity" className="form-label">
  //     Quantity
  //   </label>
  //   <input
  //     type="text"
  //     className="form-control"
  //     id="quantity"
  //     placeholder="Enter Quantity"
  //     required
  //     inputMode="numeric" // Shows numeric keypad on mobile devices
  //     pattern="^[0-9]*$" // Allows only numbers (positive integers)
  //     title="Please enter an integer value"
  //     onInput={(e) => {
  //       e.target.value = e.target.value.replace(/[^0-9]/g, ""); // Removes any non-numeric characters
  //     }}
  //     // value={formData.quantity}
  //     onChange={handleInputChange}
  //   />
  // </div>
// </div> */}

{/* Upload Product Images */}
{/* <div className="row">
  <div className="col-md-12 mb-4">
    <label htmlFor="imageUpload" className="form-label">
      Upload Product Images (up to 4)
    </label>
    {/* Styled upload box */}
    // <div className="upload-box" onClick={handleClick}>
    //   <img
    //     src="./upload_icon.png"
    //     alt="Upload Icon"
    //     className="upload-icon"
    //   />
    //   <input
    //     type="file"
    //     id="imageUpload"
    //     ref={fileInputRef}
    //     onChange={handleFileChange}
    //     multiple
    //     accept="image/*"
    //     style={{ display: "none" }}
    //   />
    // </div>
    {/* Image Previews */}
    // <div className="image-previews mt-3 d-flex flex-wrap">
    //   {images.map((image, index) => (
    //     <div
    //       key={index}
    //       className="img m-2"
    //       style={{ position: "relative", display: "inline-block" }}
    //     >
    //       {/* Image Preview */}
    //       <img
    //         src={image}
    //         alt={`Preview ${index + 1}`}
    //         className="preview-image"
    //         style={{
    //           width: "100px",
    //           height: "100px",
    //           objectFit: "cover",
    //           borderRadius: "8px",
    //         }}
    //       />

    //       {/* Remove Button */}
    //       <button
    //         className="btn btn-danger btn-sm"
    //         style={{
    //           position: "absolute",
    //           top: "-5px",
    //           right: "-5px",
    //           borderRadius: "50%",
    //         }}
    //         onClick={() => handleRemoveImage(index)}
    //       >
    //         &times;
    //       </button>
    //     </div>
    //   ))}
    // </div>
//   </div>
// </div> */}

{/* Submit Button */}
{/* <div className="d-flex justify-content-center">
  <button type="submit" className="btn btn-primary btn-lg w-50">
    Add Product
  </button>
</div>
</form> */}
