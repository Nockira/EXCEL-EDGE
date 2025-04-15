import { Facebook, Twitter, Youtube } from "lucide-react";
import { LanguageSwitcher } from "../LanguageSwitcher";

export const SubHeader = () => {
  return (
    <>
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
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
            <span>+250 788 123 456</span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex space-x-3">
            <a href="#" className="hover:text-white">
              <Facebook size={18} />
            </a>
            <a href="#" className="hover:text-white">
              <Twitter size={18} />
            </a>
            <a href="#" className="hover:text-white">
              <Youtube size={18} />
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
    </>
  );
};
