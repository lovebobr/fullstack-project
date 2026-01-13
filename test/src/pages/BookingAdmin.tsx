// components/admin/BookingAdmin.tsx
import React, { useState, useEffect, useMemo } from "react";
import { Stage, Layer, Rect } from "react-konva";
import { observer } from "mobx-react-lite";
import { TableElement } from "../app/component/TableElement";
import { CanvasWrapper } from "../styled/canvas-style";
import {
  DatePicker,
  Typography,
  Button,
  Form,
  Input,
  InputNumber,
  Select,
  message,
  Modal,
} from "antd";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/ru";
import type { TableItem, WallItem, WindowItem } from "../app/component/Editor";
import { restaurantStore } from "../app/store/restaurant.store";
import { ReservationService } from "../api/reservation.service";
import { TABLE_TEMPLATES, EDITOR_COLORS, CANVAS_SIZE } from "../tables";
import styled from "styled-components";

const { Text } = Typography;
const { TextArea } = Input;

interface BookingAdminProps {
  restaurantId: number;
  onClose: () => void;
  userRole?: string;
}

type CanvasItem = TableItem | WallItem | WindowItem;

// Стили для админской версии
const BookingAdminContainer = styled.div`
  padding: 20px;
  min-height: 100vh;
  background-color: ${EDITOR_COLORS.background};
  color: #fff;
`;

const HeaderSection = styled.div`
  margin-bottom: 30px;
`;

const BackButton = styled.button`
  margin-bottom: 20px;
  padding: 10px 20px;
  background: #333;
  border: 1px solid #444;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #fff;
  font-size: 14px;
  transition: all 0.2s;

  &:hover {
    background: #444;
  }
`;

const TitleSection = styled.div`
  margin-bottom: 20px;
`;

const DateTimeSection = styled.div`
  margin-bottom: 20px;
  padding: 15px;
  background-color: #333;
  border-radius: 8px;
  border: 1px solid #444;
  display: flex;
  align-items: center;
  gap: 10px;
`;

// Модальное окно для бронирования
const BookingModalContent = styled.div`
  background: ${EDITOR_COLORS.background};
  padding: 0;
  border-radius: 8px;
  overflow: hidden;
`;

const ModalHeader = styled.div`
  padding: 20px;
  background-color: #333;
  border-bottom: 1px solid #444;
`;

const ModalBody = styled.div`
  padding: 20px;
`;

const TableInfoSection = styled.div`
  background: rgba(244, 97, 108, 0.1);
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  border: 1px solid rgba(244, 97, 108, 0.3);
`;

const TableInfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
  color: #fff;

  &:last-child {
    margin-bottom: 0;
  }

  strong {
    color: #f4616c;
    min-width: 120px;
  }
