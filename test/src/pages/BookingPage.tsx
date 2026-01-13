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
import { ReservationService } from "../api/reservation.service";
import { PATHS } from "../paths";
import { useNavigate } from "react-router-dom";
import { TABLE_TEMPLATES, EDITOR_COLORS, CANVAS_SIZE } from "../tables";
import { useAuth } from "../useAuth";
import Header from "../app/component/Header";
import { BookingForm } from "../app/component/BookingForm";

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
    const [allReservations, setAllReservations] = useState<any[]>([]);
    const [selectedDateTime, setSelectedDateTime] = useState<Dayjs>(dayjs());
    const [selectedTable, setSelectedTable] = useState<TableItem | null>(null);
    const [loading, setLoading] = useState(false);
    const [restaurantName, setRestaurantName] = useState<string>("");
    const [restaurantAddress, setRestaurantAddress] = useState<string>("");
    const [restaurantPhone, setRestaurantPhone] = useState<string>("");
    const [duration, setDuration] = useState<number>(2); // Добавляем длительность
    const { user, loading: authLoading } = useAuth();
    const isAdmin = user?.role === "admin";

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

      if (restaurantId) {
        loadReservations();
      }
    }, [restaurantId, selectedDateTime]);

    // Функция для проверки, занят ли стол на выбранное время
    const getTableBookingInfo = (
      table: TableItem
    ): {
      isBooked: boolean;
      remainingTime?: string;
      endTime?: Dayjs;
      activeReservation?: any;
    } => {
      if (!table.tableId) return { isBooked: false };

      const selectedTime = selectedDateTime;

      // Ищем только подтвержденные брони (confirmed)
      const activeReservations = allReservations.filter((reservation) => {
        if (reservation.table_id !== table.tableId) return false;
        if (reservation.status !== "confirmed") return false; // Только подтвержденные

        const startTime = dayjs(reservation.date_time);
        const duration = reservation.duration || 2;
        const endTime = startTime.add(duration, "hour");

        // Проверяем, попадает ли выбранное время в интервал бронирования
        return selectedTime.isBetween(startTime, endTime, null, "[)");
      });

      if (activeReservations.length === 0) {
        return { isBooked: false };
      }

      // Берем ближайшую активную бронь
      const activeReservation = activeReservations[0];
      const startTime = dayjs(activeReservation.date_time);
      const reservationDuration = activeReservation.duration || 2;
      const endTime = startTime.add(reservationDuration, "hour");

      // Вычисляем оставшееся время
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

    const tablesWithStatus = useMemo(() => {
      return layoutItems
        .filter((item): item is TableItem => {
          return item.type === "table";
        })
        .map((table) => {
          const bookingInfo = getTableBookingInfo(table);
          const isBooked = bookingInfo.isBooked;

          return {
            ...table,
            isBooked: isBooked,
            bookingInfo: bookingInfo, // Добавляем информацию о бронировании
            imageUrl: isBooked
              ? TABLE_TEMPLATES.find((t) => t.type === table.tableType)
                  ?.bookedImageUrl || table.imageUrl
              : TABLE_TEMPLATES.find((t) => t.type === table.tableType)
                  ?.imageUrl || table.imageUrl,
          };
        });
    }, [layoutItems, allReservations, selectedDateTime]);

    const handleTableClick = (table: TableItem) => {
      // Проверяем доступность стола
      const bookingInfo = getTableBookingInfo(table);
      if (bookingInfo.isBooked) {
        alert(
          `Стол №${table.tableNumber} занят. Занят еще: ${bookingInfo.remainingTime}`
        );
        return;
      }
      setSelectedTable(table);
    };

    const handleReserve = async (reservationData: any) => {
      if (!selectedTable?.tableId) return;

      try {
        // Проверяем доступность еще раз перед созданием
        const availability = await ReservationService.checkAvailability(
          selectedTable.tableId,
          selectedDateTime.format("YYYY-MM-DD HH:mm:ss"),
          duration
        );

        if (!availability.available) {
          alert(
            "Стол стал недоступен. Пожалуйста, выберите другой столик или время."
          );
          setSelectedTable(null);
          return;
        }

        const reservationPayload = {
          table_id: selectedTable.tableId,
          date_time: selectedDateTime.format("YYYY-MM-DD HH:mm:ss"),
          user_name: reservationData.user_name,
          user_phone: reservationData.user_phone,
          guests_count: reservationData.guests_count,
          special_requests: reservationData.special_requests || "",
          duration: duration,
          price: 100, // Минимальный депозит
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

        alert(
          `Бронирование #${newReservation.id} создано! Переходим к оплате...`
        );

        // Переходим на страницу оплаты
        navigate(`${PATHS.PAYMENT}?reservation_id=${newReservation.id}`);
      } catch (error: any) {
        console.error("Детали ошибки:", error.response?.data);
        alert(
          `Ошибка: ${
            error.response?.data?.message || "Не удалось создать бронирование"
          }`
        );
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
            bookingInfo={tableWithStatus.bookingInfo} // Передаем информацию о бронировании
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
                    <LegendColor color="#ff4d4f" />
                    <span>Занято</span>
                  </LegendItem>
                  <LegendItem>
                    <LegendColor color="#faad14" />
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
                onDateTimeChange={setSelectedDateTime}
                restaurantName={restaurantName}
                duration={duration}
                onDurationChange={setDuration}
                isBooked={
                  selectedTable
                    ? getTableBookingInfo(selectedTable).isBooked
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
