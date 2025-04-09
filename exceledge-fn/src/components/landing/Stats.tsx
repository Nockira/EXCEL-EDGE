import React, { useState, useEffect, useRef } from "react";

export const StatsSection = () => {
  const [animatedValues, setAnimatedValues] = useState([0, 0, 0, 0]);
  const statsRef = useRef<HTMLDivElement>(null);
  const animationDuration = 2000; // 2 seconds
  const startTimeRef = useRef<number | null>(null);

  const targetStats = [
    { id: 1, name: "Trusted Clients", value: 1200 },
    { id: 2, name: "Services Delivered", value: 3500 },
    { id: 3, name: "TINs Managed", value: 850 },
    { id: 4, name: "Businesses on Google", value: 420 },
  ];

  const animateNumbers = (timestamp: number) => {
    if (!startTimeRef.current) startTimeRef.current = timestamp;
    const elapsedTime = timestamp - startTimeRef.current;
    const progress = Math.min(elapsedTime / animationDuration, 1);

    const newValues = targetStats.map((stat) => {
      return Math.floor(stat.value * progress);
    });

    setAnimatedValues(newValues);

    if (progress < 1) {
      requestAnimationFrame(animateNumbers);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            startTimeRef.current = null;
            requestAnimationFrame(animateNumbers);
          }
        });
      },
      { threshold: 0.1 } // Trigger when 10% of component is visible
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => {
      if (statsRef.current) {
        observer.unobserve(statsRef.current);
      }
    };
  }, []);

  return (
    <div ref={statsRef} className="py-16 px-4">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-600 mb-12">
          Our Impact in Numbers
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {targetStats.map((stat, index) => (
            <div
              key={stat.id}
              className="bg-white p-6 rounded-lg shadow-sm border border-yellow-100 text-center transition-all hover:shadow-md hover:border-yellow-200"
            >
              <div className="flex justify-center mb-4">
                <div className="bg-yellow-100 p-3 rounded-full">
                  {stat.id === 1 && (
                    <svg
                      className="h-8 w-8 text-[#fdc901]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                  )}
                  {stat.id === 2 && (
                    <svg
                      className="h-8 w-8 text-[#fdc901]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                  {stat.id === 3 && (
                    <svg
                      className="h-8 w-8 text-[#fdc901]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                  )}
                  {stat.id === 4 && (
                    <svg
                      className="h-8 w-8 text-[#fdc901]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                      />
                    </svg>
                  )}
                </div>
              </div>
              <p className="text-3xl font-bold text-[#fdc901] mb-2">
                {animatedValues[index].toLocaleString()}+
              </p>
              <p className="text-gray-600 font-medium">{stat.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
