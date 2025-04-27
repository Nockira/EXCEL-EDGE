import { Facebook } from "lucide-react";
import { LanguageSwitcher } from "../LanguageSwitcher";
import { PiTiktokLogoBold } from "react-icons/pi";
import { SlSocialLinkedin } from "react-icons/sl";
export const SubSubHeader = () => {
  return (
    <div className="bg-black text-yellow-400">
      <div className="container mx-auto flex flex-col px-8 md:flex-row justify-between items-center">
        <div className="sm:flex hidden flex-wrap justify-center md:justify-start gap-4 mb-4 md:mb-0">
          <div className="flex items-center">
            <span className="mr-1">📍</span>
            <span>Kigali, Rwanda</span>
          </div>
          <div className="flex items-center">
            <span className="mr-1">✉️</span>
            <span>info@exceledgecpa.com</span>
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
    </div>
  );
};
