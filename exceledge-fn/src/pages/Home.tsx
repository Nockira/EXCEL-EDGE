import React from "react";
import { MainLayout } from "../components/layouts/MainLayout";
import { HeroSection } from "../components/landing/HeroSection";
import { WhyChooseUs } from "../components/landing/whyChoosingUs";
import { Testimonial } from "../components/landing/Testimonial";
import { ContactUs } from "../components/landing/ContactUs";
import { GoogleMapComponent } from "../components/landing/GoogleMapComponet";
import { StatsSection } from "../components/landing/Stats";

const Home: React.FC = () => {
  return (
    <MainLayout>
      <HeroSection />
      <StatsSection />
      <WhyChooseUs />
      <Testimonial />
      <ContactUs />
      <GoogleMapComponent />
    </MainLayout>
  );
};

export default Home;
