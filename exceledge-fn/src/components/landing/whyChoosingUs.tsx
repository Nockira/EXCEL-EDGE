import { Lightbulb, ShieldCheck, Users } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";

export const WhyChooseUs = () => {
  const { t } = useTranslation<string>();
  return (
    <div>
      {/* Why Choose Us */}
      <section className="bg-gray-200 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              {t("whyChooseUs.title")}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t("whyChooseUs.description")}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="h-8 w-8 text-[#fdc901]" />
              </div>
              <h3 className="text-xl font-bold mb-2">
                {t("whyChooseUs.compliance.title")}
              </h3>
              <p className="text-gray-600">
                {t("whyChooseUs.compliance.desc")}
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-[#fdc901]" />
              </div>
              <h3 className="text-xl font-bold mb-2">
                {t("whyChooseUs.team.title")}
              </h3>
              <p className="text-gray-600">{t("whyChooseUs.team.desc")}</p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lightbulb className="h-8 w-8 text-[#fdc901]" />
              </div>
              <h3 className="text-xl font-bold mb-2">
                {t("whyChooseUs.innovation.title")}
              </h3>
              <p className="text-gray-600">
                {t("whyChooseUs.innovation.desc")}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
