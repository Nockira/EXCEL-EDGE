import React from "react";
import { MainLayout } from "../components/layouts/MainLayout";
import { AboutSection } from "../components/landing/AboutPage";
const About: React.FC = () => {
  return (
    <MainLayout>
      <div className="">
        <AboutSection />
      </div>
    </MainLayout>
  );
};

export default About;
