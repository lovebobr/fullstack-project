import { useNavigate, useLocation } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { authStore } from "../store/auth.store";
import styled from "styled-components";
import { LogOut, LogIn, ArrowLeft, Home } from "lucide-react";
import { PATHS } from "../../paths";

const LayoutWrapper = styled.div`
  position: relative;
  min-height: 100vh;
  background: var(--color-bg);
  font-family: Arial, sans-serif;
`;

const BackButton = styled.button`
  position: absolute;
  top: 20px;
  left: 20px;
  display: inline-flex;
  align-items: center;
  padding: 8px 12px;
  font-size: 14px;
  font-weight: bold;
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: var(--color-primary-hover);
  }
`;

const HomeButton = styled(BackButton)`
  background-color: var(--color-secondary);
  
  &:hover {
    background-color: var(--color-secondary-hover);
  }
`;

const ActionWrapper = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  display: flex;
  align-items: center;
  cursor: pointer;
  font-weight: bold;
  font-size: 14px;
  z-index: 1000;

  background: none;
  border: none;
  color: var(--color-text);

  &:hover {
    color: var(--color-primary);
  }

  svg {
    margin-right: 5px;
  }
`;

const ContentWrapper = styled.div`
  max-width: 90%;
  margin: 0 auto;
  padding: 50px 20px 20px;
`;

const AppLayout: React.FC<{ children: React.ReactNode }> = observer(
  ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
      authStore.logout();
      navigate(PATHS.LOGIN, { replace: true });
    };

    const handleLogin = () => {
      sessionStorage.setItem('returnUrl', location.pathname + location.search);
      navigate(PATHS.LOGIN);
    };

    const handleBack = () => {
      const returnUrl = sessionStorage.getItem('returnUrl');
      
      if (returnUrl && returnUrl !== PATHS.LOGIN) {
        sessionStorage.removeItem('returnUrl');
        navigate(returnUrl);
      } else if (location.pathname === PATHS.LOGIN) {
        navigate(PATHS.HOME);
      } else {
        navigate(-1);
      }
    };

    const handleGoHome = () => {
      navigate(PATHS.HOME);
    };

    const showBackButton = location.pathname !== PATHS.USER && 
      authStore.user?.role !== "manager" && 
      location.pathname !== PATHS.HOME;

    const showHomeButton = location.pathname !== PATHS.HOME && 
      location.pathname !== PATHS.USER && 
      authStore.user?.role !== "manager";

    return (
      <LayoutWrapper>
        {showBackButton && (
          <BackButton onClick={handleBack}>
            <ArrowLeft size={16} /> Назад
          </BackButton>
        )}
        
        {showHomeButton && !showBackButton && (
          <HomeButton onClick={handleGoHome}>
            <Home size={16} /> Домой
          </HomeButton>
        )}

        {authStore.isAuthenticated ? (
          <ActionWrapper onClick={handleLogout}>
            <LogOut size={16} /> Выйти
          </ActionWrapper>
        ) : (
          <ActionWrapper onClick={handleLogin}>
            <LogIn size={16} /> Войти
          </ActionWrapper>
        )}

        <ContentWrapper>{children}</ContentWrapper>
      </LayoutWrapper>
    );
  }
);

export default AppLayout;