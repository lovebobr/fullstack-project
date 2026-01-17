import styled from "styled-components";

export const Container = styled.div`
  max-width: 480px;
  margin: 2rem auto;
  padding: 1rem;
  /* Стандартный системный шрифт для всего контейнера */
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
`;

export const VerificationCard = styled.div`
  background: rgba(26, 26, 26, 0.8); /* Темный фон как в других компонентах */
  border: 1px solid rgba(255, 149, 0, 0.2); /* Оранжевая граница */
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3); /* Тень как в других компонентах */
  text-align: center;
  backdrop-filter: blur(10px);
`;

export const Title = styled.h1`
  /* Isadora Cyr только для заголовков */
  font-family: "Isadora Cyr", Georgia, "Times New Roman", Times, serif;
  font-style: italic; /* Курсив */
  color: #ffffff; /* Белый текст */
  margin-bottom: 1rem;
  font-size: 1.8rem;
  font-weight: normal;
  letter-spacing: 1px;
`;

export const Subtitle = styled.p`
  color: #cccccc; /* Светло-серый как в других компонентах */
  margin-bottom: 2rem;
  font-size: 1rem;
  opacity: 0.9;
  line-height: 1.6;
`;

export const PaymentInfo = styled.div`
  background: rgba(255, 255, 255, 0.05); /* Темный фон с прозрачностью */
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 1.5rem;
  margin: 1.5rem 0;
  text-align: left;
`;

export const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const InfoLabel = styled.span`
  font-weight: 600;
  color: #ffffff; /* Белый текст */
  font-size: 0.9rem;
`;

export const InfoValue = styled.span`
  color: #ff9500; /* Оранжевый акцент как в других компонентах */
  font-size: 0.9rem;
  font-weight: 500;
`;

export const CodeDisplay = styled.div`
  background: rgba(255, 149, 0, 0.1); /* Оранжевый фон с прозрачностью */
  border: 2px dashed rgba(255, 149, 0, 0.3); /* Оранжевая пунктирная граница */
  border-radius: 8px;
  padding: 1.5rem;
  margin: 2rem 0;
`;

export const CodeLabel = styled.div`
  font-size: 0.9rem;
  color: #ff9500; /* Оранжевый цвет */
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

export const GeneratedCode = styled.div`
  font-size: 2.5rem;
  font-weight: bold;
  color: #ffffff; /* Белый текст */
  letter-spacing: 0.5rem;
  font-family: "Courier New", monospace;
`;

export const Instruction = styled.div`
  font-size: 0.85rem;
  color: #ababab; /* Серый текст */
  margin-top: 1rem;
  font-style: italic;
`;

export const InputContainer = styled.div`
  margin: 2rem 0;
`;

export const InputLabel = styled.label`
  display: block;
  margin-bottom: 1rem;
  font-weight: 600;
  color: #ffffff; /* Белый текст */
  font-size: 1rem;
`;

export const SmsInput = styled.input`
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
  font-size: 2rem;
  width: 180px;
  text-align: center;
  letter-spacing: 0.5rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05); /* Темный фон */
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: #ffffff; /* Белый текст */
  margin: 0 auto;
  display: block;
  transition: all 0.3s;

  &:focus {
    border-color: #ff9500; /* Оранжевая граница при фокусе */
    outline: none;
    box-shadow: 0 0 0 3px rgba(255, 149, 0, 0.1);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.3);
  }
`;

export const Button = styled.button`
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
  width: 100%;
  padding: 1rem;
  background: #ff9500; /* Оранжевый фон как в других кнопках */
  color: #1a1a1a; /* Темный текст */
  border: none;
  border-radius: 25px; /* Скругленные углы как в других кнопках */
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 1.5rem;

  &:hover:not(:disabled) {
    background: #ffaa33;
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(255, 149, 0, 0.3);
  }

  &:disabled {
    background: #666;
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

export const ResendLink = styled.button`
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
  background: transparent;
  border: none;
  color: #ff9500; /* Оранжевый цвет */
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  margin-top: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  transition: all 0.3s;

  &:hover:not(:disabled) {
    background: rgba(255, 149, 0, 0.1);
    text-decoration: none;
  }

  &:disabled {
    color: #666;
    cursor: not-allowed;
    opacity: 0.5;
  }
`;
