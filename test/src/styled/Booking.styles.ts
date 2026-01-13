// styled/booking-style.ts
import styled from "styled-components";

export const BookingContainer = styled.div`
  font-family: "Isadora Cyr", system-ui, Avenir, Helvetica, Arial, sans-serif;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #1a1a1a;
  color: #ffffff;
`;

export const BookingContent = styled.main`
  flex: 1;
  margin: 0 auto;
  width: 100%;
  max-width: 1400px;
  padding: 2rem;
`;

export const PageHeader = styled.div`
  margin-bottom: 3rem;
  text-align: center;
`;

export const PageTitle = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  font-weight: normal;
  color: #ffffff;
  letter-spacing: 1px;
`;

export const PageSubtitle = styled.p`
  font-size: 1.1rem;
  color: #cccccc;
  max-width: 600px;
  margin: 0 auto 2rem;
  line-height: 1.6;
`;

export const BookingGrid = styled.div`
  display: grid;
  justify-content: center;
  grid-template-columns: 1fr 400px;
  gap: 2.5rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    height: auto;
  }
`;

export const MapContainer = styled.div`
  background-color: #2d2d2d;
  border-radius: 8px;
  padding: 1.5rem;
  border: 1px solid #444;
  display: flex;
  flex-direction: column;
`;

export const MapHeader = styled.div`
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const MapTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: normal;
  color: #ffffff;
  margin: 0;
`;

export const Legend = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

export const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #cccccc;
`;

export const LegendColor = styled.div<{ color: string }>`
  width: 12px;
  height: 12px;
  background-color: ${(props) => props.color};
  border-radius: 2px;
`;

export const MapWrapper = styled.div`
  flex: 1;
  overflow: auto;
  background-color: #1a1a1a;
  border-radius: 4px;
  border: 1px solid #444;
`;

export const FormContainer = styled.div`
  background-color: #2d2d2d;
  border-radius: 8px;
  padding: 2rem;
  border: 1px solid #444;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

export const FormHeader = styled.div`
  text-align: center;
  border-bottom: 1px solid #444;
  padding-bottom: 1.5rem;
`;

export const FormTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: normal;
  color: #ffffff;
  margin: 0 0 0.5rem;
`;

export const FormSubtitle = styled.p`
  font-size: 0.9rem;
  color: #ff9500;
  margin: 0;
`;

export const DateTimePicker = styled.div`
  background-color: #333;
  border-radius: 6px;
  padding: 1rem;
  border: 1px solid #444;
`;

export const DateTimeLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: #cccccc;
`;

export const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const FormLabel = styled.label`
  font-size: 0.9rem;
  color: #cccccc;
`;

export const FormInput = styled.input`
  background-color: #333;
  border: 1px solid #444;
  border-radius: 4px;
  padding: 0.8rem 1rem;
  color: #ffffff;
  font-family: "Isadora Cyr", sans-serif;
  font-size: 0.95rem;

  &:focus {
    outline: none;
    border-color: #ff9500;
  }

  &::placeholder {
    color: #666;
  }
`;

export const FormTextarea = styled.textarea`
  background-color: #333;
  border: 1px solid #444;
  border-radius: 4px;
  padding: 0.8rem 1rem;
  color: #ffffff;
  font-family: "Isadora Cyr", sans-serif;
  font-size: 0.95rem;
  min-height: 100px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #ff9500;
  }

  &::placeholder {
    color: #666;
  }
`;

export const GuestCounter = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const CounterButton = styled.button`
  background-color: #333;
  border: 1px solid #444;
  color: #ffffff;
  width: 36px;
  height: 36px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background-color: #444;
    border-color: #ff9500;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const CounterValue = styled.span`
  font-size: 1.2rem;
  color: #ffffff;
  min-width: 40px;
  text-align: center;
`;

export const SubmitButton = styled.button`
  background-color: transparent;
  color: #ff9500;
  border: 2px solid #ff9500;
  padding: 1rem;
  font-size: 1rem;
  font-weight: normal;
  cursor: pointer;
  transition: all 0.3s;
  font-family: "Isadora Cyr", sans-serif;
  border-radius: 25px;
  width: 100%;
  margin-top: 1rem;

  &:hover:not(:disabled) {
    background-color: rgba(255, 149, 0, 0.1);
    border-color: #ffaa33;
    box-shadow: 0 0 15px rgba(255, 149, 0, 0.3);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const BookedMessage = styled.div`
  text-align: center;
  padding: 2rem;
  background-color: rgba(255, 77, 79, 0.1);
  border: 1px solid #ff4d4f;
  border-radius: 8px;
`;

export const BookedTitle = styled.h4`
  color: #ff4d4f;
  margin: 0 0 1rem;
  font-size: 1.2rem;
  font-weight: normal;
`;

export const BookedText = styled.p`
  color: #cccccc;
  margin: 0;
  line-height: 1.6;
`;

export const SelectTableMessage = styled.div`
  text-align: center;
  padding: 3rem 2rem;
`;

export const SelectTableIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #ff9500;
`;

export const SelectTableText = styled.p`
  color: #cccccc;
  margin: 0;
  font-size: 1.1rem;
`;

export const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(26, 26, 26, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  z-index: 10;
`;

export const LoadingText = styled.p`
  color: #ff9500;
  font-size: 1.2rem;
`;
