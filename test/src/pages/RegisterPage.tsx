import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { authStore } from "../app/store/auth.store";
import { useNavigate } from "react-router-dom";
import { runInAction } from "mobx";
import { PATHS } from "../paths";
import {
  PageWrapper,
  FormWrapper,
  Title,
  Input,
  Button,
  StyledLink,
  ErrorText,
} from "../styled/Auth.styles";

const RegisterPage = observer(() => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    return () => {
      runInAction(() => {
        authStore.error = null;
      });
    };
  }, []);

  const handleRegister = async () => {
    let nameErr = "";
    let emailErr = "";
    let passwordErr = "";

    if (!name) nameErr = "Введите имя";
    if (!email) emailErr = "Введите email";
    if (!password) passwordErr = "Введите пароль";

    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        emailErr = "Некорректный email";
      }
    }

    if (password && password.length < 8) {
      passwordErr = "Пароль должен быть не менее 8 символов";
    }

    setNameError(nameErr);
    setEmailError(emailErr);
    setPasswordError(passwordErr);

    if (nameErr || emailErr || passwordErr) return;

    try {
      await authStore.register(name, email, password);
      if (!authStore.error) {
        setNameError("");
        setEmailError("");
        setPasswordError("");
        navigate(PATHS.HOME);
      }
    } catch (error) {
      console.error("Ошибка регистрации", error);
    }
  };

  return (
    <PageWrapper>
      <FormWrapper>
        <Title>Регистрация</Title>
        {authStore.error && <ErrorText>{authStore.error}</ErrorText>}

        <Input
          type="text"
          placeholder="Имя"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {nameError && <ErrorText>{nameError}</ErrorText>}

        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {emailError && <ErrorText>{emailError}</ErrorText>}

        <Input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {passwordError && <ErrorText>{passwordError}</ErrorText>}

        <Button onClick={handleRegister} disabled={authStore.loading}>
          {authStore.loading ? "Загрузка..." : "Зарегистрироваться"}
        </Button>
        <StyledLink to={PATHS.LOGIN}>Есть аккаунта? Войдите</StyledLink>
      </FormWrapper>
    </PageWrapper>
  );
});

export default RegisterPage;
