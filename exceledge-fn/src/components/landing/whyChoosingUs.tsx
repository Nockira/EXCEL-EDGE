import { Lightbulb, ShieldCheck, Users } from "lucide-react";
import React from "react";

export const WhyChooseUs = () => {
  return (
    <div>
      {/* Why Choose Us */}
      <section className="bg-gray-200 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose Our Services</h2>
            <p className="text-xl text-gray-900 max-w-2xl mx-auto">
              We're committed to helping your business succeed in Rwanda
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Compliance Experts</h3>
              <p className="text-gray-900">
                We ensure your business meets all tax regulations and compliance
                requirements in Rwanda.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Experienced Team</h3>
              <p className="text-gray-900">
                Our team has years of experience in providing tax and business
                services to companies of all sizes.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lightbulb className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Innovative Solutions</h3>
              <p className="text-gray-900">
                We combine traditional expertise with modern digital solutions
                for maximum efficiency.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
