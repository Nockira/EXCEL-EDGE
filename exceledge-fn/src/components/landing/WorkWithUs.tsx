import React from "react";
import AItool from "../../assets/AI.png";
import Analytics from "../../assets/analytics.png";
import Invoice from "../../assets/invoice.jpg";

const WorkWithUs = () => {
  return (
    <div>
      <div>
        <div className="bg-gray-200">
          <div className="container mx-auto py-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-800">
                What’s possible with us
              </h2>
            </div>
            <div className="block justify-between items-center gap-4 sm:m-0 m-4">
              <div className="sm:flex block  item-center gap-[8%] pt-[8%]">
                <img
                  src={Analytics}
                  alt="AI tools"
                  className="sm:flex hidden justify-center sm:w-[46%] h-72 rounded-[20px]"
                />
                <div
                  className="flex items-center text-[#fdc901] text-white p-4 text-medium sm:w-[46%] 
               rounded-[20px]"
                >
                  <p className="sm:m-0 m-2">
                    <h1 className="text-lg font-bold py-2">
                      1. Business Monitoring
                    </h1>
                    At <b>VillageDeals</b>, we provide comprehensive business
                    monitoring solutions to help you stay on top of your
                    operations. Our services include real-time tracking of
                    financial performance, sales trends, and inventory
                    management, ensuring you have the insights needed to make
                    informed decisions. We offer automated reporting, predictive
                    analytics, and AI-driven recommendations to identify growth
                    opportunities and mitigate risks. With our tools, you can
                    monitor key performance indicators (KPIs), detect anomalies,
                    and optimize business strategies—all in one intuitive
                    platform. Partner with us to gain full visibility and
                    control over your business performance for sustained
                    success.
                  </p>
                </div>
              </div>

              <div className="sm:flex block item-center gap-[8%] pt-[8%]">
                <div
                  className="flex items-center text-[#fdc901] text-white p-4 text-medium sm:w-[46%] 
               rounded-[20px]"
                >
                  <p>
                    <h1 className="text-lg font-bold py-2">2. Invoices</h1>
                    Streamline your invoice calculation and printing with ease!
                    Our system ensures accurate, automated invoice generation,
                    eliminating manual errors and saving you time. With
                    real-time tax and discount calculations, customizable
                    templates, and one-click printing, you can create
                    professional invoices effortlessly. Stay organized, improve
                    cash flow, and enhance your business efficiency with our
                    seamless invoice management solution. Whether you’re a small
                    business or a large enterprise, our platform is designed to
                    simplify your billing process and help you get paid faster.
                    Experience the benefits of our user-friendly invoicing
                    system and take your business to the next level.
                  </p>
                </div>
                <img
                  src={Invoice}
                  alt="AI tools"
                  className="sm:flex hidden justify-center sm:w-[46%] h-72 rounded-[20px]"
                />
              </div>
              <div className="sm:flex block item-center gap-[8%] pt-[8%]">
                <img
                  src={AItool}
                  alt="AI tools"
                  className="sm:flex hidden justify-center sm:w-[46%] h-72 rounded-[20px]"
                />
                <div
                  className="flex items-center text-[#fdc901] text-white p-4 text-medium sm:w-[46%] 
               rounded-[20px]"
                >
                  <p>
                    <h1 className="text-lg font-bold py-2">3. AI Monitoring</h1>
                    Unlock the power of AI-driven business monitoring with us!
                    Our advanced artificial intelligence solutions analyze
                    real-time data, predict trends, and provide actionable
                    insights to keep your business ahead of the curve. From
                    automated reports to smart alerts on anomalies and
                    opportunities, AI ensures you make data-backed decisions
                    with confidence. Stay in control, optimize operations, and
                    drive growth effortlessly—let AI transform the way you
                    monitor your business! Partner with us to leverage the
                    latest AI technologies and unlock the full potential of your
                    data for sustainable success.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkWithUs;
