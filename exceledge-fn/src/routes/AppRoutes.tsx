import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import PageLoader from "../components/common/pageLoader";
import { Questions } from "../pages/Questions";
import { Service } from "../pages/Service";
import { Login } from "../pages/Login";
import { RegisterShop } from "../pages/RegisterShop";
import { PricingPage } from "../pages/Pricing";
import { UserRegister } from "../pages/Register";
import { AdminDashboard } from "../components/common/dashboards/Admin";
import { Announcements } from "../pages/Anouncement";
import GoogleAuthCallback from "../pages/googleAuth";

const Home = lazy(() => import("../pages/Home"));
const About = lazy(() => import("../pages/About"));
const NotFound = lazy(() => import("../pages/NotFound"));

const AppRoutes = () => {
  return (
    <Suspense
      fallback={
        <div>
          <PageLoader />
        </div>
      }
    >
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/questions" element={<Questions />} />
        <Route path="/services" element={<Service />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/announcements" element={<Announcements />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register-shop" element={<RegisterShop />} />
        <Route path="/sign-in" element={<UserRegister />} />
        <Route path="/auth/callback" element={<GoogleAuthCallback />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
