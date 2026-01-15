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
// styled/booking-style.ts (дополнение)
export const DurationSelector = styled.div`
  background-color: #333;
  border-radius: 6px;
  padding: 1rem;
  border: 1px solid #444;
  margin-top: 1rem;
`;

export const DurationLabel = styled.label`
  display: block;
  margin-bottom: 0.75rem;
  font-size: 0.95rem;
  color: #cccccc;
  font-weight: 500;
`;

export const DurationControls = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
`;

export const DurationButton = styled.button`
  background-color: #444;
  border: 1px solid #555;
  color: #ffffff;
  width: 40px;
  height: 40px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 1.2rem;
  font-weight: bold;

  &:hover:not(:disabled) {
    background-color: #ff9500;
    border-color: #ffaa33;
    transform: scale(1.05);
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
    background-color: #333;
  }

  &:active:not(:disabled) {
    transform: scale(0.95);
  }
`;

export const DurationValue = styled.div`
  flex: 1;
  text-align: center;
  padding: 0.5rem;
`;

export const DurationDisplay = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #ff9500;
  margin-bottom: 0.25rem;
`;

export const DurationText = styled.div`
  font-size: 0.85rem;
  color: #999;
`;

export const DurationInfo = styled.div`
  margin-top: 0.75rem;
  padding: 0.75rem;
  background-color: rgba(255, 149, 0, 0.1);
  border-radius: 4px;
  border-left: 3px solid #ff9500;
`;

export const DurationInfoText = styled.p`
  margin: 0;
  font-size: 0.85rem;
  color: #ffcc80;
  line-height: 1.4;
`;

// Добавим стили для уведомлений
export const StatusAlert = styled.div<{
  type: "info" | "warning" | "error" | "success";
}>`
  padding: 1rem;
  border-radius: 6px;
  margin-bottom: 1.5rem;
  border-left: 4px solid;

  ${({ type }) => {
    switch (type) {
      case "info":
        return `
          background-color: rgba(24, 144, 255, 0.1);
          border-left-color: #1890ff;
          color: #69c0ff;
        `;
      case "warning":
        return `
          background-color: rgba(250, 173, 20, 0.1);
          border-left-color: #faad14;
          color: #ffd666;
        `;
      case "error":
        return `
          background-color: rgba(255, 77, 79, 0.1);
          border-left-color: #ff4d4f;
          color: #ff7875;
        `;
      case "success":
        return `
          background-color: rgba(82, 196, 26, 0.1);
          border-left-color: #52c41a;
          color: #95de64;
        `;
      default:
        return "";
    }
  }}
`;

export const StatusAlertTitle = styled.h4`
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const StatusAlertText = styled.p`
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.5;
`;

// Добавим стили для информации о столе
export const TableInfo = styled.div`
  background-color: #333;
  border-radius: 6px;
  padding: 1.25rem;
  margin-bottom: 1.5rem;
  border: 1px solid #444;
`;

export const TableInfoHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

export const TableNumber = styled.h3`
  margin: 0;
  font-size: 1.5rem;
  color: #ff9500;
  font-weight: 600;
`;

export const TableCapacity = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #999;
`;

export const TableCapacityIcon = styled.span`
  font-size: 1rem;
`;

export const TableCapacityText = styled.span`
  font-weight: 500;
  color: #fff;
`;

// Добавим стили для выбора даты и времени
export const DateTimeSection = styled.div`
  background-color: #333;
  border-radius: 6px;
  padding: 1.5rem;
  border: 1px solid #444;
  margin-bottom: 1.5rem;
`;

export const DateTimeSectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
`;

export const DateTimeTitle = styled.h4`
  margin: 0;
  font-size: 1.1rem;
  color: #fff;
  font-weight: 500;
`;

export const DateTimeDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background-color: #444;
  padding: 0.75rem 1rem;
  border-radius: 4px;
  margin-top: 1rem;
`;

export const DateTimeItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const DateTimeValue = styled.span`
  font-size: 1.1rem;
  color: #fff;
  font-weight: 500;
`;

