import React, { useState } from "react";
import Faq from "../../assets/Faq.jpg";
import { useTranslation } from "react-i18next";

export const FAQSection = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const { t } = useTranslation<string>();
  const faqs: { question: string; answer: string }[] = t("fqa.faqs", {
    returnObjects: true,
  });

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <>
      <div className="relative">
        {/* Image container with overlay */}
        <div className="relative w-full h-[50vh] overflow-hidden">
          <img src={Faq} alt="pricing" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-end">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 text-center">
              {t("fqa.title")}
            </h1>
            <p className="text-xl md:text-2xl text-white text-center max-w-2xl px-4 mb-8">
              {t("fqa.subtitle")}
            </p>
          </div>
        </div>
      </div>

      <div className="w-full">
        <div className="container mx-auto py-12">
          <div className="max-w-3xl mx-auto">
            {faqs?.map((faq, index) => (
              <div
                key={index}
                className="mb-4 border border-yellow-200 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className={`w-full text-left px-6 py-4 flex justify-between items-center transition-colors ${
                    activeIndex === index
                      ? "bg-[#fdc901] text-white"
                      : "bg-gray-50 hover:bg-yellow-100 text-gray-600"
                  }`}
                >
                  <span className="font-medium text-lg">{faq.question}</span>
                  <span className="text-xl">
                    {activeIndex === index ? "−" : "+"}
                  </span>
                </button>

                {activeIndex === index && (
                  <div className="px-6 py-4 bg-white text-gray-500">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
