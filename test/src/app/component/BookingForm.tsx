import React, { useState, useEffect } from "react";
import styled from "styled-components";
import type { TableItem } from "./Editor";

interface BookingFormProps {
  selectedTable: TableItem | null;
  selectedDateTime: any;
  onDateTimeChange: (date: any) => void;
  restaurantName: string;
  duration: number;
  onDurationChange: (duration: number) => void;
  isBooked: boolean;
  hasPendingReservation: boolean;
  bookingInfo?: any;
  onReserve: (data: any) => Promise<void>;
  // Функции для модальных окон
  showModal?: (
    message: string,
    title?: string,
    type?: "info" | "warning" | "danger",
    onConfirm?: () => void,
    confirmText?: string
  ) => void;
  showError?: (message: string, onConfirm?: () => void) => void;
  showWarning?: (message: string, onConfirm?: () => void) => void;
  showInfo?: (message: string, onConfirm?: () => void) => void;
}

export const BookingForm: React.FC<BookingFormProps> = ({
  selectedTable,
  onReserve,
  showError,
  showWarning,
  showInfo,
}) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    user_name: "",
    user_phone: "+7",
    guests_count: 2,
    special_requests: "",
  });
  const [errors, setErrors] = useState({
    user_name: "",
    user_phone: "",
  });

  const validateName = (name: string): string => {
    if (!name.trim()) return "Имя обязательно для заполнения";
    if (name.length < 2) return "Имя должно содержать минимум 2 символа";
    if (name.length > 50) return "Имя слишком длинное (макс. 50 символов)";

    const nameRegex = /^[a-zA-Zа-яА-ЯёЁ\s\-']+$/;
    if (!nameRegex.test(name)) {
      return "Имя может содержать только буквы, пробелы, дефисы и апострофы";
    }

    return "";
  };

  const validatePhone = (phone: string): string => {
    if (!phone.trim()) return "Телефон обязателен для заполнения";

    const cleanPhone = phone.replace(/[^\d+]/g, "");

    if (!phone.startsWith("+7")) {
      return "Телефон должен начинаться с +7";
    }

    const digitsOnly = phone.replace(/\D/g, "");
    if (digitsOnly.length !== 11) {
      return "Телефон должен содержать 11 цифр (включая код страны)";
    }

    const phoneRegex =
      /^\+7\s?\(?\d{3}\)?[\s\-]?\d{3}[\s\-]?\d{2}[\s\-]?\d{2}$/;
    if (!phoneRegex.test(phone)) {
      return "Введите корректный номер телефона";
    }

    return "";
  };

  // Общая валидация формы
  const validateForm = (): boolean => {
    const nameError = validateName(formData.user_name);
    const phoneError = validatePhone(formData.user_phone);

    setErrors({
      user_name: nameError,
      user_phone: phoneError,
    });

    return !nameError && !phoneError;
  };

  useEffect(() => {
    if (!selectedTable) return;

    // Инициализируем guests_count с учетом максимального количества мест
    if (formData.guests_count > selectedTable.seats) {
      setFormData((prev) => ({
        ...prev,
        guests_count: selectedTable.seats,
      }));
    }
  }, [selectedTable, formData.guests_count]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      if (showError) {
        showError("Пожалуйста, исправьте ошибки в форме");
      } else {
        alert("Пожалуйста, исправьте ошибки в форме");
      }
      return;
    }

    setLoading(true);
    try {
      await onReserve(formData);
    } catch (error) {
      console.error("Ошибка бронирования:", error);
      if (showError) {
        showError(
          "Произошла ошибка при бронировании. Пожалуйста, попробуйте еще раз."
        );
      } else {
        alert(
          "Произошла ошибка при бронировании. Пожалуйста, попробуйте еще раз."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // Обработчик изменения имени
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Разрешаем только буквы, пробелы, дефисы и апострофы
    const filteredValue = value.replace(/[^a-zA-Zа-яА-ЯёЁ\s\-']/g, "");

    setFormData((prev) => ({
      ...prev,
      user_name: filteredValue,
    }));

    // Валидируем на лету
    if (value.trim()) {
      setErrors((prev) => ({
        ...prev,
        user_name: validateName(filteredValue),
      }));
    }
  };

  // Обработчик изменения телефона
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    // Убираем все нецифровые символы кроме плюса
    const digits = value.replace(/\D/g, "");

    // Форматируем номер
    let formattedValue = "+7";

    if (digits.length > 1) {
      const restDigits = digits.slice(1); // убираем первую 7 (уже есть в +7)

      if (restDigits.length <= 3) {
        formattedValue += ` (${restDigits}`;
      } else if (restDigits.length <= 6) {
        formattedValue += ` (${restDigits.slice(0, 3)}) ${restDigits.slice(3)}`;
      } else if (restDigits.length <= 8) {
        formattedValue += ` (${restDigits.slice(0, 3)}) ${restDigits.slice(
          3,
          6
        )}-${restDigits.slice(6)}`;
      } else {
        formattedValue += ` (${restDigits.slice(0, 3)}) ${restDigits.slice(
          3,
          6
        )}-${restDigits.slice(6, 8)}-${restDigits.slice(8, 10)}`;
      }
    }

    setFormData((prev) => ({
      ...prev,
      user_phone: formattedValue,
    }));

    // Валидируем на лету, если достаточно цифр
    if (digits.length >= 11) {
      setErrors((prev) => ({
        ...prev,
        user_phone: validatePhone(formattedValue),
      }));
    }
  };

  // Обработчик изменения особых пожеланий
  const handleSpecialRequestsChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      special_requests: e.target.value,
    }));
  };

  const increaseGuests = () => {
    if (selectedTable && formData.guests_count < selectedTable.seats) {
      setFormData((prev) => ({
        ...prev,
        guests_count: prev.guests_count + 1,
      }));
    }
  };

  const decreaseGuests = () => {
    if (formData.guests_count > 1) {
      setFormData((prev) => ({
        ...prev,
        guests_count: prev.guests_count - 1,
      }));
    }
  };

  // Обработчик изменения через поле ввода
  const handleGuestsInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = parseInt(e.target.value) || 1;

    if (selectedTable) {
      // Ограничиваем значение между 1 и максимальным количеством мест
      value = Math.max(1, Math.min(value, selectedTable.seats));
    }

    setFormData((prev) => ({
      ...prev,
      guests_count: value,
    }));
  };

  // Блокировка нецифровых символов для поля телефона
  const handlePhoneKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Разрешаем: цифры, backspace, delete, tab, стрелки
    if (
      !/[\d]/.test(e.key) &&
      ![
        "Backspace",
        "Delete",
        "Tab",
        "ArrowLeft",
        "ArrowRight",
        "ArrowUp",
        "ArrowDown",
        "Home",
        "End",
      ].includes(e.key)
    ) {
      e.preventDefault();
    }
  };

  // Блокировка цифр и спецсимволов для поля имени
  const handleNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Разрешаем только буквы, пробелы, дефисы, апострофы и управляющие клавиши
    if (
      !/^[a-zA-Zа-яА-ЯёЁ\s\-']$/.test(e.key) &&
      ![
        "Backspace",
        "Delete",
        "Tab",
        "ArrowLeft",
        "ArrowRight",
        "ArrowUp",
        "ArrowDown",
        "Home",
        "End",
        "Space",
      ].includes(e.key)
    ) {
      e.preventDefault();
    }
  };

  if (!selectedTable) {
    return <NoTableMessage>Выберите столик на плане ресторана</NoTableMessage>;
  }

  return (
    <Form onSubmit={handleSubmit}>
      <TableInfo>
        <TableNumber>Стол #{selectedTable.tableNumber}</TableNumber>
        <TableSeats>{selectedTable.seats} мест</TableSeats>
      </TableInfo>

      <Grid>
        <FieldGroup>
          <FieldLabel>
            Имя *{errors.user_name && <ErrorText>{errors.user_name}</ErrorText>}
          </FieldLabel>
          <Input
            type="text"
            name="user_name"
            value={formData.user_name}
            onChange={handleNameChange}
            onKeyDown={handleNameKeyDown}
            placeholder="Иван Иванов"
            required
            maxLength={50}
            $hasError={!!errors.user_name}
          />
        </FieldGroup>

        <FieldGroup>
          <FieldLabel>
            Телефон *
            {errors.user_phone && <ErrorText>{errors.user_phone}</ErrorText>}
          </FieldLabel>
          <Input
            type="tel"
            name="user_phone"
            value={formData.user_phone}
            onChange={handlePhoneChange}
            onKeyDown={handlePhoneKeyDown}
            placeholder="+7 (999) 123-45-67"
            required
            maxLength={18}
            $hasError={!!errors.user_phone}
          />
          <PhoneHint>Формат: +7 (XXX) XXX-XX-XX</PhoneHint>
        </FieldGroup>

        <FieldGroup>
          <FieldLabel>Количество гостей</FieldLabel>
          <StepperContainer>
            <StepperButton
              type="button"
              onClick={decreaseGuests}
              disabled={formData.guests_count <= 1}
              aria-label="Уменьшить количество гостей"
            >
              -
            </StepperButton>
            <GuestsInput
              type="number"
              min="1"
              max={selectedTable.seats}
              value={formData.guests_count}
              onChange={handleGuestsInputChange}
              aria-label="Количество гостей"
            />
            <StepperButton
              type="button"
              onClick={increaseGuests}
              disabled={formData.guests_count >= selectedTable.seats}
              aria-label="Увеличить количество гостей"
            >
              +
            </StepperButton>
          </StepperContainer>
        </FieldGroup>

        <FieldGroup>
          <FieldLabel>Максимум</FieldLabel>
          <MaxSeats>{selectedTable.seats} мест</MaxSeats>
        </FieldGroup>
      </Grid>

      <FieldGroup>
        <FieldLabel>Особые пожелания (необязательно)</FieldLabel>
        <Textarea
          name="special_requests"
          value={formData.special_requests}
          onChange={handleSpecialRequestsChange}
          placeholder="Детский стул, аллергия, торт, поздравление..."
          rows={3}
          maxLength={500}
        />
        <CharCounter>
          {formData.special_requests.length}/500 символов
        </CharCounter>
      </FieldGroup>

      <SubmitButton
        type="submit"
        disabled={loading || !!errors.user_name || !!errors.user_phone}
        title={
          errors.user_name || errors.user_phone
            ? "Исправьте ошибки в форме"
            : ""
        }
      >
        {loading ? "Обработка..." : "Забронировать стол"}
      </SubmitButton>

      <RequiredNote>* Поля обязательные для заполнения</RequiredNote>
    </Form>
  );
};

