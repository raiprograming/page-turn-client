import { Navigate, Outlet } from "react-router";
import isAdminLoggedIn from "../helpers/IsAdminLoggedIn";
import AdminLayout from "../components/Admin/AdminLayout/AdminLayout";

function ProtectedAdminRoute({ fallbackPath = '/' }) {
  if (!isAdminLoggedIn()) {
    return <Navigate to={fallbackPath} replace />;
  }

  return <AdminLayout children={<Outlet />} />;
}

export default ProtectedAdminRoute;
