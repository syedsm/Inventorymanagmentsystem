import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { Contextapi } from "./contexts/Authcontext";
import Adminheader from "./Adminheader";
import Sidebar from "./Sidebar";
import Login from "./Auth/Login";
import Signup from "./Auth/Signup";
import Dashboard from "./Dashboard";
import AddProduct from "./Product/AddProduct";
import Productlist from "./Product/Productlist";
import Activation from "./Auth/Activation";
import Reset from "./Auth/ForgotPassword/Reset";
import VerifyOtp from "./Auth/ForgotPassword/VerifyOtp";
import Passwordreset from "./Auth/ForgotPassword/Passwordreset";
import Setting from "./Profile/Setting";
import Productupdate from "./Product/Productupdate";
import Editproduct from "./Product/Editproduct";
import HomePage from "./User/Homepage/Homepage";
import Supplier from "./Auth/Supplier";
import Supplieractivation from "./Auth/Supplieractivation";
import ManageUsers from "./Manageusers";
import Staff from "./Auth/Staffreg";
import Staffactivation from "./Auth/Staffactivation";
import Userheader from "./User/Homepage/Userheader";
import UserFooter from "./User/Homepage/UserFooter";
import "react-toastify/dist/ReactToastify.css";
import Contact from "./User/Homepage/Contact";
import About from "./User/Homepage/About";
import Cart from "./Cart";
import ProductDetail from "./User/Homepage/Productdetail";
import Paymentsuccess from "./Paymentsuccess";
import Paymentfailure from "./Paymentfailure";
import Paymentform from "./Paymentform";
import MyOrder from "./User/Homepage/Myorder";
import Profile from "./User/Profile";
import Buypage from "./User/Homepage/buypage";

function App() {
  const location = useLocation();
  const [OrderType, setOrderType] = useState(localStorage.getItem("OrderType"));
  const [cart, setCart] = useState(() => {
    const storedCartitem = JSON.parse(localStorage.getItem("cart"));
    return storedCartitem || [];
  });
  const [login, setLogin] = useState(localStorage.getItem("authToken"));

  const [loginemail, setloginemail] = useState(
    localStorage.getItem("loginemail")
  );

  const [loginpopup, setloginpopup] = useState(
    localStorage.getItem("showLoginPopup")
  );

  const [buyitem, setbuyitem] = useState(() => {
    const storedBuyitem = JSON.parse(localStorage.getItem("buyitem"));
    return storedBuyitem || [];
  });

  const [userRole, setUserRole] = useState(localStorage.getItem("userRole"));

  const authPages = [
    "/",
    "/resetpage",
    "/passwordreset",
    "/verify-otp",
    "/signup",
    "/partnership",
    "/supplieractivation",
    "/activation",
    "/staffreg",
    "/staffactivation",
  ];

  const isAuthPage = authPages.includes(location.pathname);

  // loginemail logic
  useEffect(() => {
    if (loginemail) {
      localStorage.setItem("loginemail", loginemail);
    } else {
      localStorage.removeItem("loginemail");
    }
  }, [loginemail]);

  // cart item
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // buyitem
  useEffect(() => {
    localStorage.setItem("buyitem", JSON.stringify(buyitem));
  }, [buyitem]);

  // token logic
  useEffect(() => {
    if (login) {
      localStorage.setItem("authToken", login);
    } else {
      localStorage.removeItem("authToken");
    }
  }, [login]);

  const handleLogout = () => {
    setLogin("");
    localStorage.removeItem("authToken");
    localStorage.removeItem("loginemail");
    localStorage.setItem("showLoginPopup", "true");
    setUserRole(localStorage.removeItem("userRole"));
    setloginpopup("true");
  };

  return (
    <Contextapi.Provider
      value={{
        OrderType,
        setOrderType,
        login,
        setLogin,
        loginemail,
        setloginemail,
        loginpopup,
        setloginpopup,
        userRole,
        setUserRole,
        cart,
        setCart,
        buyitem,
        setbuyitem,
      }}
    >
      {login ? (
        userRole === "admin" ||
        userRole === "staff" ||
        userRole === "supplier" ? (
          <div className="container-fluid">
            <div className="row">
              <div className="col-12">
                <Adminheader handleLogout={handleLogout} />
              </div>
            </div>
            <div className="row">
              <div className="col-md-2">
                <Sidebar />
              </div>
              <div className="col-md-10" style={{ padding: "20px" }}>
                <Routes>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/manageusers" element={<ManageUsers />} />
                  <Route path="/add" element={<AddProduct />} />
                  <Route path="/productlist" element={<Productlist />} />
                  <Route path="/profilesetting" element={<Setting />} />
                  <Route path="/updateproduct" element={<Productupdate />} />
                  <Route path="/editproduct/:id" element={<Editproduct />} />
                  <Route path="*" element={<Navigate to="/dashboard" />} />
                </Routes>
              </div>
            </div>
          </div>
        ) : (
          <>
            {!isAuthPage && <Userheader handleLogout={handleLogout} />}
            <Routes>
              <Route path="/home" element={<HomePage />} />
              <Route path="/buypage" element={<Buypage />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/about" element={<About />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/productpage/:id" element={<ProductDetail />} />
              <Route path="/success" element={<Paymentsuccess />} />
              <Route path="/failed" element={<Paymentfailure />} />
              <Route
                path="/paymentform/:totalAmount"
                element={<Paymentform />}
              />
              <Route path="/myorder" element={<MyOrder />} />
              <Route path="/myprofile" element={<Profile />} />
              <Route path="*" element={<Navigate to="/home" />} />
            </Routes>
            {!isAuthPage && <UserFooter />}
          </>
        )
      ) : (
        <>
          {!isAuthPage && <Userheader />}
          <Routes>
            <Route path="/partnership" element={<Supplier />} />
            <Route
              path="/supplieractivation"
              element={<Supplieractivation />}
            />
            <Route path="/buypage" element={<Buypage />} />
            <Route path="/activation" element={<Activation />} />
            <Route path="/staffreg" element={<Staff />} />
            <Route path="/staffactivation" element={<Staffactivation />} />
            <Route path="/" element={<Login />} />
            <Route path="/resetpage" element={<Reset />} />
            <Route path="/passwordreset" element={<Passwordreset />} />
            <Route path="/verify-otp" element={<VerifyOtp />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/paymentform/:totalAmount" element={<Paymentform />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/success" element={<Paymentsuccess />} />
            <Route path="/failed" element={<Paymentfailure />} />
            <Route path="/productpage/:id" element={<ProductDetail />} />
            <Route path="/myorder" element={<MyOrder />} />
            <Route path="/myprofile" element={<Profile />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
          {!isAuthPage && <UserFooter />}
        </>
      )}
    </Contextapi.Provider>
  );
}

export default function WrappedApp() {
  return (
    <Router>
      <App />
    </Router>
  );
}