`;

const convertTableToCanvas = (table: any): TableItem => {
  const template =
    TABLE_TEMPLATES.find((t) => t.type === table.tableType) ||
    TABLE_TEMPLATES[0];

  return {
    id: table.id,
    x: table.position?.x || 100,
    y: table.position?.y || 100,
    width: table.size?.width || template.width,
    height: table.size?.height || template.height,
    rotation: table.rotation || 0,
    type: "table",
    imageUrl: template.imageUrl,
    tableNumber: table.tableNumber,
    tableId: table.tableId,
    seats: table.seats,
    isBooked: false,
    tableType: table.tableType || "table-4-1",
  };
};

const convertWallToCanvas = (wall: any): WallItem => ({
  id: wall.id,
  x: wall.position?.x || 100,
  y: wall.position?.y || 100,
  width: wall.size?.width || 100,
  height: wall.size?.height || 20,
  rotation: wall.rotation || 0,
  type: "wall",
  color: wall.color || EDITOR_COLORS.wall,
});

const convertWindowToCanvas = (window: any): WindowItem => ({
  id: window.id,
  x: window.position?.x || 100,
  y: window.position?.y || 100,
  width: window.size?.width || 100,
  height: window.size?.height || 20,
  rotation: window.rotation || 0,
  type: "window",
  stroke: window.stroke || EDITOR_COLORS.window,
  strokeWidth: window.strokeWidth || 4,
});

export const BookingAdmin: React.FC<BookingAdminProps> = observer(
  ({ restaurantId, onClose, userRole }) => {
    const [layoutItems, setLayoutItems] = useState<CanvasItem[]>([]);
    const [allReservations, setAllReservations] = useState<any[]>([]);
    const [selectedDateTime, setSelectedDateTime] = useState<Dayjs>(dayjs());
    const [selectedTable, setSelectedTable] = useState<TableItem | null>(null);
    const [loading, setLoading] = useState(false);
    const [restaurantName, setRestaurantName] = useState<string>("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
      const loadRestaurantData = async () => {
        setLoading(true);
        try {
          await restaurantStore.loadRestaurant(restaurantId);
          const restaurant = restaurantStore.currentRestaurant;

          if (restaurant) {
            setRestaurantName(restaurant.name || "Ресторан");

            const layout = restaurant.layout_data;
            if (layout) {
              const items: CanvasItem[] = [
                ...(layout.tables || []).map(convertTableToCanvas),
                ...(layout.walls || []).map(convertWallToCanvas),
                ...(layout.windows || []).map(convertWindowToCanvas),
              ];
              setLayoutItems(items);
            }
          }
        } catch (error) {
          console.error("Ошибка загрузки ресторана:", error);
          onClose();
        } finally {
          setLoading(false);
        }
      };

      if (restaurantId) {
        loadRestaurantData();
      }
    }, [restaurantId, onClose]);

    // Загружаем бронирования для выбранной ДАТЫ
    useEffect(() => {
      const loadReservations = async () => {
        try {
          const dateStr = selectedDateTime.format("YYYY-MM-DD");
          const reservationsData = await ReservationService.getByRestaurant(
            restaurantId,
            dateStr
          );
          setAllReservations(reservationsData);
        } catch (error) {
          console.error("Ошибка загрузки бронирований:", error);
        }
      };

      if (restaurantId) {
        loadReservations();
      }
    }, [restaurantId, selectedDateTime]);

    // Функция проверки, занят ли стол на выбранное время
    const isTableBookedAtSelectedTime = (table: TableItem): boolean => {
      if (!table.tableId) return false;

      const selectedTimeStr = selectedDateTime.format("YYYY-MM-DD HH:mm");

      return allReservations.some((reservation) => {
        if (reservation.table_id !== table.tableId) return false;
        const reservationTimeStr = reservation.date_time.substring(0, 16);
        return reservationTimeStr === selectedTimeStr;
      });
    };

    // Обновляем статусы столов
    const tablesWithStatus = useMemo(() => {
      return layoutItems
        .filter((item): item is TableItem => {
          return item.type === "table";
        })
        .map((table) => ({
          ...table,
          isBooked: isTableBookedAtSelectedTime(table),
          imageUrl: isTableBookedAtSelectedTime(table)
            ? TABLE_TEMPLATES.find((t) => t.type === table.tableType)
                ?.bookedImageUrl || table.imageUrl
            : TABLE_TEMPLATES.find((t) => t.type === table.tableType)
                ?.imageUrl || table.imageUrl,
        }));
    }, [layoutItems, allReservations, selectedDateTime]);

    const handleTableClick = (table: TableItem) => {
      const isBooked = isTableBookedAtSelectedTime(table);

      if (isBooked) {
        message.warning(
          `Столик №${table.tableNumber} занят на выбранное время. Выберите другое время или столик.`
        );
        return;
      }

      setSelectedTable(table);
      setIsModalOpen(true);

      // Сбрасываем форму и устанавливаем значения по умолчанию
      form.resetFields();
      form.setFieldsValue({
        guests_count: table.seats || 2,
        status: "confirmed",
      });
    };

    const handleCloseModal = () => {
      setIsModalOpen(false);
      setSelectedTable(null);
      form.resetFields();
    };

    const handleReserve = async (values: any) => {
      if (!selectedTable?.tableId) {
        message.error("Выберите столик для бронирования");
        return;
      }

      try {
        const reservationPayload = {
          table_id: selectedTable.tableId,
          date_time: selectedDateTime.format("YYYY-MM-DD HH:mm:ss"),
          user_name: values.user_name,
          user_phone: values.user_phone,
          user_email: values.user_email || undefined,
          guests_count: values.guests_count,
          special_requests: values.special_requests || "",
          status: values.status || "confirmed",
        };

        const newReservation = await ReservationService.create(
          reservationPayload
        );

        if (!newReservation?.id) {
          throw new Error("Не получен ID бронирования");
        }

        // Обновляем список бронирований
        const dateStr = selectedDateTime.format("YYYY-MM-DD");
        const updatedReservations = await ReservationService.getByRestaurant(
          restaurantId,
          dateStr
        );
        setAllReservations(updatedReservations);

        message.success(`Бронирование #${newReservation.id} успешно создано!`);

        // Закрываем модальное окно
        handleCloseModal();
      } catch (error: any) {
        console.error("Детали ошибки:", error.response?.data);
        message.error(
          `Ошибка: ${
            error.response?.data?.message || "Не удалось создать бронирование"
          }`
        );
      }
    };

    // Генерируем опции для количества гостей на основе выбранного стола
    const generateGuestOptions = () => {
      if (!selectedTable) return [];

      const maxGuests = selectedTable.seats || 10;
      const options = [];

      for (let i = 1; i <= maxGuests; i++) {
        options.push({
          value: i,
          label: `${i} ${getGuestWord(i)}`,
        });
      }

      return options;
    };

    const getGuestWord = (count: number) => {
      if (count === 1) return "гость";
      if (count >= 2 && count <= 4) return "гостя";
      return "гостей";
    };

    const renderItem = (item: CanvasItem) => {
      if (item.type === "table") {
        const tableWithStatus =
          tablesWithStatus.find((t) => t.id === item.id) || item;
        const isBooked = isTableBookedAtSelectedTime(tableWithStatus);

        return (
          <TableElement
            key={item.id}
            item={{ ...tableWithStatus, isBooked }}
            isSelected={false}
            isBookingMode={true}
            onTableClick={handleTableClick}
            onSelect={() => {}}
            onChange={() => {}}
          />
        );
      } else if (item.type === "wall") {
        return (
          <Rect
            key={item.id}
            id={item.id}
            x={item.x}
            y={item.y}
            width={item.width}
            height={item.height}
            rotation={item.rotation}
            fill={item.color || EDITOR_COLORS.wall}
          />
        );
      } else if (item.type === "window") {
        return (
          <Rect
            key={item.id}
            id={item.id}
            x={item.x}
            y={item.y}
            width={item.width}
            height={item.height}
            rotation={item.rotation}
            stroke={item.stroke || EDITOR_COLORS.window}
            strokeWidth={item.strokeWidth || 4}
          />
        );
      }
      return null;
    };

    if (loading) {
      return (
        <BookingAdminContainer>
          <BackButton onClick={onClose}>
            <span>←</span> Назад к панели управления
          </BackButton>
          <div style={{ textAlign: "center", padding: "40px", color: "#fff" }}>
            Загрузка ресторана...
          </div>
        </BookingAdminContainer>
      );
    }

    return (
      <BookingAdminContainer>
        <HeaderSection>
          <BackButton onClick={onClose}>
            <span>←</span> Назад к панели управления
          </BackButton>

          <TitleSection>
            <h1 style={{ marginBottom: "4px", color: "#fff" }}>
              Административное бронирование
            </h1>
            <Text strong style={{ fontSize: "18px", color: "#1890ff" }}>
              {restaurantName || "Загрузка..."}
            </Text>
          </TitleSection>

          <DateTimeSection>
            <label
              style={{
                fontWeight: "bold",
                color: "#fff",
                whiteSpace: "nowrap",
              }}
            >
              Выберите дату и время:{" "}
            </label>
            <DatePicker
              showTime
              format="YYYY-MM-DD HH:mm"
              value={selectedDateTime}
              onChange={(date) => setSelectedDateTime(date || dayjs())}
              style={{
                width: 200,
                backgroundColor: "#444",
                borderColor: "#555",
                color: "#fff",
              }}
              placeholder="Выберите дату и время"
              disabledDate={(current) =>
                current && current < dayjs().startOf("day")
              }
            />
          </DateTimeSection>
        </HeaderSection>

        <CanvasWrapper>
          <div style={{ marginBottom: "10px", color: "#ccc" }}>
            Выберите столик на плане зала:
          </div>
          <Stage width={CANVAS_SIZE.width} height={CANVAS_SIZE.height}>
            <Layer>
              {layoutItems
                .filter((item) => item.type !== "table")
                .map(renderItem)}

              {layoutItems
                .filter((item): item is TableItem => item.type === "table")
                .map(renderItem)}
            </Layer>
          </Stage>
        </CanvasWrapper>

        {/* Модальное окно для бронирования */}
        <Modal
          title="Бронирование столика"
          open={isModalOpen}
          onCancel={handleCloseModal}
          footer={null}
          width={600}
          style={{ top: 20 }}
        >
          <BookingModalContent>
            <ModalHeader>
              <h3 style={{ margin: 0, color: "#fff" }}>
                Заполните данные для бронирования
              </h3>
            </ModalHeader>

            <ModalBody>
              {selectedTable && (
                <TableInfoSection>
                  <TableInfoRow>
                    <strong>Ресторан:</strong>
                    <span>{restaurantName}</span>
                  </TableInfoRow>
                  <TableInfoRow>
                    <strong>Столик №:</strong>
                    <span>{selectedTable.tableNumber}</span>
                  </TableInfoRow>
                  <TableInfoRow>
                    <strong>Мест:</strong>
                    <span>{selectedTable.seats || 2}</span>
                  </TableInfoRow>
                  <TableInfoRow>
                    <strong>Дата и время:</strong>
                    <span>{selectedDateTime.format("DD.MM.YYYY HH:mm")}</span>
                  </TableInfoRow>
                </TableInfoSection>
              )}

              <Form
                form={form}
                layout="vertical"
                onFinish={handleReserve}
                initialValues={{
                  status: "confirmed",
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "20px",
                    marginBottom: "20px",
                  }}
                >
                  <Form.Item
                    name="user_name"
                    label="Имя клиента"
                    rules={[{ required: true, message: "Введите имя клиента" }]}
                  >
                    <Input
                      placeholder="Иван Иванов"
                      style={{
                        backgroundColor: "#444",
                        borderColor: "#555",
                        color: "#fff",
                      }}
                    />
                  </Form.Item>

                  <Form.Item
                    name="user_phone"
                    label="Телефон"
                    rules={[{ required: true, message: "Введите телефон" }]}
                  >
                    <Input
                      placeholder="+7 (999) 999-99-99"
                      style={{
                        backgroundColor: "#444",
                        borderColor: "#555",
                        color: "#fff",
                      }}
                    />
                  </Form.Item>

                  <Form.Item name="user_email" label="Email">
                    <Input
                      placeholder="client@example.com"
                      style={{
                        backgroundColor: "#444",
                        borderColor: "#555",
                        color: "#fff",
                      }}
                    />
                  </Form.Item>

                  <Form.Item
                    name="guests_count"
                    label="Количество гостей"
                    rules={[
                      {
                        required: true,
                        message: "Укажите количество гостей",
                        type: "number",
                        min: 1,
                        max: selectedTable?.seats || 10,
                      },
                    ]}
                  >
                    <Select
                      style={{ backgroundColor: "#444", color: "#fff" }}
                      options={generateGuestOptions()}
                    />
                  </Form.Item>
                </div>

                <Form.Item name="special_requests" label="Особые пожелания">
                  <TextArea
                    rows={3}
                    placeholder="Аллергии, детские стулья, праздничный торт и т.д."
                    style={{
                      backgroundColor: "#444",
                      borderColor: "#555",
                      color: "#fff",
                    }}
                  />
                </Form.Item>

                <Form.Item
                  name="status"
                  label="Статус бронирования"
                  initialValue="confirmed"
                >
                  <Select
                    style={{
                      backgroundColor: "#444",
                      color: "#fff",
                      width: "200px",
                    }}
                    options={[
                      { value: "confirmed", label: "Подтверждено" },
                      { value: "pending", label: "Ожидает подтверждения" },
                    ]}
                  />
                </Form.Item>

                <Form.Item>
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      justifyContent: "flex-end",
                    }}
                  >
                    <Button
                      type="default"
                      onClick={handleCloseModal}
                      style={{
                        backgroundColor: "#666",
                        borderColor: "#777",
                        color: "#fff",
                      }}
                    >
                      Отмена
                    </Button>
                    <Button
                      type="primary"
                      htmlType="submit"
                      style={{
                        backgroundColor: "#f4616c",
                        borderColor: "#f4616c",
                      }}
                    >
                      Создать бронирование
                    </Button>
                  </div>
                </Form.Item>
              </Form>
            </ModalBody>
          </BookingModalContent>
        </Modal>
      </BookingAdminContainer>
    );
  }
);
