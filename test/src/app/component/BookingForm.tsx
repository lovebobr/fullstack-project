// components/booking/BookingForm.tsx
import React, { useState } from "react";
import { Form, Input, InputNumber, DatePicker, Typography } from "antd";
import dayjs, { Dayjs } from "dayjs";
import type { TableItem } from "./Editor";

const { Title, Text } = Typography;

interface BookingFormProps {
  selectedTable: TableItem | null;
  selectedDateTime: Dayjs;
  onDateTimeChange: (date: Dayjs) => void;
  restaurantName: string;
  isBooked: boolean;
  bookingInfo?: {
    isBooked: boolean;
    remainingTime?: string;
    endTime?: Dayjs;
    activeReservation?: any;
  };
  duration: number;
  onDurationChange: (duration: number) => void;
  onReserve: (data: any) => Promise<void>;
}

export const BookingForm: React.FC<BookingFormProps> = ({
  selectedTable,
  selectedDateTime,
  onDateTimeChange,
  restaurantName,
  isBooked,
  bookingInfo,
  duration,
  onDurationChange,
  onReserve,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Если стол занят, показываем информационное сообщение
  if (isBooked && selectedTable && bookingInfo) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "40px 20px",
          backgroundColor: "#fff1f0",
          borderRadius: "8px",
          border: "1px solid #ffccc7",
        }}
      >
        <Text
          type="danger"
          style={{ fontSize: "20px", display: "block", marginBottom: "16px" }}
        >
          ⚠️ Столик №{selectedTable.tableNumber} занят
        </Text>
        <Text
          style={{ display: "block", marginBottom: "8px", fontSize: "16px" }}
        >
          Занят на {selectedDateTime.format("DD.MM.YYYY")} в{" "}
          {selectedDateTime.format("HH:mm")}
        </Text>
        {bookingInfo.remainingTime && (
          <Text
            style={{
              display: "block",
              marginBottom: "16px",
              fontSize: "16px",
              fontWeight: "bold",
            }}
          >
            До освобождения: {bookingInfo.remainingTime}
          </Text>
        )}
        <Text type="secondary" style={{ fontSize: "14px" }}>
          Пожалуйста, выберите другое время или другой столик.
        </Text>
      </div>
    );
  }

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const reservationData = {
        ...values,
        date_time: selectedDateTime.format("YYYY-MM-DD HH:mm:ss"),
        duration: duration,
      };
      await onReserve(reservationData);
    } catch (error) {
      console.error("Ошибка бронирования:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDurationChange = (value: number) => {
    if (value >= 1 && value <= 8) {
      onDurationChange(value);
    }
  };

  return (
    <div
      style={{
        padding: "24px",
        backgroundColor: "#fff",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        height: "100%",
      }}
    >
      {selectedTable ? (
        <>
          <Title level={3} style={{ marginBottom: "8px" }}>
            Бронирование столика {selectedTable.tableNumber}
          </Title>
          <Text
            type="secondary"
            style={{ display: "block", marginBottom: "24px" }}
          >
            {restaurantName}
          </Text>

          {/* Блок выбора времени */}
          <div
            style={{
              marginBottom: "24px",
              padding: "16px",
              backgroundColor: "#f6ffed",
              borderRadius: "8px",
              border: "1px solid #b7eb8f",
            }}
          >
            <Text strong style={{ display: "block", marginBottom: "12px" }}>
              Дата и время посещения:
            </Text>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                flexWrap: "wrap",
                marginBottom: "16px",
              }}
            >
              <DatePicker
                showTime
                format="DD.MM.YYYY HH:mm"
                value={selectedDateTime}
                onChange={onDateTimeChange}
                style={{ width: 220 }}
                placeholder="Выберите дату и время"
                disabledDate={(current) =>
                  current && current < dayjs().startOf("day")
                }
              />
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  backgroundColor: "#fff",
                  padding: "8px 12px",
                  borderRadius: "4px",
                  border: "1px solid #d9d9d9",
                }}
              >
                <Text strong>{selectedDateTime.format("DD.MM.YYYY")}</Text>
                <Text>в</Text>
                <Text strong>{selectedDateTime.format("HH:mm")}</Text>
              </div>
            </div>

            {/* Выбор длительности */}
            <div style={{ marginTop: "16px" }}>
              <Text strong style={{ display: "block", marginBottom: "8px" }}>
                Длительность посещения:
              </Text>
              <div
                style={{ display: "flex", alignItems: "center", gap: "16px" }}
              >
                <button
                  type="button"
                  onClick={() => handleDurationChange(duration - 1)}
                  disabled={duration <= 1}
                  style={{
                    padding: "6px 12px",
                    border: "1px solid #d9d9d9",
                    borderRadius: "4px",
                    background: "#fff",
                    cursor: duration > 1 ? "pointer" : "not-allowed",
                    opacity: duration > 1 ? 1 : 0.5,
                  }}
                >
                  -
                </button>
                <Text strong style={{ minWidth: "50px", textAlign: "center" }}>
                  {duration} ч
                </Text>
                <button
                  type="button"
                  onClick={() => handleDurationChange(duration + 1)}
                  disabled={duration >= 8}
                  style={{
                    padding: "6px 12px",
                    border: "1px solid #d9d9d9",
                    borderRadius: "4px",
                    background: "#fff",
                    cursor: duration < 8 ? "pointer" : "not-allowed",
                    opacity: duration < 8 ? 1 : 0.5,
                  }}
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{
              guests_count: Math.min(2, selectedTable.seats),
            }}
          >
            <Form.Item
              label="Ваше имя"
              name="user_name"
              rules={[
                { required: true, message: "Пожалуйста, введите ваше имя" },
                { min: 2, message: "Имя должно содержать минимум 2 символа" },
              ]}
            >
              <Input placeholder="Иван Иванов" size="large" />
            </Form.Item>

            <Form.Item
              label="Телефон"
              name="user_phone"
              rules={[
                { required: true, message: "Пожалуйста, введите ваш телефон" },
                {
                  pattern: /^[\d\s\-\+\(\)]+$/,
                  message: "Введите корректный номер телефона",
                },
              ]}
            >
              <Input placeholder="+7 (999) 123-45-67" size="large" />
            </Form.Item>

            <Form.Item
              label="Количество гостей"
              name="guests_count"
              rules={[
                { required: true, message: "Укажите количество гостей" },
                {
                  type: "number",
                  min: 1,
                  max: selectedTable.seats,
                  message: `Максимум ${selectedTable.seats} гостей`,
                },
              ]}
            >
              <InputNumber
                min={1}
                max={selectedTable.seats}
                style={{ width: "100%" }}
                placeholder={`Максимум ${selectedTable.seats} мест`}
                size="large"
              />
            </Form.Item>

            <Form.Item label="Особые пожелания" name="special_requests">
              <Input.TextArea
                rows={3}
                placeholder="Например: детский стул, аллергия на орехи, праздничный торт..."
                maxLength={500}
                showCount
              />
            </Form.Item>

            <Form.Item style={{ marginTop: "32px" }}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "12px",
                  backgroundColor: loading ? "#95de64" : "#52c41a",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  fontSize: "16px",
                  fontWeight: "500",
                  cursor: loading ? "wait" : "pointer",
                  transition: "all 0.3s",
                }}
                onMouseOver={(e) => {
                  if (!loading)
                    e.currentTarget.style.backgroundColor = "#73d13d";
                }}
                onMouseOut={(e) => {
                  if (!loading)
                    e.currentTarget.style.backgroundColor = "#52c41a";
                }}
              >
                {loading
                  ? "Создание брони..."
                  : "Забронировать и перейти к оплате"}
              </button>
            </Form.Item>
          </Form>
        </>
      ) : (
        <div
          style={{
            textAlign: "center",
            padding: "40px 20px",
            color: "#666",
          }}
        >
          <Title level={4} style={{ marginBottom: "16px" }}>
            Выберите столик
          </Title>
          <Text>Для бронирования выберите свободный столик на плане слева</Text>
        </div>
      )}
    </div>
  );
};
