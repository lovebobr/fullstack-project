import { Link } from "react-router-dom";
import townImg from "../assets/town.jpg";
import bachground from "../assets/bachground.jpg";
import styled from "styled-components";

export const PageWrapper = styled.div`
  min-height: 100vh;

  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const FormWrapper = styled.div`
  background: var(--color-bg-form);
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 400px;
  text-align: center;
`;

export const Title = styled.h1`
  margin-bottom: 20px;
  font-family: "Arial", sans-serif;
  color: var(--color-text);
  font-size: 26px;
`;

export const Input = styled.input`
  width: 100%;
  padding: 12px 15px;
  margin-bottom: 20px;
  box-sizing: border-box;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  font-size: 16px;
  transition: all 0.3s;
  &:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 8px rgba(0, 123, 255, 0.3);
  }
`;

export const Button = styled.button<{ disabled?: boolean }>`
  width: 100%;
  padding: 12px 15px;
  margin-bottom: 20px;
  background-color: ${({ disabled }) =>
    disabled ? "var(--color-disabled)" : "var(--color-primary)"};
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 16px;
  font-weight: bold;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  transition: all 0.3s;
  &:hover {
    transform: ${({ disabled }) => (disabled ? "none" : "translateY(-2px)")};
    box-shadow: ${({ disabled }) =>
      disabled ? "none" : "0 5px 15px rgba(0, 0, 0, 0.2)"};
  }
`;

export const StyledLink = styled(Link)`
  color: var(--color-primary);
  text-decoration: none;
  font-size: 14px;
  &:hover {
    text-decoration: underline;
  }
`;

export const ErrorText = styled.div`
  color: var(--color-error);
  font-size: 14px;
  margin-bottom: 10px;
`;

export const InputError = styled(Input)<{ $hasError?: boolean }>`
  border-color: ${(props) =>
    props.$hasError ? "var(--color-error)" : "var(--color-border)"};

  &:focus {
    border-color: ${(props) =>
      props.$hasError ? "var(--color-error)" : "var(--color-primary)"};
    box-shadow: ${(props) =>
      props.$hasError
        ? "0 0 8px rgba(255, 0, 0, 0.3)"
        : "0 0 8px rgba(0, 123, 255, 0.3)"};
  }
`;

export const FieldError = styled(ErrorText)`
  text-align: left;
  margin: -15px 0 15px 0;
  font-size: 12px;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
`;
