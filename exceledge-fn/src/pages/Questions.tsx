import React from "react";
import { MainLayout } from "../components/layouts/MainLayout";
import { FAQSection } from "../components/landing/Faq";

export const Questions: React.FC = () => {
  return (
    <MainLayout>
      <div className="bg-gray-200">
        <FAQSection />
      </div>
    </MainLayout>
  );
};
