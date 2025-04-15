import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import EngFlag from "../../assets/english.png";
import FRFlag from "../../assets/fr.png";
import RWFlag from "../../assets/rw.png";

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation<string>();
  const [selectedLang, setSelectedLang] = useState(i18n.language || "rw");

  const languages = [
    { code: "rw", label: "Kinyarwanda", flag: RWFlag },
    { code: "en", label: "English", flag: EngFlag },
    { code: "fr", label: "Français", flag: FRFlag },
  ];

  const handleChange = (lang: string) => {
    setSelectedLang(lang);
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
  };

  return (
    <div className="relative inline-block">
      <div className="flex items-center gap-2 bg-black text-yellow-300 px-3 py-1 rounded cursor-pointer">
        <img
          src={languages.find((l) => l.code === selectedLang)?.flag}
          alt="flag"
          className="w-5 h-4"
        />
        <select
          value={selectedLang}
          onChange={(e) => handleChange(e.target.value)}
          className="appearance-none bg-black text-yellow-300 pl-2 pr-8 py-1 focus:outline-none cursor-pointer"
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
