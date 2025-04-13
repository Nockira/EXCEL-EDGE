import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AppRoutes from "./routes/AppRoutes";
import ScrollToTop from "./components/ScrollToTop";
import "./index.css";

const App: React.FC = () => {
  return (
    <div>
      <ScrollToTop />
      <AppRoutes />
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default App;
