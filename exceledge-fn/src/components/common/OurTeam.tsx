import React from "react";

interface TeamMemberProps {
  imageUrl: string;
  name: string;
  role: string;
  contacts: String;
  className?: string;
}

export const TeamMember: React.FC<TeamMemberProps> = ({
  imageUrl,
  name,
  role,
  contacts,
  className = "",
}) => {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-yellow-500 mb-4">
        <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
      </div>
      <h3 className="text-xl font-bold text-gray-800">{name}</h3>
      <p className="text-gray-600">{role}</p>
      <p className="text-gray-600">{contacts}</p>
    </div>
  );
};
