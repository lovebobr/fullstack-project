// components/booking/BookingPage.tsx
import React, { useState, useEffect, useMemo } from "react";
import { Stage, Layer, Rect } from "react-konva";
import { observer } from "mobx-react-lite";
import { TableElement } from "../app/component/TableElement";
import { CanvasWrapper } from "../styled/canvas-style";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/ru";
import type { TableItem, WallItem, WindowItem } from "../app/component/Editor";
import { restaurantStore } from "../app/store/restaurant.store";
import {
  ReservationService,
  type Reservation,
} from "../api/reservation.service";
import { PATHS } from "../paths";
import { useNavigate } from "react-router-dom";
import { TABLE_TEMPLATES, EDITOR_COLORS, CANVAS_SIZE } from "../tables";
import { useAuth } from "../useAuth";
import Header from "../app/component/Header";
import { BookingForm } from "../app/component/BookingForm";
import { DatePicker, Typography } from "antd";

import {
  BookingContainer,
  BookingContent,
  PageHeader,
  PageTitle,
  PageSubtitle,
  BookingGrid,
  MapContainer,
  MapHeader,
  MapTitle,
  Legend,
  LegendItem,
  LegendColor,
  MapWrapper,
  FormContainer,
  LoadingOverlay,
  LoadingText,
} from "../styled/Booking.styles";

const { Text } = Typography;

interface BookingPageProps {
  restaurantId: number;
  onClose?: () => void;
}

type CanvasItem = TableItem | WallItem | WindowItem;

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

