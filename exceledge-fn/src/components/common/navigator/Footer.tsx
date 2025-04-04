import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter } from "lucide-react";
import logo from "../../../assets/vdlogo.png";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-green-900 text-white py-8">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4 px-4 md:px-8">
        <div className="flex flex-col gap-4">
          <Link to="/" className="flex items-center gap-2 text-2xl font-bold">
            <img src={logo} alt="Village Deals Logo" width="50" height="50" />
            <span>Exceledge</span>
          </Link>
          <p className="text-lg">Trade smarter, Live Better.</p>
          <div className="flex gap-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer noopener"
            >
              <Facebook size={24} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer noopener"
            >
              <Instagram size={24} />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer noopener"
            >
              <Twitter size={24} />
            </a>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-bold">Quick Links</h3>
          <Link to="/about" className="text-normal">
            About us
          </Link>
          <Link to="/services" className="text-normal">
            Services
          </Link>
          <Link to="/questions" className="text-normal">
            FQA
          </Link>
        </div>
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-bold">Contact</h3>
          <p className="text-normal">
            Email: <span> </span>
            <a href="info.exceledge@gmail.com" className="text-white">
              info.exceledge@gmail.com
            </a>
          </p>
          <p className="text-normal">
            Phone:<span> </span>
            <a href="tel:+1234567890" className="text-white">
              +250 788 888 888
            </a>
          </p>
          <p className="text-normal">Address: 1234 Main St, Kigali, Rwanda</p>
        </div>
      </div>
      <div className="text-center text-sm py-4">
        <p>
          &copy; {new Date().getFullYear()} VillageDeals. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
