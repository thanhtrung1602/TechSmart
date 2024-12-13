import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { RootState } from "~/redux/store";

// Add 'children' prop to the ProtectedRoute component
interface ProtectedRouteProps {
  children: React.ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const admin = useSelector((state: RootState) => state.adminProfile?.adminProfile);
  const isAuthenticated = admin?.role === "admin"; // Check if the user is an admin


  if (isAuthenticated) {
    return <>{children}</>; // Render the children (the nested route component)
  }

  return <Navigate to="/login" replace />;
}

export default ProtectedRoute;

