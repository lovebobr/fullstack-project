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
  max-width: 500px;
  margin: 40px auto;
  padding: 0 20px;
  font-family: system-ui, Avenir, Helvetica, Arial, sans-serif;
`;

export const SuccessModal = styled.div`
  background: white;
  border-radius: 20px;
  padding: 40px 30px;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  animation: ${fadeIn} 0.6s ease-out;
  border: 1px solid #e8e8e8;
`;

export const SuccessIcon = styled.div`
  width: 80px;
  height: 80px;
  margin: 0 auto 25px;
  background: linear-gradient(135deg, #4caf50, #45a049);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  &::before {
    content: "";
    width: 40px;
    height: 20px;
    border: 4px solid white;
    border-top: none;
    border-right: none;
    transform: rotate(-45deg);
    position: absolute;
    top: 22px;
    left: 20px;
  }
`;

export const AnimatedCheckmark = styled.svg`
  width: 80px;
  height: 80px;
  margin: 0 auto 25px;

  .checkmark__circle {
    stroke-dasharray: 166;
    stroke-dashoffset: 166;
    stroke-width: 2;
    stroke-miterlimit: 10;
    stroke: #4caf50;
    fill: none;
    animation: ${checkmarkAnimation} 0.6s ease-in-out forwards;
  }

  .checkmark__check {
    transform-origin: 50% 50%;
    stroke-dasharray: 48;
    stroke-dashoffset: 48;
    animation: ${checkmarkAnimation} 0.3s ease-in-out 0.6s forwards;
    stroke: #4caf50;
    stroke-width: 3;
  }
`;

export const Title = styled.h1`
  color: #2e7d32;
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 15px;
`;

export const Subtitle = styled.p`
  color: #666;
  font-size: 16px;
  line-height: 1.5;
  margin-bottom: 30px;
`;

export const PaymentDetails = styled.div`
  background: #f8f9fa;
  border-radius: 12px;
  padding: 25px;
  margin: 25px 0;
  text-align: left;
`;

export const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e8e8e8;

  &:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
  }
`;

export const DetailLabel = styled.span`
  font-weight: 600;
  color: #555;
  font-size: 14px;
`;

export const DetailValue = styled.span`
  color: #333;
  font-size: 14px;
  font-weight: 500;
`;

export const AmountHighlight = styled.div`
  background: linear-gradient(135deg, #4caf50, #45a049);
  color: white;
  padding: 20px;
  border-radius: 12px;
  margin: 25px 0;
  font-size: 24px;
  font-weight: 700;
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 30px;
`;

export const PrimaryButton = styled.button`
  flex: 1;
  padding: 16px;
  background: linear-gradient(135deg, #4caf50, #45a049);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(76, 175, 80, 0.3);
  }
`;

export const SecondaryButton = styled.button`
  flex: 1;
  padding: 16px;
  background: transparent;
  color: #4caf50;
  border: 2px solid #4caf50;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #4caf50;
    color: white;
    transform: translateY(-2px);
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
