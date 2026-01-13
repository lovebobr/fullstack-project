import { Routes, Route, Navigate } from "react-router-dom";
import RoleGuard from "./guards/RoleGurds";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { RestaurantPage } from "./pages/RestaurantPage";
import ManagerPage from "./pages/AdminPanel";
import { PATHS } from "./paths";
import { GlobalStyle } from "./styled/global-styles";
import PaymentPage from "./pages/PaymentPage";
import PaymentResultPage from "./pages/ModalPaymentResult";
import SmsVerificationPage from "./pages/SmsVerificationPage";
import Profile from "./pages/Profile";
import HomePage from "./pages/HomePages";
import MenuPage from "./pages/MenuPages";

const App = () => {
  return (
    <>
      <GlobalStyle />

      <Routes>
        <Route path={PATHS.HOME} element={<HomePage />} />
        <Route path={PATHS.MENU} element={<MenuPage />} />
        <Route path={PATHS.LOGIN} element={<LoginPage />} />
        <Route path={PATHS.REGISTER} element={<RegisterPage />} />

        <Route
          path={PATHS.RESTAURANT}
          element={
            <RoleGuard allowedRoles={["user"]}>
              <RestaurantPage />
            </RoleGuard>
          }
        />
        <Route
          path={PATHS.PROFILE}
          element={
            <RoleGuard allowedRoles={["user", "manager", "admin"]}>
              <Profile />
            </RoleGuard>
          }
        />

        <Route path={PATHS.PAYMENT} element={<PaymentPage />} />
        <Route
          path={PATHS.SMS_VERIFICATION}
          element={<SmsVerificationPage />}
        />
        <Route path={PATHS.PAYMENT_RESULT} element={<PaymentResultPage />} />

        {/* ManagerPage для manager и admin ролей */}
        <Route
          path={PATHS.MANAGER}
          element={
            <RoleGuard allowedRoles={["manager", "admin"]}>
              <ManagerPage />
            </RoleGuard>
          }
        />

        <Route path="/" element={<Navigate to={PATHS.LOGIN} replace />} />
        <Route path="*" element={<Navigate to={PATHS.LOGIN} replace />} />
      </Routes>
    </>
  );
};

export default App;
