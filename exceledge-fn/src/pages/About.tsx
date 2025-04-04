import React from "react";
import { MainLayout } from "../components/layouts/MainLayout";
const About: React.FC = () => {
  return (
    <MainLayout>
      <div className="p-4">
        <h1 className="text-2xl text-center font-bold">About Page</h1>
      </div>
    </MainLayout>
  );
};

export default About;
