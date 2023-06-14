import React, { Suspense, useState } from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { DefaultChannel } from "./contextHook/index.ts";
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/styles/styles.scss";
import "react-toastify/dist/ReactToastify.css";
import "@fontsource/poppins";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/400-italic.css";
const LoginPage = React.lazy(() => import("./pages/login"));
const RegisterPage = React.lazy(() => import("./pages/signin"));
const Dashboard = React.lazy(() => import("./pages/dashboard.tsx"));
import TikTokList from "./pages/searchList.tsx";
import UserReports from "./pages/analytics.tsx";
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

interface contextTypes {
  label: string;
  value: string;
  icon?: JSX.Element;
}
const App: React.FC = () => {
  const isLoggedIn = localStorage.getItem("isUserLogged");
  const [isUserLogged, setIsUserLogged] = useState<string | null>(isLoggedIn);
  const [channel, SetChannel] = useState<contextTypes>({
    value: "tiktok",
    label: "Tiktok",
  });

  return (
    <DefaultChannel.Provider value={[channel, SetChannel]}>
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
              <Route exact={true} index element={<TikTokList />} />
              <Route exact path="reports" element={<UserReports />} />
              {/* Add more routes for your dashboard */}
            </Route>
          </Route>
          <Route path="*" element={<p>There's nothing here: 404!</p>} />
        </Routes>
      </Suspense>
    </DefaultChannel.Provider>
  );
};

export default App;
