import { Navigate, Outlet } from "react-router";
import { useSelector } from "react-redux";
import { useGetLoginUser } from "../customHooks";

export default function ProtectedRoute({ children }) {
  const user = useSelector(state=>state?.user?.status)

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet/>;
}
