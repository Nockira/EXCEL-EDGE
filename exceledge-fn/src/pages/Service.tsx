import React from "react";
import { MainLayout } from "../components/layouts/MainLayout";
import { ServiceSections } from "../components/landing/Services";

export const Service: React.FC = () => {
  return (
    <MainLayout>
      <div className="">
        <ServiceSections />
      </div>
    </MainLayout>
  );
};
