import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { authStore } from "../app/store/auth.store";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../paths";
import { runInAction } from "mobx";
import {
  PageWrapper,
  FormWrapper,
  Title,
  InputError,
  Button,
  StyledLink,
  ErrorText,
  FieldError,
  Form,
} from "../styled/Auth.styles";

const LoginPage = observer(() => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (authStore.isAuthenticated && authStore.user && !authStore.loading) {
      handleRedirect();
    }
  }, [authStore.isAuthenticated, authStore.user, authStore.loading]);

  useEffect(() => {
    return () => {
      runInAction(() => {
        authStore.error = null;
      });
    };
  }, []);

  const validateForm = (): boolean => {
    let isValid = true;

    if (!email) {
      setEmailError("Введите email");
      isValid = false;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setEmailError("Некорректный email");
        isValid = false;
      }
    }

    if (!password) {
      setPasswordError("Введите пароль");
      isValid = false;
    }

    return isValid;
  };

  const handleRedirect = () => {
    if (!authStore.user) return;

    const userRole = authStore.user.role;
    let redirectPath = PATHS.RESTAURANT;

    switch (userRole) {
      case "admin":
      case "manager":
        redirectPath = PATHS.MANAGER;
        break;
      case "user":
        redirectPath = PATHS.RESTAURANT;
        break;
      default:
        console.warn(`Unknown role: ${userRole}, redirecting to USER`);
        redirectPath = PATHS.RESTAURANT;
    }

    console.log(`🔄 Redirecting ${userRole} to ${redirectPath}`);
    navigate(redirectPath);
    // { replace: true }
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setEmailError("");
    setPasswordError("");
    runInAction(() => {
      authStore.error = null;
    });

    setIsLoggingIn(true);

    try {
      await authStore.login(email, password);

      // После успешного логина проверяем состояние
      if (authStore.isAuthenticated && authStore.user) {
        handleRedirect();
      }
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  // Если идет загрузка или пользователь уже авторизован - показываем лоадер
  if (authStore.loading && authStore.token) {
    return (
      <PageWrapper>
        <FormWrapper>
          <div>Проверка авторизации...</div>
        </FormWrapper>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <FormWrapper>
        <Title>Вход</Title>

        {authStore.error && <ErrorText>{authStore.error}</ErrorText>}

        <Form onKeyPress={handleKeyPress}>
          <InputError
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailError("");
            }}
            $hasError={!!emailError}
          />
          {emailError && <FieldError>{emailError}</FieldError>}

          <InputError
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setPasswordError("");
            }}
            $hasError={!!passwordError}
          />
          {passwordError && <FieldError>{passwordError}</FieldError>}

          <Button
            onClick={handleLogin}
            disabled={authStore.loading || isLoggingIn}
          >
            {authStore.loading || isLoggingIn ? "Вход..." : "Войти"}
          </Button>
        </Form>

        <StyledLink to={PATHS.REGISTER}>
          Нет аккаунта? Зарегистрируйтесь
        </StyledLink>
      </FormWrapper>
    </PageWrapper>
  );
});

export default LoginPage;
