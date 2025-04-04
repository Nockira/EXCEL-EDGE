import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import PageLoader from "../components/common/pageLoader";
import { Questions } from "../pages/Questions";
import { Service } from "../pages/Service";
import { Login } from "../pages/Login";
import { RegisterShop } from "../pages/RegisterShop";
import { Contacts } from "../pages/Contacts";
import { UserRegister } from "../pages/Register";

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
        <Route path="/contact" element={<Contacts />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register-shop" element={<RegisterShop />} />
        <Route path="/sign-in" element={<UserRegister />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
