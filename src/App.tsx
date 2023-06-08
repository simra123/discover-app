import React, { Suspense, useState } from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/styles/styles.scss";
import "react-toastify/dist/ReactToastify.css";
const LoginPage = React.lazy(() => import("./pages/login"));
const RegisterPage = React.lazy(() => import("./pages/signin"));
const Dashboard = React.lazy(() => import("./pages/dashboard.tsx"));
import TikTokList from "./components/tiktokList";
import UserReports from "./components/userReports";
interface ProtectedRouteProps {
  user: string | null;
  redirectPath?: string;
  children?: React.ReactNode;
}

const ProtectedRoute = ({
  user,
  redirectPath = "/login",
  children,
}: ProtectedRouteProps): JSX.Element => {
  if (!user) {
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children ? children : <Outlet />}</>;
};

const PublicRoute = ({ user, children }: ProtectedRouteProps): JSX.Element => {
  if (user) {
    return <Navigate to={"/dashboard"} replace />;
  }

  return <>{children ? children : <Outlet />}</>;
};

const App: React.FC = () => {
  const isLoggedIn = localStorage.getItem("isUserLogged");
  const [isUserLogged, setIsUserLogged] = useState<string | null>(isLoggedIn);
  const [showCard, setShowCard] = useState<boolean>(false);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route index element={<Navigate to="/login" replace />} />
        <Route element={<PublicRoute user={isUserLogged} />}>
          <Route
            path="login"
            element={<LoginPage setUser={setIsUserLogged} />}
          />
          <Route path="register" element={<RegisterPage />} />
        </Route>
        <Route element={<ProtectedRoute user={isUserLogged} />}>
          <Route path="/dashboard/*" element={<Dashboard />}>
            <Route
              index
              element={
                <TikTokList
                  showCard={showCard}
                  setShowCard={setShowCard}
                  showButton={false}
                />
              }
            />
            <Route path="reports" element={<UserReports />} />
            {/* Add more routes for your dashboard */}
          </Route>
        </Route>
        <Route path="*" element={<p>There's nothing here: 404!</p>} />
      </Routes>
    </Suspense>
  );
};

export default App;
