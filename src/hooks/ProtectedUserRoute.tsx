import { Navigate, Outlet } from "react-router";
import IsUserLoggedIn from "../helpers/IsUserLoggedIn";

function ProtectedUserRoute({ fallbackPath = '/login' }) {
  if (!IsUserLoggedIn()) {
    return <Navigate to={fallbackPath} replace />;
  }

  return <Outlet />;
}

export default ProtectedUserRoute;
