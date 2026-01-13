import React from "react";
import {
  Modal,
  Typography,
  Form,
  Input,
  InputNumber,
  Button,
  Divider,
} from "antd";
import type { FurnitureItem } from "../app/component/Editor";
import { Dayjs } from "dayjs";

const { Title, Text } = Typography;

interface TableModalProps {
  table: FurnitureItem;
  isOpen: boolean;
  onClose: () => void;
  onReserve: (reservationData: any) => Promise<void>;
  selectedDateTime: Dayjs;
  isBooked: boolean;
  restaurantName: string; // Добавляем новый пропс для названия ресторана
}

export const TableModal: React.FC<TableModalProps> = ({
  table,
  isOpen,
  onClose,
  onReserve,
  selectedDateTime,
  isBooked,
  restaurantName, // Получаем название ресторана
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);

  // Форматируем дату и время для отображения
  const formattedDate = selectedDateTime.format("DD.MM.YYYY");
  const formattedTime = selectedDateTime.format("HH:mm");

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const reservationData = {
        ...values,
        // Используем выбранное в фильтре время
        date_time: selectedDateTime.format("YYYY-MM-DD HH:mm:ss"),
      };

      await onReserve(reservationData);
    } catch (error) {
      console.error("Ошибка валидации:", error);
    } finally {
      setLoading(false);
    }
  };

  // Если стол занят, показываем информационное сообщение
  if (isBooked) {
    return (
      <Modal
        title="Столик занят"
        open={isOpen}
        onCancel={onClose}
        footer={[
          <Button key="close" onClick={onClose}>
            Закрыть
          </Button>,
        ]}
      >
        <div style={{ textAlign: "center", padding: "20px" }}>
          <Text type="warning" style={{ fontSize: "16px" }}>
            Этот столик уже забронирован на {formattedDate} в {formattedTime}
          </Text>
          <div style={{ marginTop: "20px" }}>
            <Text>Пожалуйста, выберите другое время или другой столик.</Text>
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      title={
        <div>
          <Title level={4} style={{ margin: 0 }}>
            Бронирование столика {table.tableNumber}
          </Title>
          {/* Добавляем название ресторана под заголовком */}
          <Text
            type="secondary"
            style={{ fontSize: "14px", display: "block", marginTop: "4px" }}
          >
            {restaurantName}
          </Text>
        </div>
      }
      open={isOpen}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Отмена
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={handleSubmit}
        >
          Забронировать
        </Button>,
      ]}
      width={500}
    >
      <div
        style={{
          marginBottom: "24px",
          padding: "16px",
          backgroundColor: "#f6ffed",
          borderRadius: "8px",
        }}
      >
        <Text strong style={{ display: "block", marginBottom: "8px" }}>
          Дата и время бронирования:
        </Text>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div
            style={{
              padding: "8px 12px",
              backgroundColor: "#fff",
              borderRadius: "4px",
              border: "1px solid #d9d9d9",
            }}
          >
            <Text strong>{formattedDate}</Text>
          </div>
          <Text>в</Text>
          <div
            style={{
              padding: "8px 12px",
              backgroundColor: "#fff",
              borderRadius: "4px",
              border: "1px solid #d9d9d9",
            }}
          >
            <Text strong>{formattedTime}</Text>
          </div>
        </div>
        <Text
          type="secondary"
          style={{ display: "block", marginTop: "8px", fontSize: "12px" }}
        >
          Чтобы изменить время, вернитесь к фильтру выше
        </Text>
      </div>

      <Form form={form} layout="vertical">
        <Form.Item
          label="Ваше имя"
          name="user_name"
          rules={[
            { required: true, message: "Пожалуйста, введите ваше имя" },
            { min: 2, message: "Имя должно содержать минимум 2 символа" },
          ]}
        >
          <Input placeholder="Иван Иванов" />
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
          <Input placeholder="+7 (999) 123-45-67" />
        </Form.Item>

        <Form.Item
          label="Количество гостей"
          name="guests_count"
          initialValue={2}
          rules={[
            { required: true, message: "Укажите количество гостей" },
            {
              type: "number",
              min: 1,
              max: table.maxGuests || 10,
              message: `Максимум ${table.maxGuests || 10} гостей`,
            },
          ]}
        >
          <InputNumber
            min={1}
            max={table.maxGuests || 10}
            style={{ width: "100%" }}
            placeholder="Количество гостей"
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
      </Form>
    </Modal>
  );
};
