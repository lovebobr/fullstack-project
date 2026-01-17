// Booking.styles.ts
import styled from "styled-components";

// CSS переменные для темы
export const theme = {
  bgPrimary: "#1a1a1a",
  bgSecondary: "#2d2d2d",
  textPrimary: "#ffffff",
  textSecondary: "#cccccc",
  accentColor: "#ff9500",
  borderColor: "#444",
};

// Основной контейнер
export const BookingContainer = styled.div`
  font-family: "Isadora Cyr", system-ui, Avenir, Helvetica, Arial, sans-serif;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: ${theme.bgPrimary};
  color: ${theme.textPrimary};
  width: 100%;
  overflow-x: hidden;
`;

// Контентная область
export const BookingContent = styled.main`
  flex: 1;
  margin: 0 auto;
  width: 100%;
  max-width: 1400px;
  padding: 2rem;
  box-sizing: border-box;

  @media (max-width: 1400px) {
    max-width: 100%;
    padding: 1.5rem;
  }

  @media (max-width: 768px) {
    padding: 1rem;
  }

  @media (max-width: 480px) {
    padding: 0.75rem;
  }
`;

// Шапка страницы
export const PageHeader = styled.div`
  margin-bottom: 3rem;
  text-align: center;
  width: 100%;

  @media (max-width: 768px) {
    margin-bottom: 2rem;
  }
`;

export const PageTitle = styled.h1`
  font-size: clamp(1.8rem, 4vw, 2.5rem);
  margin-bottom: 0.5rem;
  font-weight: normal;
  color: ${theme.textPrimary};
  letter-spacing: 1px;
  line-height: 1.3;
`;

export const PageSubtitle = styled.p`
  font-size: clamp(0.9rem, 2vw, 1.1rem);
  color: ${theme.textSecondary};
  max-width: 600px;
  margin: 0 auto 2rem;
  line-height: 1.6;

  @media (max-width: 768px) {
    margin-bottom: 1.5rem;
  }
`;

// Основная сетка
export const BookingGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(300px, 400px);
  gap: 2.5rem;
  width: 100%;

  @media (max-width: 1200px) {
    grid-template-columns: minmax(0, 1fr) minmax(280px, 350px);
    gap: 2rem;
  }

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  @media (max-width: 768px) {
    gap: 1.5rem;
  }
`;

// Контейнер карты
export const MapContainer = styled.div`
  background-color: ${theme.bgSecondary};
  border-radius: 8px;
  padding: 1.5rem;
  border: 1px solid ${theme.borderColor};
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 600px;
  max-height: 800px;
  overflow: hidden;

  @media (max-width: 1200px) {
    min-height: 500px;
    max-height: 700px;
    padding: 1.25rem;
  }

  @media (max-width: 768px) {
    min-height: 400px;
    max-height: 600px;
    padding: 1rem;
  }

  @media (max-width: 480px) {
    min-height: 300px;
    max-height: 500px;
    padding: 0.75rem;
  }
`;

// Шапка карты
export const MapHeader = styled.div`
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;

  @media (max-width: 768px) {
    margin-bottom: 0.75rem;
    gap: 0.75rem;
  }
`;

export const MapTitle = styled.h3`
  font-size: clamp(1rem, 2vw, 1.2rem);
  font-weight: normal;
  color: ${theme.textPrimary};
  margin: 0;
`;

// Легенда
export const Legend = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
  width: 100%;

  @media (max-width: 768px) {
    gap: 0.75rem;
  }
`;

export const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: clamp(0.8rem, 1.5vw, 0.9rem);
  color: ${theme.textSecondary};
  white-space: nowrap;
`;

export const LegendColor = styled.div<{ color: string }>`
  width: 12px;
  height: 12px;
  background-color: ${(props) => props.color};
  border-radius: 2px;
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 10px;
    height: 10px;
  }
