import { BrowserRouter, Route, Routes} from "react-router-dom";
import "./App.css";
import Login from "./Components/Pages/Login&Register/Login";
import Register from "./Components/Pages/Login&Register/Register";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import Dashboard from "./Components/Pages/Dashboard/Dashboard";
import Abroad from "./Components/Pages/Abroad/Abroad";
import Blog from "./Components/Pages/Blog/Blog";
import ForgotPassword from "./Components/Pages/Login&Register/ForgotPassword";
import VerifyOtp from "./Components/Pages/Login&Register/VerifyOtp";
import ResetPassword from "./Components/Pages/Login&Register/ResetPassword";
import { Toaster } from "react-hot-toast";
import MyAccount from "./Components/Pages/MyAccount/MyAccount";
import Course from "./Components/Pages/Course/Course";

function App() {
  const toastOptions = {
    loading: {
      duration: 3000,
      theme: {
        primary: "green",
        secondary: "black",
      },
      style: {
        background: "#363636",
        color: "#fff",
        width: "100%",
      },
    },
    success: {
      duration: 3000,
      theme: {
        primary: "green",
        secondary: "black",
      },
      style: {
        background: "#363636",
        color: "#fff",
        width: "100%",
      },
    },
    error: {
      duration: 3000,
      theme: {
        primary: "green",
        secondary: "black",
      },
      style: {
        background: "#363636",
        color: "#fff",
        width: "100%",
      },
    },
  };
  return (
    <div className="App">
      <BrowserRouter >
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot/password" element={<ForgotPassword />} />
          <Route path="/verify/otp" element={<VerifyOtp />} />
          <Route path="/reset/password" element={<ResetPassword />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/abroad" element={<Abroad />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/course" element={<Course />} />
          <Route path="/my/account" element={<MyAccount />} />
        </Routes>
        <Toaster
          position="bottom-center"
          reverseOrder={false}
          containerClassName=""
          toastOptions={toastOptions}
        />
      </BrowserRouter>
    </div>
  );
}

export default App;
