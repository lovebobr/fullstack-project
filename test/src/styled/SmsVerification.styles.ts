import styled from "styled-components";
export const Container = styled.div`
  max-width: 480px;
  margin: 40px auto;
  padding: 20px;
  font-family: system-ui, Avenir, Helvetica, Arial, sans-serif;
`;

export const VerificationCard = styled.div`
  background: var(--color-bg-form);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

export const Title = styled.h1`
  color: var(--color-text);
  margin-bottom: 15px;
  font-size: 24px;
  font-weight: 600;
`;

export const Subtitle = styled.p`
  color: var(--color-text);
  margin-bottom: 30px;
  font-size: 16px;
  opacity: 0.8;
  line-height: 1.5;
`;

export const PaymentInfo = styled.div`
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  margin: 20px 0;
  text-align: left;
`;

export const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const InfoLabel = styled.span`
  font-weight: 600;
  color: var(--color-text);
  font-size: 14px;
`;

export const InfoValue = styled.span`
  color: #6c757d;
  font-size: 14px;
`;

export const CodeDisplay = styled.div`
  background: #f8f9fa;
  border: 2px dashed #dee2e6;
  border-radius: 8px;
  padding: 25px;
  margin: 30px 0;
`;

export const CodeLabel = styled.div`
  font-size: 14px;
  color: #6c757d;
  margin-bottom: 10px;
`;

export const GeneratedCode = styled.div`
  font-size: 42px;
  font-weight: bold;
  color: var(--color-primary);
  letter-spacing: 8px;
  font-family: "Courier New", monospace;
`;

export const Instruction = styled.div`
  font-size: 14px;
  color: #6c757d;
  margin-top: 15px;
`;

export const InputContainer = styled.div`
  margin: 30px 0;
`;

export const InputLabel = styled.label`
  display: block;
  margin-bottom: 15px;
  font-weight: 600;
  color: var(--color-text);
  font-size: 16px;
`;

export const SmsInput = styled.input`
  font-size: 32px;
  width: 150px;
  text-align: center;
  letter-spacing: 10px;
  padding: 20px;
  border: 2px solid var(--color-border);
  border-radius: 8px;
  margin: 0 auto;
  display: block;

  &:focus {
    border-color: var(--color-primary);
    outline: none;
  }
`;

export const Button = styled.button`
  width: 100%;
  padding: 16px;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 20px;

  &:hover {
    background: var(--color-primary-hover);
  }

  &:disabled {
    background: var(--color-disabled);
    cursor: not-allowed;
  }
`;

export const Timer = styled.div`
  font-size: 14px;
  color: #6c757d;
  margin-top: 15px;
`;

export const ResendLink = styled.button`
  background: none;
  border: none;
  color: var(--color-primary);
  cursor: pointer;
  font-size: 14px;
  margin-top: 10px;

  &:hover {
    text-decoration: underline;
  }

  &:disabled {
    color: var(--color-disabled);
    cursor: not-allowed;
  }
`;