`;

// Обертка для карты с скроллом
export const MapWrapper = styled.div`
  flex: 1;
  position: relative;
  background-color: ${theme.bgPrimary};
  border-radius: 4px;
  border: 1px solid ${theme.borderColor};
  width: 100%;
  height: 100%;
  min-height: 0;

  /* Включаем скролл во всех направлениях */
  overflow: auto;

  /* Стилизация скроллбаров */
  &::-webkit-scrollbar {
    width: 12px;
    height: 12px;
  }

  &::-webkit-scrollbar-track {
    background: ${theme.bgSecondary};
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: #555;
    border-radius: 10px;
    border: 3px solid ${theme.bgSecondary};

    &:hover {
      background: #666;
    }
  }

  &::-webkit-scrollbar-corner {
    background: ${theme.bgSecondary};
  }

  /* Для Firefox */
  scrollbar-width: thin;
  scrollbar-color: #555 ${theme.bgSecondary};
`;

// Контейнер для Stage
export const StageContainer = styled.div`
  position: relative;
  width: fit-content;
  height: fit-content;
`;

// Подсказка о скролле
export const ScrollHint = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(45, 45, 45, 0.9);
  border: 1px solid #555;
  border-radius: 6px;
  padding: 8px 12px;
  color: #ccc;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 10;
  backdrop-filter: blur(4px);
  animation: fadeOut 5s forwards;

  span {
    font-size: 1rem;
  }

  @keyframes fadeOut {
    0% {
      opacity: 1;
    }
    80% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }

  @media (max-width: 768px) {
    font-size: 0.75rem;
    padding: 6px 10px;
  }
`;

// Контейнер формы
export const FormContainer = styled.div`
  background-color: ${theme.bgSecondary};
  border-radius: 8px;
  padding: 2rem;
  border: 1px solid ${theme.borderColor};
  display: flex;
  flex-direction: column;
  gap: 2rem;
  height: fit-content;
  position: sticky;
  top: 2rem;

  @media (max-width: 1200px) {
    padding: 1.75rem;
  }

  @media (max-width: 1024px) {
    position: static;
    order: -1;
    margin-bottom: 0;
  }

  @media (max-width: 768px) {
    padding: 1.5rem;
    gap: 1.5rem;
  }

  @media (max-width: 480px) {
    padding: 1.25rem;
    gap: 1.25rem;
  }
`;

// Превью даты и времени
export const DateTimePreview = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  background-color: ${theme.bgSecondary};
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid ${theme.borderColor};
  margin-bottom: 2rem;
  width: 100%;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
    padding: 1.25rem;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 12px;
    padding: 1rem;
  }
`;

export const PreviewLabel = styled.div`
  font-size: 0.85rem;
  color: ${theme.textSecondary};
  margin-bottom: 0.5rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const PreviewValue = styled.div`
  font-size: clamp(1.1rem, 2vw, 1.3rem);
  font-weight: 600;
  color: ${theme.textPrimary};
`;

// Загрузка
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
  border-radius: 4px;
  z-index: 10;
`;

export const LoadingText = styled.p`
  color: ${theme.accentColor};
  font-size: clamp(1rem, 2vw, 1.2rem);
`;

// Стили формы
export const FormHeader = styled.div`
  text-align: center;
  border-bottom: 1px solid ${theme.borderColor};
  padding-bottom: 1.5rem;

  @media (max-width: 768px) {
    padding-bottom: 1rem;
  }
`;

export const FormTitle = styled.h2`
  font-size: clamp(1.3rem, 2.5vw, 1.5rem);
  font-weight: normal;
  color: ${theme.textPrimary};
  margin: 0 0 0.5rem;
`;

export const FormSubtitle = styled.p`
  font-size: clamp(0.8rem, 1.5vw, 0.9rem);
  color: ${theme.accentColor};
  margin: 0;
`;

export const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (max-width: 768px) {
    gap: 0.875rem;
  }
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const FormLabel = styled.label`
  font-size: clamp(0.8rem, 1.5vw, 0.9rem);
  color: ${theme.textSecondary};
`;

export const FormInput = styled.input`
  background-color: #333;
  border: 1px solid ${theme.borderColor};
  border-radius: 4px;
  padding: clamp(0.7rem, 1.5vw, 0.8rem) clamp(0.8rem, 2vw, 1rem);
  color: ${theme.textPrimary};
  font-family: "Isadora Cyr", sans-serif;
  font-size: clamp(0.85rem, 1.8vw, 0.95rem);
  width: 100%;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: ${theme.accentColor};
  }

  &::placeholder {
    color: #666;
  }