const NoTableMessage = styled.div`
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
  padding: 20px;
  text-align: center;
  color: #aaa;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
  border: 1px dashed rgba(255, 255, 255, 0.1);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const TableInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const TableNumber = styled.div`
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: #ff9500;
`;

const TableSeats = styled.div`
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
  font-size: 14px;
  color: #aaa;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 8px;
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
`;

const FieldLabel = styled.div`
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #fff;
  margin-bottom: 6px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ErrorText = styled.span`
  color: #ff4d4f;
  font-size: 12px;
  font-weight: normal;
`;

interface InputProps {
  $hasError?: boolean;
}

const Input = styled.input<InputProps>`
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
  width: 100%;
  padding: 10px 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid
    ${(props) => (props.$hasError ? "#ff4d4f" : "rgba(255, 255, 255, 0.1)")};
  border-radius: 6px;
  color: #fff;
  font-size: 14px;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: ${(props) => (props.$hasError ? "#ff4d4f" : "#ff9500")};
    box-shadow: ${(props) =>
      props.$hasError
        ? "0 0 0 2px rgba(255, 77, 79, 0.2)"
        : "0 0 0 2px rgba(255, 149, 0, 0.2)"};
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Textarea = styled.textarea`
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
  width: 100%;
  padding: 10px 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  color: #fff;
  font-size: 14px;
  resize: vertical;
  min-height: 80px;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #ff9500;
    box-shadow: 0 0 0 2px rgba(255, 149, 0, 0.2);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }
