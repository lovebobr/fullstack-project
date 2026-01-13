// components/Loader.tsx
import React from "react";
import styled, { keyframes } from "styled-components";

interface LoaderProps {
  text?: string;
  size?: number;
}

export const Loader: React.FC<LoaderProps> = ({
  text = "Загрузка...",
  size = 48,
}) => {
  return (
    <LoaderContainer>
      <Spinner size={size}>
        <div className="spinner-circle"></div>
      </Spinner>
      <LoadingText>{text}</LoadingText>
    </LoaderContainer>
  );
};

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const LoaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
  padding: 3rem;
  background-color: rgba(26, 26, 26, 0.9);
  border-radius: 15px;
  border: 1px solid rgba(255, 149, 0, 0.3);
`;

const Spinner = styled.div<{ size: number }>`
  position: relative;
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;

  .spinner-circle {
    position: absolute;
    width: 100%;
    height: 100%;
    border: 4px solid transparent;
    border-top: 4px solid #ff9500;
    border-right: 4px solid #ff9500;
    border-radius: 50%;
    animation: ${spin} 1s linear infinite;
  }
`;

const LoadingText = styled.p`
  font-size: 1.2rem;
  color: #cccccc;
  margin: 0;
  font-family: "Isadora Cyr", system-ui, Avenir, Helvetica, Arial, sans-serif;
`;