`;

export const FormTextarea = styled.textarea`
  background-color: #333;
  border: 1px solid ${theme.borderColor};
  border-radius: 4px;
  padding: clamp(0.7rem, 1.5vw, 0.8rem) clamp(0.8rem, 2vw, 1rem);
  color: ${theme.textPrimary};
  font-family: "Isadora Cyr", sans-serif;
  font-size: clamp(0.85rem, 1.8vw, 0.95rem);
  min-height: 100px;
  resize: vertical;
  width: 100%;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: ${theme.accentColor};
  }

  &::placeholder {
    color: #666;
  }
`;

// Группа даты и времени
export const DateTimePicker = styled.div`
  background-color: #333;
  border-radius: 6px;
  padding: 1rem;
  border: 1px solid ${theme.borderColor};

  @media (max-width: 768px) {
    padding: 0.875rem;
  }
`;

export const DateTimeLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-size: clamp(0.8rem, 1.5vw, 0.9rem);
  color: ${theme.textSecondary};
`;

// Кнопка отправки
export const SubmitButton = styled.button`
  background-color: transparent;
  color: ${theme.accentColor};
  border: 2px solid ${theme.accentColor};
  padding: clamp(0.875rem, 2vw, 1rem);
  font-size: clamp(0.9rem, 1.8vw, 1rem);
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

// Сообщения
export const BookedMessage = styled.div`
  text-align: center;
  padding: 2rem;
  background-color: rgba(255, 77, 79, 0.1);
  border: 1px solid #ff4d4f;
  border-radius: 8px;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

export const BookedTitle = styled.h4`
  color: #ff4d4f;
  margin: 0 0 1rem;
  font-size: clamp(1rem, 2vw, 1.2rem);
  font-weight: normal;
`;

export const BookedText = styled.p`
  color: ${theme.textSecondary};
  margin: 0;
  line-height: 1.6;
  font-size: clamp(0.85rem, 1.5vw, 0.95rem);
`;

export const SelectTableMessage = styled.div`
  text-align: center;
  padding: 3rem 2rem;

  @media (max-width: 768px) {
    padding: 2rem 1.5rem;
  }
`;

export const SelectTableIcon = styled.div`
  font-size: clamp(2rem, 4vw, 3rem);
  margin-bottom: 1rem;
  color: ${theme.accentColor};
`;

export const SelectTableText = styled.p`
  color: ${theme.textSecondary};
  margin: 0;
  font-size: clamp(0.9rem, 1.8vw, 1.1rem);
`;

// Стили для счетчика гостей
export const GuestCounter = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: clamp(1rem, 2vw, 1.5rem);
  margin: 1rem 0;
`;

export const CounterButton = styled.button`
  width: clamp(32px, 4vw, 40px);
  height: clamp(32px, 4vw, 40px);
  border-radius: 50%;
  border: 2px solid ${theme.accentColor};
  background-color: transparent;
  color: ${theme.accentColor};
  font-size: clamp(1.2rem, 2vw, 1.5rem);
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

export const CounterValue = styled.span`
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: bold;
  color: ${theme.textPrimary};
  min-width: clamp(40px, 5vw, 60px);
  text-align: center;
`;

// Длительность бронирования
export const DurationSelector = styled.div`
  background-color: #333;
  border-radius: 6px;
  padding: 1rem;
  border: 1px solid ${theme.borderColor};
  margin-top: 1rem;

  @media (max-width: 768px) {
    padding: 0.875rem;
  }
`;

export const DurationLabel = styled.label`
  display: block;
  margin-bottom: 0.75rem;
  font-size: clamp(0.85rem, 1.5vw, 0.95rem);
  color: ${theme.textSecondary};
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
  color: ${theme.textPrimary};
  width: clamp(36px, 4vw, 40px);
  height: clamp(36px, 4vw, 40px);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  font-size: clamp(1rem, 1.5vw, 1.2rem);
  font-weight: bold;

  &:hover:not(:disabled) {
    background-color: ${theme.accentColor};
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
  font-size: clamp(1.2rem, 2vw, 1.5rem);
  font-weight: bold;
  color: ${theme.accentColor};
  margin-bottom: 0.25rem;
`;

