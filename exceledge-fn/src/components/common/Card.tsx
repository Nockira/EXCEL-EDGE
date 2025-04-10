import React from "react";

interface CardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export const Card: React.FC<CardProps> = ({ icon, title, description }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 flex flex-col gap-4 max-w-md">
      <div className="flex items-center gap-4">
        <div className="text-blue-600">{icon}</div>
        <h3 className="text-lg font-medium text-gray-600">{title}</h3>
      </div>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};
