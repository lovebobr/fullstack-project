import styled from "styled-components";

export const Container = styled.div`
  max-width: 1080px;
  margin: 30px auto;
  padding: 0 20px;
  font-family: system-ui, Avenir, Helvetica, Arial, sans-serif;
`;

export const Header = styled.div`
  text-align: center;
  margin-bottom: 30px;
`;

export const MainTitle = styled.h1`
  color: var(--color-text);
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 8px;
  background: linear-gradient(135deg, var(--color-primary), #667eea);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

export const Subtitle = styled.p`
  color: #6c757d;
  font-size: 16px;
  font-weight: 400;
`;

export const TwoColumnLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  margin-bottom: 25px;
  align-items: start;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

// Стили для информации о заказе
export const OrderSummary = styled.div`
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 16px;
  padding: 25px;
  border: 1px solid rgba(0, 123, 255, 0.1);
  position: relative;
  overflow: hidden;
  height: fit-content;
`;

export const OrderHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
`;

export const OrderIcon = styled.div`
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, var(--color-primary), #667eea);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 18px;
`;

export const OrderTitle = styled.h3`
  color: var(--color-text);
  font-size: 18px;
  font-weight: 600;
  margin: 0;
`;

export const OrderGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
`;

export const OrderItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const OrderLabel = styled.span`
  font-size: 12px;
  color: #6c757d;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const OrderValue = styled.span`
  font-size: 14px;
  color: var(--color-text);
  font-weight: 600;
`;

export const OrderTotal = styled.div`
  grid-column: 1 / -1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 15px;
  margin-top: 15px;
  border-top: 2px dashed #dee2e6;
`;

export const TotalLabel = styled.span`
  font-size: 16px;
  color: var(--color-text);
  font-weight: 600;
`;

export const TotalAmount = styled.span`
  font-size: 20px;
  color: var(--color-primary);
  font-weight: 700;
`;

// Колонка с картой
export const CardColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

export const InteractivePaymentCard = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 25px;
  color: white;
  position: relative;
  overflow: hidden;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  width: 100%;
  max-width: 300px;
`;

export const CardBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
`;

export const CardContent = styled.div`
  position: relative;
  z-index: 2;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
`;

export const CardTitle = styled.h2`
  font-size: 16px;
  font-weight: 600;
  opacity: 0.95;
  color: white;
`;

export const CardChip = styled.div`
  width: 35px;
  height: 25px;
  background: linear-gradient(135deg, #ffd700, #ffed4e);
  border-radius: 4px;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    top: 4px;
    left: 4px;
    right: 4px;
    bottom: 4px;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 2px;
  }
`;

export const CardNumberSection = styled.div`
  margin: 15px 0;
`;

export const CardNumberInput = styled.input`
  background: transparent;
  border: none;
  color: white;
  font-size: 18px;
  letter-spacing: 2px;
  font-family: "Courier New", monospace;
  font-weight: 500;
  width: 100%;
  text-align: center;
  outline: none;
  padding: 8px 0;

  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }

  &:focus {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 6px;
  }
`;

export const CardDetailsSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
`;

export const CardDetailGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const CardDetailLabel = styled.div`
  font-size: 10px;
  opacity: 0.8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const CardDetailInput = styled.input`
  background: transparent;
  border: none;
  color: white;
  font-size: 14px;
  font-family: "Courier New", monospace;
  font-weight: 500;
  outline: none;
  padding: 6px 8px;
  border-radius: 4px;
  width: 100%;

  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }

  &:focus {
    background: rgba(255, 255, 255, 0.15);
  }
`;

export const ExpiryInput = styled(CardDetailInput)`
  width: 60px;
  text-align: center;
`;

export const CvcInput = styled(CardDetailInput)`
  width: 45px;
  text-align: center;
`;

export const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0;
  padding: 0;
`;

export const Checkbox = styled.input`
  width: 16px;
  height: 16px;
  border-radius: 3px;
`;

export const CheckboxLabel = styled.label`
  font-size: 14px;
  color: var(--color-text);
  font-weight: 400;
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-start;
`;

export const Button = styled.button`
  padding: 16px 40px;
  background: linear-gradient(135deg, var(--color-primary), #667eea);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 123, 255, 0.3);
  position: relative;
  overflow: hidden;
  width: auto;
  min-width: 200px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 123, 255, 0.4);
  }

  &:disabled {
    background: var(--color-disabled);
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: left 0.5s;
  }

  &:hover::before {
    left: 100%;
  }
`;
