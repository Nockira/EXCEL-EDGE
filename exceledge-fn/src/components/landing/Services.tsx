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
export const ServiceSections = () => {
  const fixedServices = [
    {
      id: "tin-management",
      name: "TIN Management (Monthly Subscription)",
      description: `We offer monthly TIN (Tax Identification Number) management services based on your business turnover. Our pricing structure is tiered to ensure affordability and fairness:

For businesses with a turnover between 0 – 10,000,000 RWF, the monthly fee is 10,000 RWF.

For turnover between 10,000,001 – 20,000,000 RWF, the fee is 20,000 RWF per month.

Businesses with 20,000,001 – 50,000,000 RWF in turnover pay 100,000 RWF monthly.

For turnover between 50,000,001 – 100,000,000 RWF, the monthly charge is 300,000 RWF.

Any business exceeding 100,000,001 RWF in turnover is charged 500,000 RWF per month.`,
      icon: <ShieldCheck className="h-6 w-6 text-green-600" />,
      items: [
        {
          name: "Range",
          price: "10,000 - 500,000 RWF/month",
        },
      ],
    },
    {
      id: "google-location",
      name: "Google Location Establishment",
      description: `Secure your one-time verified listing on Google Map. Including profile creation,
        business verification, accurate address/category setup, contact details optimization,
        and 5 photo uploads. Boost local visibility immediately with guaranteed placement,
        ongoing support for 30 days, and a proven track record of helping businesses increase
        customer searches by 70%. Act now to lock in this launch price!`,
      icon: <Globe className="h-6 w-6 text-green-600" />,
      items: [{ name: "One-time fee", price: "39,999 RWF" }],
    },
    {
      id: "digital-library",
      name: "Digital Books & Media Library",
      description: `Unlock unlimited access to our growing library of text guides, audio tools, and video resources –
         plus the ability to upload and manage your own custom content.
,Always-updated professional resources
, Seamless custom content integration
,Mobile-friendly 24/7 access
,Exclusive member-only materials`,
      icon: <BookOpen className="h-6 w-6 text-green-600" />,
      items: [{ name: "Monthly access", price: "3,900 RWF/month" }],
    },
  ];

  // Negotiable services
  const negotiableServices = [
    {
      id: "accounting-tax",
      name: "Accounting & Tax Services",
      description: "Comprehensive accounting and tax compliance services.",
      icon: <Calculator className="h-6 w-6 text-green-600" />,
      items: [
        { name: "Accounting Services (Bookkeeping, payroll, etc.)" },
        { name: "Provision of Accounting Software" },
        { name: "Accounting Data Migration" },
        { name: "Tax Filing & Declaration" },
        { name: "Follow-up on Tax Refunds" },
        { name: "Compliance Support (RRA, RSSB, RDB, RPPA)" },
      ],
    },
    {
      id: "advisory-training",
      name: "Advisory & Training",
      description: "Professional guidance and skill development.",
      icon: <Lightbulb className="h-6 w-6 text-green-600" />,
      items: [
        { name: "Tax & Management Advisory" },
        { name: "Excel, EBM, Accounting Software Training" },
        { name: "Tender Bidding Preparation Training" },
      ],
    },
    {
      id: "document-assistance",
      name: "Document & Certification Assistance",
      description:
        "Help obtaining vital business documents and certifications.",
      icon: <FileText className="h-6 w-6 text-green-600" />,
      items: [
        { name: "TCC, RSSB Certificate, Good Standing" },
        { name: "EBM Certificate, VAT Certificate" },
        { name: "Beneficial Owner Statements, etc." },
      ],
    },
    {
      id: "financial-support",
      name: "Financial & Business Support",
      description: "Comprehensive business development services.",
      icon: <Users className="h-6 w-6 text-green-600" />,
      items: [
        { name: "Loan Application Assistance" },
        { name: "Website Development" },
        { name: "Social Media Management & Boosting" },
        { name: "Procedure Manuals Development" },
      ],
    },
  ];

  return (
    <div>
      <div>
        {/* Fixed Price Services Section */}
        <section className="bg-gray-200 py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                Our Fixed Price Services
              </h2>
              <p className="text-xl text-gray-900 max-w-2xl mx-auto">
                Transparent pricing for essential business services
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {fixedServices.map((service) => (
                <div key={service.id} className="p-6">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{service.name}</h3>
                  <p className="text-gray-900 mb-4">{service.description}</p>
                  <div className="space-y-2 mt-4">
                    {service.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center py-2"
                      >
                        <span className="text-gray-900">{item.name}</span>
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
              <h2 className="text-3xl font-bold mb-4">Negotiable Services</h2>
              <p className="text-xl text-gray-900 max-w-2xl mx-auto">
                Customized solutions tailored to your business needs
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {negotiableServices.map((service) => (
                <div
                  key={service.id}
                  className="bg-white p-6 rounded-lg shadow-md"
                >
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                      {service.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{service.name}</h3>
                      <p className="text-gray-900">{service.description}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="font-medium text-gray-700 mb-2">
                      Services include:
                    </p>
                    <ul className="space-y-2">
                      {service.items.map((item, index) => (
                        <li key={index} className="flex items-center">
                          <Check className="h-5 w-5 text-green-500 mr-2" />
                          <span className="text-gray-700">{item.name}</span>
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
