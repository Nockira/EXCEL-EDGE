import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter } from "lucide-react";
import { MdOutlineEmail } from "react-icons/md";
import { FaPhone } from "react-icons/fa";
import { MdLocationCity } from "react-icons/md";
import logo from "../../../assets/vdlogo.png";
import { useTranslation } from "react-i18next";
import { PiTiktokLogoBold } from "react-icons/pi";

export const Footer: React.FC = () => {
  const { t } = useTranslation<string>();
  return (
    <footer className="bg-black text-white py-8">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4 px-4 md:px-8">
        <div className="flex items-center flex-col gap-4">
          <Link to="/" className="flex  gap-2 text-2xl font-bold">
            <img src={logo} alt="Village Deals Logo" width="150" height="150" />
          </Link>
          <p className="text-lg">Innovating Your Business Growth</p>
          <div className="flex gap-4">
            <a
              href="https://www.facebook.com/profile.php?id=61551370063418"
              className="hover:text-white"
            >
              <Facebook size={18} />
            </a>
            <a
              href="https://www.instagram.com/exceledgecpa/?hl=en"
              target="_blank"
              rel="noreferrer noopener"
            >
              <Instagram size={24} />
            </a>
            <a
              href="https://www.tiktok.com/@enockiradukunda2"
              className="hover:text-white"
            >
              <PiTiktokLogoBold size={24} />
            </a>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-bold">Quick Links</h3>
          <Link to="/about" className="text-normal">
            {t("navigation.about")}
          </Link>
          <Link to="/services" className="text-normal">
            {t("navigation.services")}
          </Link>
          <Link to="/questions" className="text-normal">
            {t("navigation.faq")}
          </Link>
        </div>
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-bold">Contact</h3>
          <p className="text-normal flex gap-1">
            <MdOutlineEmail className="text-yellow-500" /> <span> </span>
            <a href="info@exceledgecpa.com" className="text-white">
              info@exceledgecpa.com
            </a>
          </p>
          <p className="text-normal flex gap-1">
            <FaPhone className="text-yellow-500" /> <span> </span>
            <a href="tel:+1234567890" className="text-white">
              +250 788 701 837
            </a>
          </p>
          <p className="text-normal flex gap-1">
            <MdLocationCity className="text-yellow-500" /> 42 KK 718 St, Kigali
          </p>
        </div>
      </div>
      <div className="text-center text-sm py-4">
        <p>&copy; {new Date().getFullYear()} Exceledge. All rights reserved.</p>
      </div>
    </footer>
  );
};
