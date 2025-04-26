import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

interface DecodedToken {
  id: string;
  email: string;
  firstName: string;
  secondName: string;
  role: string;
  exp: number;
  iat: number;
}

const GoogleAuthCallback: React.FC = () => {
  const { t } = useTranslation<string>();
  const navigate = useNavigate();
  const location = useLocation();
  const [processed, setProcessed] = useState(false);

  useEffect(() => {
    if (processed) return;
    const handleAuth = async () => {
      const queryParams = new URLSearchParams(location.search);
      const token = queryParams.get("token");
      if (token) {
        try {
          localStorage.setItem("accessToken", token);
          const decoded = jwtDecode<DecodedToken>(token);
          const currentTime = Date.now() / 1000;
          if (decoded.exp < currentTime) {
            throw new Error("Token expired");
          }
          setProcessed(true);
          toast.success(
            `${t("toast.welcome")}, ${decoded.firstName} ${decoded.secondName}!`
          );
          if (decoded.role === "ADMIN") {
            navigate("/admin-dashboard", { replace: true });
          } else {
            navigate("/", { replace: true });
          }
        } catch (err) {
          console.error("Token decode error:", err);
          toast.error("Invalid or expired token. Please login again.");
          setProcessed(true);
          navigate("/", { replace: true });
        }
      } else {
        if (location.pathname.includes("/auth/callback")) {
          toast.error("Login failed. Authentication token missing.");
          setProcessed(true);
          navigate("/", { replace: true });
        }
      }
    };

    handleAuth();
  }, [location, navigate, processed]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
      <p className="text-lg text-center">Processing your login...</p>
    </div>
  );
};

export default GoogleAuthCallback;
