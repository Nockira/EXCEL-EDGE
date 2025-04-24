import { Service } from "../../types";
import { useTranslation } from "react-i18next";

export const useServicesData = (): Service[] => {
  const { t } = useTranslation<string>();

  return [
    {
      id: "tin-0-10m",
      name: t("pricing.tin-0-10m.name"),
      slug: "TIN_MANAGEMENT",
      description: t("pricing.tin-0-10m.description"),
      price: "10,000 RWF/month",
      basePrice: 10000,
      category: "Small business",
      isMonthly: true,
    },
    {
      id: "tin-10-20m",
      name: t("pricing.tin-10-20m.name"),
      slug: "TIN_MANAGEMENT",
      description: t("pricing.tin-10-20m.description"),
      price: "20,000 RWF/month",
      basePrice: 20000,
      category: "Growing business",
      isMonthly: true,
    },
    {
      id: "tin-20-50m",
      name: t("pricing.tin-20-50m.name"),
      slug: "TIN_MANAGEMENT",
      description: t("pricing.tin-20-50m.description"),
      price: "100,000 RWF/month",
      basePrice: 100000,
      category: "Medium business",
      isMonthly: true,
    },
    {
      id: "tin-50-100m",
      name: t("pricing.tin-50-100m.name"),
      slug: "TIN_MANAGEMENT",
      description: t("pricing.tin-50-100m.description"),
      price: "300,000 RWF/month",
      basePrice: 300000,
      category: "Large business",
      isMonthly: true,
    },
    {
      id: "tin-100m-plus",
      name: t("pricing.tin-100m-plus.name"),
      slug: "TIN_MANAGEMENT",
      description: t("pricing.tin-100m-plus.description"),
      price: "500,000 RWF/month",
      basePrice: 500000,
      category: "Enterprise businesses",
      isMonthly: true,
    },
    {
      id: "google-location",
      name: t("pricing.google-location.name"),
      description: t("pricing.google-location.description"),
      price: "39,999 RWF",
      basePrice: 39999,
      category: "Digital Services",
      isMonthly: false,
    },
    {
      id: "digital-library",
      name: t("pricing.digital-library.name"),
      description: t("pricing.digital-library.description"),
      price: "3,600 RWF/month",
      basePrice: 3600,
      category: "Books",
      isMonthly: true,
    },
  ];
};
