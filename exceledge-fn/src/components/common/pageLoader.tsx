import { PropagateLoader } from "react-spinners";
import ExcelEdgeLogo from "../../assets/vdlogo.png";

const PageLoader: React.FC = () => {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-black space-y-8">
      {/* Spinning Logo */}
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-yellow-400 blur-md opacity-20 animate-pulse"></div>
        <img
          src={ExcelEdgeLogo}
          alt="ExcelEdge Logo"
          className="w-32 h-32 animate-spin-slow"
        />
      </div>

      <div className="text-center">
        <h1 className="text-5xl font-extrabold tracking-tight">
          <span className="text-yellow-400">Excel</span>
          <span className="text-white">Edge</span>
        </h1>
        <p className="text-yellow-300 mt-2 text-lg">
          Accelerating your success
        </p>
      </div>
      <div className="relative">
        <PropagateLoader size={20} color="#facc15" speedMultiplier={0.7} />
      </div>
      <div className="flex space-x-3 mt-12">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="h-2 w-2 bg-yellow-400 rounded-full opacity-0 animate-fade-in"
            style={{
              animationDelay: `${i * 0.2}s`,
              animationFillMode: "forwards",
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default PageLoader;
