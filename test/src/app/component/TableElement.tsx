// components/editor/TableElement.tsx
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
}

export const TableElement: React.FC<Props> = ({
  item,
  isSelected,
  isBookingMode = false,
  draggable = true,
  onSelect,
  onTableClick,
  onChange,
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

  const getStrokeColor = () => {
    if (item.isBooked) return EDITOR_COLORS.strokeBooked;
    if (isSelected) return EDITOR_COLORS.strokeSelected;
    return "transparent";
  };

  const getStrokeWidth = () => {
    if (isSelected) return 3;
    if (item.isBooked) return 2;
    return 0;
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

      {/* Дополнительный слой для занятых столов */}
      {item.isBooked && (
        <Rect
          width={item.width}
          height={item.height}
          fill="rgba(220, 53, 69, 0.25)"
          cornerRadius={8}
        />
      )}

      {/* Номер стола по центру */}
      <Text
        text={item.tableNumber.toString()}
        x={item.width / 2}
        y={item.height / 2}
        offsetX={15}
        offsetY={15}
        width={30}
        height={30}
        fontSize={16}
        fontFamily="Arial, sans-serif"
        fill={item.isBooked ? "#dc3545" : "#ffffff"}
        align="center"
        verticalAlign="middle"
        fontWeight="bold"
        shadowColor="rgba(0,0,0,0.5)"
        shadowBlur={5}
        shadowOffsetX={2}
        shadowOffsetY={2}
      />
    </Group>
  );
};