export const DateTimeSeparator = styled.span`
  color: #666;
  font-size: 1rem;
`;

// Добавим стили для формы гостей
export const GuestsSection = styled.div`
  background-color: #333;
  border-radius: 6px;
  padding: 1.5rem;
  border: 1px solid #444;
  margin-bottom: 1.5rem;
`;

export const GuestsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
`;

export const GuestsTitle = styled.h4`
  margin: 0;
  font-size: 1.1rem;
  color: #fff;
  font-weight: 500;
`;

export const GuestsCounter = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  margin: 1rem 0;
`;

export const GuestsButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid #ff9500;
  background-color: transparent;
  color: #ff9500;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background-color: rgba(255, 149, 0, 0.1);
    transform: scale(1.1);
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
    border-color: #666;
    color: #666;
  }
`;

export const GuestsValue = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: #fff;
  min-width: 60px;
  text-align: center;
`;

export const GuestsMax = styled.div`
  text-align: center;
  font-size: 0.85rem;
  color: #999;
  margin-top: 0.5rem;
`;
// styled/Booking.styles.ts - добавьте эти стили

// Шаги
export const StepIndicator = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 30px 0 40px;
`;

export const Step = styled.div<{ active?: boolean }>`
  display: flex;
  align-items: center;
  opacity: ${(props) => (props.active ? 1 : 0.5)};
`;

export const StepNumber = styled.div<{ active?: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${(props) => (props.active ? "#1890ff" : "#f5f5f5")};
  color: ${(props) => (props.active ? "white" : "#666")};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 10px;
`;

export const StepLabel = styled.div`
  display: flex;
  flex-direction: column;
`;

export const StepTitle = styled.div`
  font-weight: 600;
  font-size: 14px;
`;

export const StepDivider = styled.div`
  width: 60px;
  height: 2px;
  background: #e8e8e8;
  margin: 0 20px;
`;

// Выбор даты и времени
export const DateTimeSelector = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  h3 {
    margin: 0 0 20px 0;
    color: #333;
  }
`;

export const DateTimeInputs = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const DateInput = styled.input`
  padding: 12px;
  border: 2px solid #e8e8e8;
  border-radius: 8px;
  font-size: 16px;
  width: 100%;

  &:focus {
    outline: none;
    border-color: #1890ff;
  }
`;

export const TimeSlots = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 10px;
  max-height: 300px;
  overflow-y: auto;
  padding: 10px;
`;

export const TimeSlot = styled.div<{ selected?: boolean }>`
  position: relative;
  padding: 12px 8px;
  border: 2px solid ${(props) => (props.selected ? "#1890ff" : "#e8e8e8")};
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
  background: ${(props) => (props.selected ? "#e6f7ff" : "white")};
  transition: all 0.2s;

  &:hover {
    border-color: #1890ff;
  }
`;

export const SlotTime = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #333;
`;

export const SlotLabel = styled.div`
  font-size: 12px;
  color: #666;
  margin-top: 4px;
`;

export const SlotIndicator = styled.div<{ selected?: boolean }>`
  position: absolute;
  top: 4px;
  right: 4px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${(props) => (props.selected ? "#1890ff" : "transparent")};
`;

// Информация о доступных столах
export const AvailableTablesInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #f6ffed;
  border: 1px solid #b7eb8f;
  border-radius: 8px;
`;

export const TablesCount = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: #52c41a;
`;

// Навигация по шагам
export const StepNavigation = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
  gap: 15px;
`;

export const BackButton = styled.button`
  padding: 10px 20px;
  background: #f5f5f5;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  color: #666;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background: #e8e8e8;
  }
`;

export const NextButton = styled.button`
  padding: 10px 20px;
  background: #1890ff;
  border: none;
  border-radius: 6px;
  color: white;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;

  &:hover {
    background: #40a9ff;
  }
`;

// Превью даты и времени
export const DateTimePreview = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  background: #fafafa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  position: relative;
`;

export const PreviewLabel = styled.div`
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
`;

export const PreviewValue = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: #333;
`;
