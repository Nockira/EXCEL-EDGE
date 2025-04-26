import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import EngFlag from "../../assets/english.png";
import FRFlag from "../../assets/fr.png";
import RWFlag from "../../assets/rw.png";

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation<string>();
  const [selectedLang, setSelectedLang] = useState(i18n.language || "rw");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: "rw", label: "Kinyarwanda", flag: RWFlag },
    { code: "en", label: "English", flag: EngFlag },
    { code: "fr", label: "Français", flag: FRFlag },
  ];

  const handleChange = (lang: string) => {
    setSelectedLang(lang);
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentLanguage = languages.find((l) => l.code === selectedLang);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-black text-yellow-300 px-3 py-2 rounded-lg border border-yellow-300 hover:bg-gray-800 transition-colors duration-200"
      >
        {currentLanguage && (
          <>
            <img
              src={currentLanguage.flag}
              alt="flag"
              className="w-6 h-4 object-cover"
            />
            <span className="font-medium">{currentLanguage.label}</span>
          </>
        )}
        <svg
          className={`w-4 h-4 ml-1 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown menu */}
      <div
        className={`absolute right-0 -mt-8 w-48 bg-black border border-yellow-300 rounded-lg shadow-lg z-50 transition-all duration-200 origin-top ${
          isOpen
            ? "scale-y-100 opacity-100"
            : "scale-y-95 opacity-0 pointer-events-none"
        }`}
      >
        <ul className="py-1">
          {languages.map((lang) => (
            <li
              key={lang.code}
              className={`flex items-center px-4 py-2 cursor-pointer transition-colors duration-150 ${
                selectedLang === lang.code
                  ? "bg-yellow-500 text-black font-semibold"
                  : "text-yellow-300 hover:bg-yellow-600 hover:bg-opacity-30"
              }`}
              onClick={() => handleChange(lang.code)}
            >
              <img
                src={lang.flag}
                alt={lang.label}
                className="w-6 h-4 mr-3 object-cover"
              />
              <span>{lang.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