export const BookingPage: React.FC<BookingPageProps> = observer(
  ({ restaurantId, onClose }) => {
    const navigate = useNavigate();
    const [layoutItems, setLayoutItems] = useState<CanvasItem[]>([]);
    const [allReservations, setAllReservations] = useState<Reservation[]>([]);
    const [selectedDateTime, setSelectedDateTime] = useState<Dayjs>(dayjs());
    const [selectedTable, setSelectedTable] = useState<TableItem | null>(null);
    const [loading, setLoading] = useState(false);
    const [restaurantName, setRestaurantName] = useState<string>("");
    const [restaurantAddress, setRestaurantAddress] = useState<string>("");
    const [restaurantPhone, setRestaurantPhone] = useState<string>("");
    const [duration, setDuration] = useState<number>(2);
    const { user, loading: authLoading } = useAuth();

    useEffect(() => {
      const loadRestaurantData = async () => {
        setLoading(true);
        try {
          await restaurantStore.loadRestaurant(restaurantId);
          const restaurant = restaurantStore.currentRestaurant;

          if (restaurant) {
            setRestaurantName(restaurant.name || "Ресторан");
            setRestaurantAddress(restaurant.address || "");
            setRestaurantPhone(restaurant.phone || "");

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
          if (onClose) onClose();
        } finally {
          setLoading(false);
        }
      };

      if (restaurantId) {
        loadRestaurantData();
      }
    }, [restaurantId, onClose]);

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

      if (restaurantId && selectedDateTime) {
        loadReservations();
      }
    }, [restaurantId, selectedDateTime]);

    const getTableBookingInfo = (
      table: TableItem
    ): {
      isBooked: boolean;
      remainingTime?: string;
      endTime?: Dayjs;
      activeReservation?: Reservation;
    } => {
      if (!table.tableId) return { isBooked: false };

      const selectedTime = selectedDateTime;
      if (!selectedTime) return { isBooked: false };

      const activeReservations = allReservations.filter((reservation) => {
        if (reservation.table_id !== table.tableId) return false;

        if (reservation.status !== "confirmed") return false;

        const startTime = dayjs(reservation.date_time);
        const duration = reservation.duration || 2;
        const endTime = startTime.add(duration, "hour");

        return (
          (selectedTime.isAfter(startTime) || selectedTime.isSame(startTime)) &&
          selectedTime.isBefore(endTime)
        );
      });

      if (activeReservations.length === 0) {
        return { isBooked: false };
      }

      const activeReservation = activeReservations[0];
      const startTime = dayjs(activeReservation.date_time);
      const reservationDuration = activeReservation.duration || 2;
      const endTime = startTime.add(reservationDuration, "hour");

      const remainingMinutes = endTime.diff(selectedTime, "minute");
      const hours = Math.floor(remainingMinutes / 60);
      const minutes = remainingMinutes % 60;

      let remainingTime = "";
      if (hours > 0) remainingTime += `${hours} ч `;
      if (minutes > 0) remainingTime += `${minutes} мин`;

      return {
        isBooked: true,
        endTime: endTime,
        remainingTime: remainingTime || "0 мин",
        activeReservation: activeReservation,
      };
    };

    const getPendingReservationForTable = (
      tableId: number
    ): Reservation | null => {
      const pendingReservation = allReservations.find(
        (reservation) =>
          reservation.table_id === tableId && reservation.status === "pending"
      );
      return pendingReservation || null;
    };

    const tablesWithStatus = useMemo(() => {
      return layoutItems
        .filter((item): item is TableItem => {
          return item.type === "table";
        })
        .map((table) => {
          const bookingInfo = getTableBookingInfo(table);
          const pendingReservation = getPendingReservationForTable(
            table.tableId
          );

          let displayStatus = "free";
          if (bookingInfo.isBooked) {
            displayStatus = "booked";
          } else if (pendingReservation) {
            displayStatus = "pending";
          }

          return {
            ...table,
            bookingInfo: bookingInfo,
            hasPendingReservation: !!pendingReservation,
            displayStatus: displayStatus,
            imageUrl: bookingInfo.isBooked
              ? TABLE_TEMPLATES.find((t) => t.type === table.tableType)
                  ?.bookedImageUrl || table.imageUrl
              : TABLE_TEMPLATES.find((t) => t.type === table.tableType)
                  ?.imageUrl || table.imageUrl,
          };
        });
    }, [layoutItems, allReservations, selectedDateTime]);

    const handleTableClick = (table: TableItem) => {
      const bookingInfo = getTableBookingInfo(table);

      if (bookingInfo.isBooked && bookingInfo.remainingTime) {
        alert(
          `Стол №${table.tableNumber} занят. Занят еще: ${bookingInfo.remainingTime}`
        );
        return;
      }

      const pendingReservation = getPendingReservationForTable(table.tableId);
      if (pendingReservation) {
        alert(
          `Стол №${table.tableNumber} ожидает оплаты бронирования. Пожалуйста, выберите другой столик.`
        );
        return;
      }

      setSelectedTable(table);
    };

    const handleReserve = async (reservationData: any) => {
      if (!selectedTable?.tableId || !selectedDateTime) {
        alert("Пожалуйста, выберите стол и дату");
        return;
      }

      try {
        const dateTimeString = selectedDateTime.format("YYYY-MM-DD HH:mm:ss");

        const availability = await ReservationService.checkAvailability(
          selectedTable.tableId,
          dateTimeString,
          duration
        );

        if (!availability.available) {
          alert(
            availability.message ||
              "Стол уже занят на это время. Пожалуйста, выберите другой столик или время."
          );
          setSelectedTable(null);
          return;
        }

        const reservationPayload = {
          table_id: selectedTable.tableId,
          date_time: dateTimeString,
          user_name: reservationData.user_name,
          user_phone: reservationData.user_phone,
          guests_count: reservationData.guests_count,
          special_requests: reservationData.special_requests || "",
          duration: duration,
          price: 100,
        };

        const newReservation = await ReservationService.create(
          reservationPayload
        );

        if (!newReservation?.id) {
          throw new Error("Не получен ID бронирования");
        }

        const dateStr = selectedDateTime.format("YYYY-MM-DD");
        const updatedReservations = await ReservationService.getByRestaurant(
          restaurantId,
          dateStr
        );
        setAllReservations(updatedReservations);

        alert(
          `Бронирование #${newReservation.id} создано! Переходим к оплате...\n\n` +
            `Статус: Ожидает оплаты (pending)\n` +
            `Стол станет занятым только после подтверждения оплаты.`
        );

        navigate(`${PATHS.PAYMENT}?reservation_id=${newReservation.id}`);
      } catch (error: any) {
        console.error("Детали ошибки:", error.response?.data);

        if (error.response?.status === 409) {
          alert(
            "Стол уже занят на это время. Пожалуйста, выберите другое время или другой столик."
          );
        } else {
          alert(
            `Ошибка: ${
              error.response?.data?.message || "Не удалось создать бронирование"
            }`
          );
        }
      }
    };

    const handleBookTable = () => {
      document
        .getElementById("booking-form")
        ?.scrollIntoView({ behavior: "smooth" });
    };

    const handleViewMenu = () => {
      navigate(PATHS.MENU);
    };

    const handleDurationChange = (newDuration: number) => {
      if (newDuration >= 1 && newDuration <= 4) {
        setDuration(newDuration);
      }
    };

    const handleDateTimeChange = (date: Dayjs | null) => {
      if (date) {
        setSelectedDateTime(date);
      } else {
        // Если пользователь очистил выбор, устанавливаем текущую дату
        setSelectedDateTime(dayjs());
      }
    };

    const renderItem = (item: CanvasItem) => {
      if (item.type === "table") {
        const tableWithStatus =
          tablesWithStatus.find((t) => t.id === item.id) || item;

        return (
          <TableElement
            key={item.id}
            item={{ ...tableWithStatus }}
            isSelected={selectedTable?.id === item.id}
            isBookingMode={true}
            onTableClick={handleTableClick}
            onSelect={() => {}}
            onChange={() => {}}
            bookingInfo={tableWithStatus.bookingInfo}
            hasPendingReservation={tableWithStatus.hasPendingReservation}
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

    // Получаем отформатированные дату и время с проверкой
    const formattedDate = selectedDateTime
      ? selectedDateTime.format("DD.MM.YYYY")
      : "Дата не выбрана";

    const formattedTime = selectedDateTime
      ? selectedDateTime.format("HH:mm")
      : "--:--";

    return (
      <BookingContainer>
        <Header
          restaurantName={restaurantName}
          address={restaurantAddress}
          phone={restaurantPhone}
          showButtons={true}
          onBookTable={handleBookTable}
          onViewMenu={handleViewMenu}
        />

        <BookingContent>
          <PageHeader>
            <PageTitle>Бронирование столика</PageTitle>
            <PageSubtitle>
              Выберите свободный столик на плане ресторана и укажите дату
              посещения
            </PageSubtitle>
          </PageHeader>

          {/* Блок выбора времени и даты */}
          <div
            style={{
              marginBottom: "24px",
              padding: "24px",
              backgroundColor: "#f6ffed",
              borderRadius: "8px",
              border: "1px solid #b7eb8f",
            }}
          >
            <Text
              strong
              style={{
                display: "block",
                marginBottom: "12px",
                fontSize: "16px",
              }}
            >
              Выберите дату и время посещения:
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
                onChange={handleDateTimeChange}
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
                <Text strong>{formattedDate}</Text>
                <Text>в</Text>
                <Text strong>{formattedTime}</Text>
              </div>
            </div>

            {/* Выбор длительности */}
            <div style={{ marginTop: "16px" }}>
              <Text
                strong
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "16px",
                }}
              >
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
                <Text
                  strong
                  style={{
                    minWidth: "50px",
                    textAlign: "center",
                    fontSize: "16px",
                  }}
                >
                  {duration} ч
                </Text>
                <button
                  type="button"
                  onClick={() => handleDurationChange(duration + 1)}
                  disabled={duration >= 4}
                  style={{
                    padding: "6px 12px",
                    border: "1px solid #d9d9d9",
                    borderRadius: "4px",
                    background: "#fff",
                    cursor: duration < 4 ? "pointer" : "not-allowed",
                    opacity: duration < 4 ? 1 : 0.5,
                  }}
                >
                  +
                </button>
                <Text type="secondary" style={{ fontSize: "14px" }}>
                  (от 1 до 4 часов)
                </Text>
              </div>
            </div>
          </div>

          <BookingGrid>
            <MapContainer>
              <MapHeader>
                <MapTitle>План ресторана</MapTitle>
                <Legend>
                  <LegendItem>
                    <LegendColor color="#52c41a" />
                    <span>Свободно</span>
                  </LegendItem>
                  <LegendItem>
                    <LegendColor color="#faad14" />
                    <span>Ожидает оплаты</span>
                  </LegendItem>
                  <LegendItem>
                    <LegendColor color="#ff4d4f" />
                    <span>Занято</span>
                  </LegendItem>
                  <LegendItem>
                    <LegendColor color="#1890ff" />
                    <span>Выбрано</span>
                  </LegendItem>
                </Legend>
              </MapHeader>

              <MapWrapper>
                {loading ? (
                  <LoadingOverlay>
                    <LoadingText>Загрузка плана...</LoadingText>
                  </LoadingOverlay>
                ) : (
                  <CanvasWrapper>
                    <Stage
                      width={CANVAS_SIZE.width}
                      height={CANVAS_SIZE.height}
                    >
                      <Layer>
                        {layoutItems
                          .filter((item) => item.type !== "table")
                          .map(renderItem)}

                        {layoutItems
                          .filter(
                            (item): item is TableItem => item.type === "table"
                          )
                          .map(renderItem)}
                      </Layer>
                    </Stage>
                  </CanvasWrapper>
                )}
              </MapWrapper>
            </MapContainer>

            <FormContainer id="booking-form">
              <BookingForm
                selectedTable={selectedTable}
                selectedDateTime={selectedDateTime}
                onDateTimeChange={handleDateTimeChange}
                restaurantName={restaurantName}
                duration={duration}
                onDurationChange={handleDurationChange}
                isBooked={
                  selectedTable
                    ? getTableBookingInfo(selectedTable).isBooked
                    : false
                }
                hasPendingReservation={
                  selectedTable
                    ? !!getPendingReservationForTable(selectedTable.tableId)
                    : false
                }
                bookingInfo={
                  selectedTable ? getTableBookingInfo(selectedTable) : undefined
                }
                onReserve={handleReserve}
              />
            </FormContainer>
          </BookingGrid>
        </BookingContent>
      </BookingContainer>
    );
  }
);
