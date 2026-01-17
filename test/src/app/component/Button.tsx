import React from "react";
import styled from "styled-components";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "outline";
  fullWidth?: boolean;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = "outline",
  fullWidth = false,
  disabled = false,
  type = "button",
}) => {
  return (
    <StyledButton
      onClick={onClick}
      $variant={variant}
      $fullWidth={fullWidth}
      disabled={disabled}
      type={type}
    >
      {children}
    </StyledButton>
  );
};

const StyledButton = styled.button<{
  $variant: string;
  $fullWidth: boolean;
}>`
  background-color: ${(props) => {
    switch (props.$variant) {
      case "primary":
        return "#ff9500";
      case "secondary":
        return "#1a1a1a";
      default:
        return "transparent";
    }
  }};
  color: ${(props) => {
    switch (props.$variant) {
      case "primary":
        return "#ffffff";
      case "secondary":
        return "#ffffff";
      default:
        return "#ff9500";
    }
  }};
  border: 2px solid
    ${(props) => {
      switch (props.$variant) {
        case "primary":
          return "#ff9500";
        case "secondary":
          return "#1a1a1a";
        default:
          return "#ff9500";
      }
    }};
  padding: ${(props) =>
    props.$variant === "outline" ? "0.5rem 1rem" : "0.8rem 2rem"};
  font-size: 0.85rem;
  font-weight: normal;
  cursor: pointer;
  transition: all 0.3s;
  /* Стандартный системный шрифт для кнопок */
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
  border-radius: 25px;
  min-width: ${(props) => (props.$variant === "outline" ? "160px" : "auto")};
  width: ${(props) => (props.$fullWidth ? "100%" : "auto")};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover:not(:disabled) {
    background-color: ${(props) => {
      switch (props.$variant) {
        case "primary":
          return "#ffaa33";
        case "secondary":
          return "#333333";
        default:
          return "rgba(255, 149, 0, 0.1)";
      }
    }};
    border-color: ${(props) => {
      switch (props.$variant) {
        case "primary":
          return "#ffaa33";
        case "secondary":
          return "#333333";
        default:
          return "#ffaa33";
      }
    }};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export default Button;
