import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../Auth/AuthStore.js";

export default function ProtectedPage({ children }) {
  const token = useAuthStore((state) => state.token);
  const location = useLocation();
  return token ? (
    children
  ) : (
    <Navigate to="/login" replace state={{ from: location.pathname }} />
  );
}
