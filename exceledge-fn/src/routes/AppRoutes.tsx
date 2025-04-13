import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import PageLoader from "../components/common/pageLoader";
import { Questions } from "../pages/Questions";
import { Service } from "../pages/Service";
import { Login } from "../pages/Login";
import { PricingPage } from "../pages/Pricing";
import { UserRegister } from "../pages/Register";
import { AdminDashboard } from "../components/layouts/Dashboard";
import { Announcements } from "../pages/Announcement";
import GoogleAuthCallback from "../pages/googleAuth";
import { DashboardHome } from "../components/common/dashboards/DashboardHome";
import { UserManagement } from "../components/common/dashboards/userManagment";
import { Payments } from "../components/common/dashboards/Payment";
import { Resources } from "../components/common/dashboards/Resources";
import { AnnouncementsDashboard } from "../components/common/dashboards/Announcement";
import { Profile } from "../pages/Profile";

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
        <Route path="/pages/announcements" element={<Announcements />} />
        <Route path="/login" element={<Login />} />
        <Route path="/sign-in" element={<UserRegister />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/auth/callback" element={<GoogleAuthCallback />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />}>
          <Route index element={<DashboardHome />} />
          <Route path="dashboard" element={<DashboardHome />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="payments" element={<Payments />} />
          <Route path="announcements" element={<AnnouncementsDashboard />} />
          <Route path="resources" element={<Resources />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
