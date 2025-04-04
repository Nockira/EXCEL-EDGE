import React from "react";
import { Link } from "react-router-dom";

const NotFound: React.FC = () => {
  return (
    <div className="flex justify-center items-center p-4 h-screen bg-gray-100">
      <div>
        <h1 className="text-2xl font-bold">404 - Page Not Found</h1>
        <Link to="/" className="flex justify-center text-blue-500 pt-4">
          Go Back Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
