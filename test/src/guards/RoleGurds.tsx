import React from "react";
import { Navigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { authStore } from "../app/store/auth.store";
import { PATHS } from "../paths";

interface RoleGuardProps {
  allowedRoles: string[];
  children: React.ReactNode;
}

const RoleGuard: React.FC<RoleGuardProps> = observer(
  ({ allowedRoles, children }) => {
    const user = authStore.user;
    const userRole = user?.role;

    if (authStore.loading) {
      return <div>Загрузка...</div>;
    }

    if (!authStore.isAuthenticated) {
      return <Navigate to={PATHS.LOGIN} replace />;
    }

    if (!user) {
      return <div>Загрузка данных пользователя...</div>;
    }

    if (!userRole || !allowedRoles.includes(userRole)) {
      if (userRole === "admin" || userRole === "manager") {
        return <Navigate to={PATHS.MANAGER} replace />;
      } else {
        return <Navigate to={PATHS.RESTAURANT} replace />;
      }
    }

    return <>{children}</>;
  }
);

export default RoleGuard;
