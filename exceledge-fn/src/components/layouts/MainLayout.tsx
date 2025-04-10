import React from "react";
import { MainHeader } from "../common/navigator/MainHeader";
import { Footer } from "../common/navigator/Footer";

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-10 z-10"></div>

      {/* Main Content */}
      <div className="relative z-20 flex flex-col min-h-screen">
        <MainHeader />
        <main className="flex-1 pt-28">{children}</main>
        <Footer />
      </div>
    </div>
  );
};
