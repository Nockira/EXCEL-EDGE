import React, { useState } from "react";
import Faq from "../../assets/Faq.jpg";
export const FAQSection = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept mobile money (MTN, Airtel), bank transfers, and credit/debit cards (Visa, Mastercard). All payments are processed securely through our payment gateway.",
    },
    {
      question: "How do I subscribe to TIN Management services?",
      answer:
        "Simply select your business turnover range from our pricing options, and you'll be guided through a quick onboarding process. You'll need to provide basic business details and payment information.",
    },
    {
      question: "Can I cancel my Digital Library subscription anytime?",
      answer:
        "Yes, you can cancel your subscription at any time through your account dashboard. Your access will continue until the end of your current billing period.",
    },
    {
      question: "How long does Google Location setup take?",
      answer:
        "Typically 2-3 business days after payment confirmation. We'll handle all verification processes with Google and notify you once your business is live on Maps.",
    },
    {
      question:
        "Are your accounting services available for international businesses?",
      answer:
        "Currently, we specialize in Rwandan tax and accounting compliance. For international businesses, we recommend contacting us for a custom consultation.",
    },
    {
      question: "What's included in your tax advisory services?",
      answer:
        "Our advisors provide guidance on tax optimization, compliance with RRA regulations, VAT management, and preparation for audits. This is a personalized service tailored to your business needs.",
    },
    {
      question: "Can I get assistance with RSSB compliance?",
      answer:
        "Absolutely. We help with RSSB registration, monthly declarations, employee enrollment, and certificate acquisition as part of our compliance support services.",
    },
    {
      question: "How quickly can you help with loan applications?",
      answer:
        "Our standard processing time is 5-7 business days after receiving all required documents. We work with multiple financial institutions to find you the best terms.",
    },
    {
      question: "What makes your training programs unique?",
      answer:
        "We focus on practical, Rwanda-specific case studies and provide post-training support. All our trainers are certified professionals with real-world experience.",
    },
    {
      question: "Are your prices negotiable for long-term contracts?",
      answer:
        "Yes, we offer discounted rates for annual subscriptions to TIN Management and Accounting Services. Contact our sales team for custom quotes.",
    },
    {
      question: "What documents do I need for VAT registration?",
      answer:
        "Typically: TIN certificate, business registration documents, bank details, and premises lease agreement. We'll provide a complete checklist during onboarding.",
    },
    {
      question: "Can you help recover tax refunds from RRA?",
      answer:
        "Yes, we specialize in tax refund follow-ups, including document preparation, submission, and progress tracking with RRA officials.",
    },
  ];

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
              Frequently Asked Questions
            </h1>
            <p className="text-xl md:text-2xl text-white text-center max-w-2xl px-4  mb-8">
              Everything you need to know is right here, neatly organized and
              easy to find.
            </p>
          </div>
        </div>
      </div>
      <div className="w-full ">
        <div className="container mx-auto py-12">
          <div className="max-w-3xl mx-auto">
            {faqs.map((faq, index) => (
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
