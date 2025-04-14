import React from "react";
import {
  Check,
  ShieldCheck,
  Globe,
  BookOpen,
  Calculator,
  FileText,
  Users,
  Lightbulb,
} from "lucide-react";
import ServicesImg from "../../assets/services.jpg";
import { useTranslation } from "react-i18next";
export const ServiceSections = () => {
  const { t } = useTranslation<string>();

  const fixedServices = [
    {
      id: "tin-management",
      name: t("services.fixed.tin.name"),
      description: t("services.fixed.tin.description"),
      icon: <ShieldCheck className="h-6 w-6 text-[#fdc901]" />,
      items: [
        {
          name: t("services.fixed.tin.range"),
          price: "10,000 - 500,000 RWF/month",
        },
      ],
    },
    {
      id: "google-location",
      name: t("services.fixed.google.name"),
      description: t("services.fixed.google.description"),
      icon: <Globe className="h-6 w-6 text-[#fdc901]" />,
      items: [
        { name: t("services.fixed.google.feeLabel"), price: "39,999 RWF" },
      ],
    },
    {
      id: "digital-library",
      name: t("services.fixed.library.name"),
      description: t("services.fixed.library.description"),
      icon: <BookOpen className="h-6 w-6 text-[#fdc901]" />,
      items: [
        {
          name: t("services.fixed.library.feeLabel"),
          price: "3,600 RWF/month",
        },
      ],
    },
  ];

  const negotiableServices = [
    {
      id: "accounting-tax",
      name: t("services.negotiable.accounting.name"),
      description: t("services.negotiable.accounting.description"),
      icon: <Calculator className="h-6 w-6 text-[#fdc901]" />,
      items: [
        { name: t("services.negotiable.accounting.bookkeeping") },
        { name: t("services.negotiable.accounting.software") },
        { name: t("services.negotiable.accounting.migration") },
        { name: t("services.negotiable.accounting.taxFiling") },
        { name: t("services.negotiable.accounting.refunds") },
        { name: t("services.negotiable.accounting.compliance") },
      ],
    },
    {
      id: "advisory-training",
      name: t("services.negotiable.advisory.name"),
      description: t("services.negotiable.advisory.description"),
      icon: <Lightbulb className="h-6 w-6 text-[#fdc901]" />,
      items: [
        { name: t("services.negotiable.advisory.tax") },
        { name: t("services.negotiable.advisory.training") },
        { name: t("services.negotiable.advisory.tender") },
      ],
    },
    {
      id: "document-assistance",
      name: t("services.negotiable.documents.name"),
      description: t("services.negotiable.documents.description"),
      icon: <FileText className="h-6 w-6 text-[#fdc901]" />,
      items: [
        { name: t("services.negotiable.documents.certificates") },
        { name: t("services.negotiable.documents.ebm") },
        { name: t("services.negotiable.documents.ownership") },
      ],
    },
    {
      id: "financial-support",
      name: t("services.negotiable.financial.name"),
      description: t("services.negotiable.financial.description"),
      icon: <Users className="h-6 w-6 text-[#fdc901]" />,
      items: [
        { name: t("services.negotiable.financial.loan") },
        { name: t("services.negotiable.financial.website") },
        { name: t("services.negotiable.financial.social") },
        { name: t("services.negotiable.financial.manuals") },
      ],
    },
  ];
  return (
    <div>
      <div className="relative">
        {/* Image container with overlay */}
        <div className="relative w-full h-[50vh] overflow-hidden">
          <img
            src={ServicesImg}
            alt="pricing"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-end">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 text-center">
              {t("services.ourServices")}
            </h1>
            <p className="text-xl md:text-2xl text-white text-center max-w-2xl px-4  mb-8">
              {t("services.transparentPricing")}
            </p>
          </div>
        </div>
      </div>
      <div>
        {/* Fixed Price Services Section */}
        <section className="bg-gray-200 py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                {t("services.fixedPriceServices")}
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {fixedServices.map((service) => (
                <div key={service.id} className="p-6">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{service.name}</h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <div className="space-y-2 mt-4">
                    {service.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center py-2"
                      >
                        <span className="text-gray-600">{item.name}</span>
                        <span className="font-semibold">{item.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Negotiable Services Section */}
        <section className="bg-gray-100 py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                {t("services.negotiableServices")}
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {negotiableServices.map((service) => (
                <div
                  key={service.id}
                  className="bg-white p-6 rounded-lg shadow-md"
                >
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
                      {service.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{service.name}</h3>
                      <p className="text-gray-600">{service.description}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="font-medium text-gray-500 mb-2">
                      Services include:
                    </p>
                    <ul className="space-y-2">
                      {service.items.map((item, index) => (
                        <li key={index} className="flex items-center">
                          <Check className="h-5 w-5 text-[#fdc901] mr-2" />
                          <span className="text-gray-500">{item.name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
