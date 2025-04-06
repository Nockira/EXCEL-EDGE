import React from "react";
import { MainLayout } from "../components/layouts/MainLayout";
import { HeroSection } from "../components/landing/HeroSection";
import { ServiceSections } from "../components/landing/Services";
import { WhyChooseUs } from "../components/landing/whyChoosingUs";
import { Testimonial } from "../components/landing/Testimonial";
import { ContactUs } from "../components/landing/ContactUs";
import { GoogleMapComponent } from "../components/landing/GoogleMapComponet";

const Home: React.FC = () => {
  return (
    <MainLayout>
      <HeroSection />

      <ServiceSections />
      <WhyChooseUs />
      <Testimonial />
      <ContactUs />
      <GoogleMapComponent />
    </MainLayout>
  );
};

export default Home;
