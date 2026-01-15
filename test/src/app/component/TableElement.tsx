import React, { useRef, useEffect } from "react";
import { Group, Image, Text, Rect } from "react-konva";
import { useImage } from "react-konva-utils";
import { EDITOR_COLORS } from "../../tables";

interface TableItem {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  tableNumber: number;
  tableId: number;
  seats: number;
  imageUrl: string;
  isBooked: boolean;
  tableType: string;
}

interface Props {
  item: TableItem;
  isSelected: boolean;
  isBookingMode?: boolean;
  draggable?: boolean;
  onSelect: () => void;
  onTableClick?: (table: TableItem) => void;
  onChange: (updates: Partial<TableItem>) => void;
  bookingInfo?: {
    isBooked: boolean;
    remainingTime?: string;
    endTime?: any;
  };
  hasPendingReservation?: boolean;
}

export const TableElement: React.FC<Props> = ({
  item,
  isSelected,
  isBookingMode = false,
  draggable = true,
  onSelect,
  onTableClick,
  onChange,
  bookingInfo,
  hasPendingReservation = false,
}) => {
  const [image] = useImage(item.imageUrl);
  const groupRef = useRef<any>(null);

  useEffect(() => {
    if (isSelected && groupRef.current) {
      groupRef.current.moveToTop();
    }
  }, [isSelected]);

  const handleDragEnd = (e: any) => {
    onChange({
      x: e.target.x(),
      y: e.target.y(),
    });
  };

  const handleTransformEnd = (e: any) => {
    const node = e.target;
    onChange({
      x: node.x(),
      y: node.y(),
      rotation: node.rotation(),
    });
  };

  const handleClick = () => {
    if (isBookingMode && onTableClick) {
      onTableClick(item);
    } else if (!isBookingMode) {
      onSelect();
    }
  };

  // Определяем цвет обводки в зависимости от статуса
  const getStrokeColor = () => {
    if (bookingInfo?.isBooked) {
      // Стол занят (confirmed) - красный
      return EDITOR_COLORS.strokeBooked;
    }
    if (hasPendingReservation) {
      // Есть pending бронь (ожидает оплаты) - желтый
      return "#faad14";
    }
    if (isSelected) {
      // Выбранный стол - оранжевый
      return EDITOR_COLORS.strokeSelected;
    }
    return "transparent";
  };

  const getStrokeWidth = () => {
    if (bookingInfo?.isBooked || hasPendingReservation || isSelected) {
      return 2;
    }
    return 0;
  };

  // Определяем цвет фона в зависимости от статуса
  const getOverlayColor = () => {
    if (bookingInfo?.isBooked) {
      return "rgba(255, 77, 79, 0.3)"; // Красный для занятых
    }
    if (hasPendingReservation) {
      return "rgba(250, 173, 20, 0.2)"; // Желтый для ожидающих оплаты
    }
    return "transparent";
  };

  // Определяем цвет номера стола
  const getTableNumberColor = () => {
    if (bookingInfo?.isBooked) {
      return "#ff4d4f"; // Красный для занятых
    }
    if (hasPendingReservation) {
      return "#faad14"; // Желтый для ожидающих оплаты
    }
    return "#ffffff"; // Белый для свободных
  };

  // Получаем текст для отображения
  const getStatusText = () => {
    if (bookingInfo?.isBooked) {
      return `⌛ ${bookingInfo.remainingTime}`;
    }
    if (hasPendingReservation) {
      return "⏳ Ожидает оплаты";
    }
    return "";
  };

  const getStatusColor = () => {
    if (bookingInfo?.isBooked) {
      return "#ff4d4f";
    }
    if (hasPendingReservation) {
      return "#faad14";
    }
    return "#ffffff";
  };

  return (
    <Group
      ref={groupRef}
      id={item.id}
      x={item.x}
      y={item.y}
      rotation={item.rotation}
      draggable={draggable && !isBookingMode}
      onDragEnd={handleDragEnd}
      onTransformEnd={handleTransformEnd}
      onClick={handleClick}
      onTap={handleClick}
      width={item.width}
      height={item.height}
      transformFunc={(attrs: any) => {
        const newAttrs = { ...attrs };
        newAttrs.width = item.width;
        newAttrs.height = item.height;
        newAttrs.scaleX = 1;
        newAttrs.scaleY = 1;
        return newAttrs;
      }}
    >
      {/* Основное изображение стола */}
      <Image
        image={image}
        width={item.width}
        height={item.height}
        stroke={getStrokeColor()}
        strokeWidth={getStrokeWidth()}
        cornerRadius={8}
        shadowColor="rgba(0,0,0,0.4)"
        shadowBlur={8}
        shadowOffsetX={3}
        shadowOffsetY={3}
        shadowOpacity={0.6}
      />

      {/* Наложение в зависимости от статуса */}
      <Rect
        width={item.width}
        height={item.height}
        fill={getOverlayColor()}
        cornerRadius={8}
      />

      {/* ВНУТРЕННЯЯ группа для текста - компенсирует вращение основной группы */}
      <Group
        rotation={-item.rotation} // ОТРИЦАТЕЛЬНОЕ вращение - компенсирует вращение родительской группы
        x={item.width / 2} // Смещаем к центру стола
        y={item.height / 2} // Смещаем к центру стола
      >
        {/* Номер стола */}
        <Text
          text={item.tableNumber.toString()}
          x={0} // Теперь относительно центра
          y={0} // Теперь относительно центра
          offsetX={15} // Смещение для центрирования
          offsetY={15} // Смещение для центрирования
          width={30}
          height={30}
          fontSize={16}
          fontFamily="Arial, sans-serif"
          fill={getTableNumberColor()}
          align="center"
          verticalAlign="middle"
          fontWeight="bold"
          shadowColor="rgba(0,0,0,0.5)"
          shadowBlur={5}
          shadowOffsetX={2}
          shadowOffsetY={2}
        />

        {/* Информация о количестве мест */}
        <Text
          text={`${item.seats} мест`}
          x={0} // Относительно центра
          y={-item.height / 2 - 10} // Позиционируем над столом
          offsetX={20} // Смещение для центрирования
          fontSize={12}
          fontFamily="Arial"
          fill="#ffffff"
          align="center"
          shadowColor="rgba(0,0,0,0.5)"
          shadowBlur={4}
          shadowOffsetX={1}
          shadowOffsetY={1}
        />
      </Group>

      {/* ОТДЕЛЬНАЯ группа для статуса (вне основного вращения) */}
      {getStatusText() && (
        <Group
          x={item.width / 2} // Позиционируем относительно стола
          y={item.height + 20} // Под столом
        >
          <Text
            text={getStatusText()}
            x={0}
            y={0}
            offsetX={getStatusText().length * 3}
            fontSize={10}
            fontFamily="Arial"
            fill={getStatusColor()}
            align="center"
            shadowColor="rgba(0,0,0,0.5)"
            shadowBlur={4}
            shadowOffsetX={1}
            shadowOffsetY={1}
          />
        </Group>
      )}
    </Group>
  );
};
