import { useContext, useEffect, useState } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import { ToastContainer, toast } from "react-toastify";
import { Contextapi } from "./contexts/Authcontext";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import axios from "axios";
// Register necessary components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

const Dashboard = () => {
  const { loginpopup, setloginpopup } = useContext(Contextapi);
  const [totalStock, setTotalStock] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [products, setProducts] = useState([{}]);

  useEffect(() => {
    // console.log("Loginpopup", loginpopup);
    if (loginpopup === "true") {
      toast.success("Welcome to the dashboard!");
      localStorage.setItem("showLoginPopup", "false");
      setloginpopup("false");
    }
  }, [loginpopup, setloginpopup]);

  useEffect(() => {
    // Fetch total stock and total customers from the backend
    const fetchData = async () => {
      try {
        const response = await axios.get("https://inventorymanagmentsystembackend.onrender.com/api/admin/admin-dashboard", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });

        // console.log("response", response);

        setTotalStock(response.data.totalstock);
        setTotalCustomers(response.data.totleUsers);

        // Transform categoryStockLevels into an array for easier mapping
        const categoryStock = Object.entries(
          response.data.categoryStockLevels
        ).map(([category, stockData]) => ({
          name: category,
          inStock: stockData.inStock,
          outOfStock: stockData.outOfStock,
        }));
        // console.log(categoryStock);
        setProducts(categoryStock);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchData();
  }, []);

  const salesData = {
    2022: [30, 20, 50, 40, 70, 60, 80, 90, 100, 120, 130, 150],
    2023: [40, 30, 60, 50, 80, 70, 90, 100, 110, 130, 140, 160],
  };

  const years = Object.keys(salesData);

  const monthlyLabels = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const [selectedYear, setSelectedYear] = useState(years[0]);

  const currentYearData = salesData[selectedYear];
  const barData = {
    labels: monthlyLabels,
    datasets: [
      {
        label: `Sales ${selectedYear}`,
        data: currentYearData,
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 3000,
      easing: "easeInOutQuart",
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(200, 200, 200, 0.3)",
        },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 3000,
      easing: "easeInOutQuart",
    },
  };

  const totalSales = currentYearData.reduce((acc, sale) => acc + sale, 0);

  return (
    <>
      <div className="container-fluid" style={{ marginTop: "100px" }}>
        <div className="row">
          <div className="col-md-10" style={{ padding: "20px" }}>
            <div className="container-overview">
              <h1>Inventory and Sales Overview</h1>
              <div className="stats-container">
                <div className="text-center stats-card">
                  <i
                    className="bi bi-box-fill"
                    style={{ color: "#007bff" }}
                  ></i>
                  <h5>Total Stock</h5>
                  <p>{totalStock} Items</p>
                </div>
                <div className="text-center stats-card">
                  <i
                    className="bi bi-bar-chart"
                    style={{ color: "#28a745" }}
                  ></i>
                  <h5>Total Sales</h5>
                  <p>${totalSales}</p>
                </div>
                <div className="text-center stats-card">
                  <i
                    className="bi bi-person-fill"
                    style={{ color: "#dc3545" }}
                  ></i>
                  <h5>Total Customers</h5>
                  <p>{totalCustomers}</p>
                </div>
              </div>
              <div className="text-center mb-4">
                <h6 htmlFor="year-select" className="">
                  Select year
                </h6>
                <div className="row justify-content-center align-items-center my-3">
                  <div className="col-md-5"></div>
                  <div className="col-md-2 text-center">
                    <select
                      id="year-select"
                      className="shadow-sm p-2 rounded "
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                    >
                      {years.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-5"></div>
                </div>
              </div>
              <div className="chart-container my-4 d-flex justify-content-center">
                <div className="chart-box p-4 border rounded bg-white">
                  <h2 className="chart-title text-center">
                    Sales Chart for {selectedYear}
                  </h2>
                  <Bar data={barData} options={barOptions} />
                </div>
              </div>
              <h2 className="text-center mb-4">Stock Level</h2>
              <div className="d-flex justify-content-center flex-wrap">
                {products.map((product, index) => {
                  const data = {
                    labels: ["In Stock", "Out of Stock"],
                    datasets: [
                      {
                        label: `${product.name} Stock`,
                        data: [product.inStock, product.outOfStock],
                        backgroundColor: [
                          "rgba(75, 192, 192, 0.6)",
                          "rgba(255, 99, 132, 0.6)",
                        ],
                        borderColor: "rgba(255, 255, 255, 1)",
                        borderWidth: 1,
                      },
                    ],
                  };

                  return (
                    <div
                      key={product.id || index}
                      className="m-3 d-flex flex-column align-items-center stock-item"
                    >
                      <h3 className="text-center">{product.name}</h3>
                      <div
                        className="chart-container"
                        style={{ height: "150px", width: "100%" }}
                      >
                        <Doughnut data={data} options={doughnutOptions} />
                      </div>
                      <p className="mt-2">
                        {product.inStock} in stock, {product.outOfStock} out of
                        stock
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default Dashboard;
