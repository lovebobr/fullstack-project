import styled from "styled-components";

export const Container = styled.div`
  /* Стандартный системный шрифт для всего контейнера */
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #1a1a1a;
  color: #ffffff;
  padding: 2rem;
  margin: 0 auto;
`;

export const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

export const MainTitle = styled.h1`
  /* Isadora Cyr только для заголовков */
  font-family: "Isadora Cyr", Georgia, "Times New Roman", Times, serif;
  font-style: italic; /* Курсив */
  font-size: 2.5rem;
  font-weight: normal;
  color: #ffffff;
  margin-bottom: 1rem;
  letter-spacing: 1px;
`;

export const Subtitle = styled.p`
  /* Стандартный шрифт для текста */
  font-family: inherit;
  font-size: 1.2rem;
  color: #cccccc;
  opacity: 0.9;
`;

export const TwoColumnLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  margin-bottom: 3rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

export const OrderSummary = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 2rem;
  border: 1px solid rgba(255, 149, 0, 0.1);
`;

export const OrderHeader = styled.div`
  margin-bottom: 2rem;
`;

export const OrderTitle = styled.h2`
  /* Isadora Cyr только для заголовков */
  font-family: "Isadora Cyr", Georgia, "Times New Roman", Times, serif;
  font-style: italic; /* Курсив */
  font-size: 1.8rem;
  font-weight: normal;
  color: #ffffff;
  letter-spacing: 1px;
`;

export const OrderGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
`;

export const OrderItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const OrderLabel = styled.div`
  /* Стандартный шрифт для текста */
  font-family: inherit;
  font-size: 0.95rem;
  color: #cccccc;
  opacity: 0.8;
`;

export const OrderValue = styled.div`
  /* Стандартный шрифт для текста */
  font-family: inherit;
  font-size: 1.1rem;
  color: #ffffff;
  font-weight: 500;
`;

export const OrderTotal = styled.div`
  grid-column: span 2;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1.5rem;
  margin-top: 1.5rem;
  border-top: 1px solid rgba(255, 149, 0, 0.2);
`;

export const TotalLabel = styled.div`
  /* Стандартный шрифт для текста */
  font-family: inherit;
  font-size: 1.2rem;
  color: #ffffff;
  font-weight: 500;
`;

export const TotalAmount = styled.div`
  /* Стандартный шрифт для текста */
  font-family: inherit;
  font-size: 2rem;
  color: #ff9500;
  font-weight: 500;
`;

export const CardColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

export const InteractivePaymentCard = styled.div`
  position: relative;
  background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%);
  border-radius: 16px;
  padding: 2rem;
  min-height: 250px;
  border: 1px solid rgba(255, 149, 0, 0.2);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  overflow: hidden;
`;

export const CardBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(
    circle at 30% 20%,
    rgba(255, 149, 0, 0.1) 0%,
    transparent 70%
  );
  z-index: 1;
`;

export const CardContent = styled.div`
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  height: 100%;
`;

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

export const CardTitle = styled.div`
  /* Стандартный шрифт для текста (это не заголовок h1-h6) */
  font-family: inherit;
  font-size: 1.5rem;
  color: #ffffff;
  font-weight: 500;
  letter-spacing: 2px;
`;

export const CardChip = styled.div`
  width: 50px;
  height: 40px;
  background: linear-gradient(135deg, #ff9500 0%, #ffaa33 100%);
  border-radius: 8px;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 70%;
    height: 60%;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 4px;
  }
`;

export const CardNumberSection = styled.div`
  margin-bottom: 2rem;
`;

export const CardNumberInput = styled.input`
  /* Стандартный шрифт для ввода */
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
  width: 100%;
  background: transparent;
  border: none;
  color: #ffffff;
  font-size: 1.5rem;
  letter-spacing: 3px;
  outline: none;
  padding: 0.5rem 0;

  &::placeholder {
    color: rgba(255, 255, 255, 0.3);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const CardDetailsSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-top: auto;
`;

export const CardDetailGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const CardDetailLabel = styled.div`
  /* Стандартный шрифт для текста */
  font-family: inherit;
  font-size: 0.9rem;
  color: #cccccc;
  opacity: 0.8;
`;

export const ExpiryInput = styled.input`
  /* Стандартный шрифт для ввода */
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 149, 0, 0.3);
  border-radius: 6px;
  color: #ffffff;
  font-size: 1.2rem;
  padding: 0.8rem;
  width: 60px;
  text-align: center;
  outline: none;
  transition: all 0.3s;

  &:focus {
    border-color: #ff9500;
    box-shadow: 0 0 10px rgba(255, 149, 0, 0.3);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.3);
  }
`;

export const CvcInput = styled.input`
  /* Стандартный шрифт для ввода */
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 149, 0, 0.3);
  border-radius: 6px;
  color: #ffffff;
  font-size: 1.2rem;
  padding: 0.8rem;
  width: 80px;
  text-align: center;
  outline: none;
  transition: all 0.3s;

  &:focus {
    border-color: #ff9500;
    box-shadow: 0 0 10px rgba(255, 149, 0, 0.3);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.3);
  }
`;

export const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
`;

export const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  accent-color: #ff9500;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 2rem;
`;

export const Button = styled.button`
  /* Стандартный шрифт для кнопок */
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
  background-color: #ff9500;
  color: #1a1a1a;
  border: none;
  padding: 1.2rem 3rem;
  font-size: 1.2rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  border-radius: 30px;
  min-width: 250px;

  &:hover:not(:disabled) {
    background-color: #ffaa33;
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(255, 149, 0, 0.3);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background-color: #666;
  }
`;

export const ErrorMessage = styled.div`
  font-family: inherit;
  background-color: rgba(255, 68, 68, 0.1);
  color: #ff4444;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  border-left: 4px solid #ff4444;
  font-size: 1rem;
`;
