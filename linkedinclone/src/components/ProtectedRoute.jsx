import { Navigate } from "react-router";
import { useSelector } from "react-redux";
import { useGetLoginUser } from "../customHooks";

export default function ProtectedRoute({ children }) {
  const user = useGetLoginUser()

  console.log('what is status', user)

  if (!user?.status) {
    return <Navigate to="/" replace />;
  }

  return children;
}