`;

const StepperContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
`;

const StepperButton = styled.button`
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
  width: 36px;
  height: 36px;
  background: rgba(255, 149, 0, 0.1);
  border: 1px solid rgba(255, 149, 0, 0.3);
  border-radius: 6px;
  color: #ff9500;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: rgba(255, 149, 0, 0.2);
    border-color: #ff9500;
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(255, 149, 0, 0.3);
  }
`;

const GuestsInput = styled.input`
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
  flex: 1;
  min-width: 50px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  text-align: center;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #ff9500;
    box-shadow: 0 0 0 2px rgba(255, 149, 0, 0.2);
  }

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &[type="number"] {
    -moz-appearance: textfield;
  }
`;

const MaxSeats = styled.div`
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
  color: #aaa;
  font-size: 13px;
  padding: 10px 0;
  text-align: center;
`;

const SubmitButton = styled.button`
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
  width: 100%;
  padding: 14px;
  background: #ff9500;
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 8px;

  &:hover:not(:disabled) {
    background: #e68500;
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(255, 149, 0, 0.3);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;

const PhoneHint = styled.div`
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
  color: #888;
  font-size: 11px;
  margin-top: 4px;
`;

const CharCounter = styled.div`
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
  color: #888;
  font-size: 11px;
  text-align: right;
  margin-top: 4px;
`;

const RequiredNote = styled.div`
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
  color: #aaa;
  font-size: 12px;
  text-align: center;
  margin-top: 4px;
`;
