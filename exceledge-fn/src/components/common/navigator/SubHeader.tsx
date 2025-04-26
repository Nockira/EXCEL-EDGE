import { Facebook } from "lucide-react";
import { LanguageSwitcher } from "../LanguageSwitcher";
import { Link } from "react-router-dom";
import logo from "../../../assets/exceledge1.png";
import qbonline from "../../../assets/QB Online2X_7561.png";
import { PiTiktokLogoBold } from "react-icons/pi";
import { SlSocialLinkedin } from "react-icons/sl";
export const SubHeader = () => {
  return (
    <div className="">
      <div className="container mx-auto flex flex-col px-8 md:flex-row justify-between items-center">
        <div className="sm:flex hidden flex-wrap justify-center md:justify-start gap-4 mb-4 md:mb-0">
          <div className="flex items-center">
            <span className="mr-1">📍</span>
            <span>Kigali, Rwanda</span>
          </div>
          <div className="flex items-center">
            <span className="mr-1">✉️</span>
            <span>info@exceledge.com</span>
          </div>
          <div className="flex items-center">
            <span className="mr-1">📞</span>
            <span>+250 788 701 837</span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex space-x-3">
            <a
              href="https://www.facebook.com/profile.php?id=61551370063418"
              className="hover:text-white"
            >
              <Facebook size={18} />
            </a>
            <a
              href="https://www.linkedin.com/company/88918718/admin?lipi=urn%3Ali%3Apage%3Ad_flagship3_feed%3B7pBRikV1Ra60MHB4uF3mkA%3D%3D"
              className="hover:text-white"
            >
              <SlSocialLinkedin size={18} />
            </a>
            <a
              href="https://www.tiktok.com/@enockiradukunda2"
              className="hover:text-white"
            >
              <PiTiktokLogoBold size={19} />
            </a>
          </div>

          <div className="flex items-center space-x-2 border-l border-gray-600 pl-4 ml-2">
            <div className="relative">
              <LanguageSwitcher />
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <svg
                  className="w-4 h-4 text-yellow-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className=" bg-white shadow-md py-3 sm:px-28 px-8 flex justify-between items-center">
        <div className="flex  gap-2 text-black">
          <Link to="/" className="flex items-center gap-2 text-2xl font-bold">
            <img
              src={logo}
              alt="Exceledge"
              width="120"
              height="120"
              className=" 
                      "
            />
          </Link>
          <div className="sm:flex hidden flex-col">
            <h1 className="font-bold text-lg">Excel Edge CPA Ltd</h1>
            <p className="text-gray-600 text-sm">
              Accounting | Tax | Software Engineering
            </p>
          </div>
        </div>
        <div className="flex gap-2 text-black">
          <img
            src={qbonline}
            alt="intuit quickbooks"
            width="70"
            height="70"
            className=" 
                      "
          />
          <div className="sm:flex hidden flex-col">
            <h1 className="font-bold text-lg">Intuit quickbooks </h1>
            <p className="text-sm text-gray-600">Accredited</p>
          </div>
        </div>
      </div>
    </div>
  );
};