export const DurationText = styled.div`
  font-size: clamp(0.75rem, 1.2vw, 0.85rem);
  color: #999;
`;

// Уведомления
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

  @media (max-width: 768px) {
    padding: 0.875rem;
    margin-bottom: 1.25rem;
  }
`;

export const StatusAlertTitle = styled.h4`
  margin: 0 0 0.5rem 0;
  font-size: clamp(0.9rem, 1.5vw, 1rem);
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const StatusAlertText = styled.p`
  margin: 0;
  font-size: clamp(0.8rem, 1.3vw, 0.9rem);
  line-height: 1.5;
`;

// Информация о столе
export const TableInfo = styled.div`
  background-color: #333;
  border-radius: 6px;
  padding: 1.25rem;
  margin-bottom: 1.5rem;
  border: 1px solid ${theme.borderColor};

  @media (max-width: 768px) {
    padding: 1rem;
    margin-bottom: 1.25rem;
  }
`;

export const TableInfoHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

export const TableNumber = styled.h3`
  margin: 0;
  font-size: clamp(1.2rem, 2.5vw, 1.5rem);
  color: ${theme.accentColor};
  font-weight: 600;
`;

export const TableCapacity = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: clamp(0.8rem, 1.5vw, 0.9rem);
  color: #999;
`;

export const TableCapacityText = styled.span`
  font-weight: 500;
  color: ${theme.textPrimary};
`;

// Шаги (для многошаговой формы)
export const StepIndicator = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 2rem 0;

  @media (max-width: 768px) {
    flex-wrap: wrap;
    gap: 1rem;
  }
`;

export const Step = styled.div<{ active?: boolean }>`
  display: flex;
  align-items: center;
  opacity: ${(props) => (props.active ? 1 : 0.5)};
`;

export const StepNumber = styled.div<{ active?: boolean }>`
  width: clamp(28px, 3vw, 32px);
  height: clamp(28px, 3vw, 32px);
  border-radius: 50%;
  background: ${(props) => (props.active ? "#1890ff" : "#333")};
  color: ${(props) => (props.active ? "white" : "#999")};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 0.5rem;
  border: 2px solid ${(props) => (props.active ? "#1890ff" : "#444")};
`;

export const StepLabel = styled.div`
  display: flex;
  flex-direction: column;
`;

export const StepTitle = styled.div`
  font-weight: 600;
  font-size: clamp(0.75rem, 1.2vw, 0.9rem);
  color: ${theme.textPrimary};
`;

export const StepDivider = styled.div`
  width: clamp(40px, 5vw, 60px);
  height: 2px;
  background: ${theme.borderColor};
  margin: 0 1rem;

  @media (max-width: 768px) {
    display: none;
  }
`;

// Навигация по шагам
export const StepNavigation = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.75rem;
  }
`;

export const BackButton = styled.button`
  padding: clamp(0.75rem, 1.5vw, 1rem) clamp(1rem, 2vw, 1.5rem);
  background: #333;
  border: 1px solid ${theme.borderColor};
  border-radius: 6px;
  color: ${theme.textSecondary};
  cursor: pointer;
  font-size: clamp(0.85rem, 1.5vw, 1rem);
  flex: 1;

  &:hover {
    background: #444;
    border-color: ${theme.accentColor};
    color: ${theme.accentColor};
  }
`;

export const NextButton = styled.button`
  padding: clamp(0.75rem, 1.5vw, 1rem) clamp(1rem, 2vw, 1.5rem);
  background: ${theme.accentColor};
  border: none;
  border-radius: 6px;
  color: white;
  cursor: pointer;
  font-size: clamp(0.85rem, 1.5vw, 1rem);
  font-weight: 500;
  flex: 1;

  &:hover {
    background: #ffaa33;
  }
`;
