import React from "react";
import { MainLayout } from "../components/layouts/MainLayout";
import { HeroSection } from "../components/landing/HeroSection";
import WorkWithUs from "../components/landing/WorkWithUs";

const Home: React.FC = () => {
  return (
    <MainLayout>
      <div className="">
        <HeroSection />
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-b from-black to-transparent h-1/2"></div>
          <div className="relative z-10">
            <WorkWithUs />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Home;
