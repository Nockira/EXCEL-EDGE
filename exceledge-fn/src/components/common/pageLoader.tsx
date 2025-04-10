import { PropagateLoader } from "react-spinners";

const PageLoader: React.FC = () => {
  return (
    <div className="flex justify-center items-center p-4 h-screen bg-gray-100">
      <div>
        <h1 className="text-3xl font-bold">
          <PropagateLoader size={28} color="yellow" />
        </h1>
      </div>
    </div>
  );
};

export default PageLoader;
