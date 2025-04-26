import { ContactUs } from "../components/landing/ContactUs";
import { MainLayout } from "../components/layouts/MainLayout";

export const ContactUsPage = () => {
  return (
    <MainLayout>
      <div className="w-full h-full mt-16">
        <ContactUs />
      </div>
    </MainLayout>
  );
};
