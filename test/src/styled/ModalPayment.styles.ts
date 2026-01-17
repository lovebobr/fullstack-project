import styled, { keyframes } from "styled-components";

export const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

export const checkmarkAnimation = keyframes`
  0% {
    stroke-dashoffset: 100;
  }
  100% {
    stroke-dashoffset: 0;
  }
`;

export const Container = styled.div`
  padding: 0 30rem;
  /* Стандартный системный шрифт для всего контейнера */
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
  background-color: #1a1a1a; /* Темный фон */
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const SuccessModal = styled.div`
  background: rgba(26, 26, 26, 0.95); /* Темный фон */
  border-radius: 20px;
  padding: 2.5rem 2rem;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  animation: ${fadeIn} 0.6s ease-out;
  border: 1px solid rgba(255, 149, 0, 0.2); /* Оранжевая граница */
  backdrop-filter: blur(10px);
  width: 100%;
`;

export const SuccessIcon = styled.div`
  width: 100px;
  height: 100px;
  margin: 0 auto 2rem;
  background: linear-gradient(
    135deg,
    #ff9500,
    #e67e22
  ); /* Оранжевый градиент */
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  box-shadow: 0 10px 30px rgba(255, 149, 0, 0.3);

  &::before {
    content: "";
    width: 45px;
    height: 25px;
    border: 4px solid #ffffff; /* Белая галочка на оранжевом фоне */
    border-top: none;
    border-right: none;
    transform: rotate(-45deg);
    position: absolute;
    top: 27px;
    left: 27px;
  }
`;

export const AnimatedCheckmark = styled.svg`
  width: 100px;
  height: 100px;
  margin: 0 auto 2rem;

  .checkmark__circle {
    stroke-dasharray: 166;
    stroke-dashoffset: 166;
    stroke-width: 2;
    stroke-miterlimit: 10;
    stroke: #ff9500; /* Оранжевый цвет круга */
    fill: none;
    animation: ${checkmarkAnimation} 0.6s ease-in-out forwards;
  }

  .checkmark__check {
    transform-origin: 50% 50%;
    stroke-dasharray: 48;
    stroke-dashoffset: 48;
    animation: ${checkmarkAnimation} 0.3s ease-in-out 0.6s forwards;
    stroke: #ffffff; /* Белая галочка */
    stroke-width: 3;
  }
`;

export const Title = styled.h1`
  /* Isadora Cyr только для заголовков */
  font-family: "Isadora Cyr", Georgia, "Times New Roman", Times, serif;
  font-style: italic; /* Курсив */
  color: #ff9500; /* Оранжевый цвет */
  font-size: 2rem;
  font-weight: normal;
  margin-bottom: 1rem;
  letter-spacing: 1px;
  text-shadow: 0 0 10px rgba(255, 149, 0, 0.3);
`;

export const Subtitle = styled.p`
  color: #cccccc; /* Светло-серый текст */
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  opacity: 0.9;
`;

export const PaymentDetails = styled.div`
  background: rgba(255, 255, 255, 0.05); /* Темный фон с прозрачностью */
  border-radius: 12px;
  padding: 1.5rem;
  margin: 1.5rem 0;
  text-align: left;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

export const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  &:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
  }
`;

export const DetailLabel = styled.span`
  font-weight: 600;
  color: #ababab; /* Серый текст */
  font-size: 0.9rem;
`;

export const DetailValue = styled.span`
  color: #ffffff; /* Белый текст */
  font-size: 0.9rem;
  font-weight: 500;
`;

export const AmountHighlight = styled.div`
  background: linear-gradient(
    135deg,
    #ff9500,
    #e67e22
  ); /* Оранжевый градиент */
  color: #ffffff; /* Белый текст */
  padding: 1.5rem;
  border-radius: 12px;
  margin: 1.5rem 0;
  font-size: 1.8rem;
  font-weight: 700;
  border: 2px solid rgba(255, 149, 0, 0.3);
  box-shadow: 0 10px 20px rgba(255, 149, 0, 0.2);
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
`;

export const PrimaryButton = styled.button`
  /* Стандартный шрифт для кнопок */
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
  flex: 1;
  padding: 1rem;
  background: linear-gradient(
    135deg,
    #ff9500,
    #e67e22
  ); /* Оранжевый градиент */
  color: #ffffff; /* Белый текст */
  border: none;
  border-radius: 25px; /* Скругленные углы */
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(255, 149, 0, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background: #666666;
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

export const SecondaryButton = styled.button`
  /* Стандартный шрифт для кнопок */
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
  flex: 1;
  padding: 1rem;
  background: transparent;
  color: #ff9500; /* Оранжевый цвет */
  border: 2px solid #ff9500;
  border-radius: 25px; /* Скругленные углы */
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    background: rgba(255, 149, 0, 0.1);
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(255, 149, 0, 0.2);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    color: #666666;
    border-color: #666666;
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

export const Confetti = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1000;
`;
