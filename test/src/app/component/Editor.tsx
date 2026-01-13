// components/editor/Editor.tsx
import React, { useState, useRef, useCallback, useEffect } from "react";
import { Stage, Layer, Transformer, Rect } from "react-konva";
import { TableElement } from "./TableElement";
import {
  Container,
  Sidebar,
  CanvasWrapper,
  Button,
  TableItem as StyledTableItem,
  ControlSection,
} from "../../styled/canvas-style";
import { restaurantStore } from "../store/restaurant.store";
import { observer } from "mobx-react-lite";
import {
  TABLE_TEMPLATES,
  WALL_TEMPLATES,
  EDITOR_COLORS,
  CANVAS_SIZE,
  ROTATION_SNAPS,
} from "../../tables";
import styled, { keyframes } from "styled-components";
import { Modal } from "./ModalConfirm";
const generateId = () =>
  `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

interface BaseItem {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
}

export interface WallItem extends BaseItem {
  type: "wall";
  color?: string;
}

export interface WindowItem extends BaseItem {
  type: "window";
  stroke?: string;
  strokeWidth?: number;
  fill: string;
}

export interface TableItem extends BaseItem {
  type: "table";
  tableNumber?: number;
  tableId?: number;
  seats: number;
  imageUrl: string;
  isBooked: boolean;
  tableType: string;
}

type CanvasItem = TableItem | WallItem | WindowItem;

interface EditorProps {
  restaurantId: number;
  userRole?: "admin" | "manager" | "user";
}

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
    imageUrl: table.isBooked ? template.bookedImageUrl : template.imageUrl,
    tableNumber: table.tableNumber,
    tableId: table.tableId,
    seats: table.seats,
    isBooked: table.isBooked || false,
    tableType: table.tableType,
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
  fill: EDITOR_COLORS.window,
});

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const LoaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
  padding: 3rem;
`;

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #ff9500;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const LoadingText = styled.p`
  color: #fff;
  font-size: 16px;
  margin: 0;
  font-family: "Isadora Cyr", system-ui, Avenir, Helvetica, Arial, sans-serif;
`;

const Loader = ({ text = "Сохранение..." }: { text?: string }) => (
  <LoaderContainer>
    <Spinner />
    <LoadingText>{text}</LoadingText>
  </LoaderContainer>
);

export const Editor: React.FC<EditorProps> = observer(
  ({ restaurantId, userRole }) => {
    const [items, setItems] = useState<CanvasItem[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [activeTool, setActiveTool] = useState<"table" | "wall" | "window">(
      "table"
    );
    const [selectedWallTemplate, setSelectedWallTemplate] = useState(
      WALL_TEMPLATES[0]
    );
    const [saving, setSaving] = useState<boolean>(false);
    const stageRef = useRef<any>(null);
    const transformerRef = useRef<any>(null);
    const isAdmin = userRole === "admin";
    const isManager = userRole === "manager";

    const [modalState, setModalState] = useState<{
      isOpen: boolean;
      title: string;
      message: string;
      type: "info" | "warning" | "danger";
      onConfirm: () => Promise<void>;
    }>({
      isOpen: false,
      title: "",
      message: "",
      type: "info",
      onConfirm: async () => {},
    });

    const canCreateTables = isAdmin;
    const canCreateWalls = isAdmin;
    const canCreateWindows = isAdmin;
    const canDeleteItems = isAdmin;
    const canClearAll = isAdmin;
    const canMoveItems = true;
    const canRotateItems = true;
    const canResizeItems = false;

    useEffect(() => {
      const loadLayout = async () => {
        try {
          await restaurantStore.loadRestaurant(restaurantId);
          const layout = restaurantStore.currentRestaurant?.layout_data;

          if (layout) {
            const layoutItems: CanvasItem[] = [
              ...(layout.tables || []).map(convertTableToCanvas),
              ...(layout.walls || []).map(convertWallToCanvas),
              ...(layout.windows || []).map(convertWindowToCanvas),
            ];
            setItems(layoutItems);
          }
        } catch (error) {
          console.error("Ошибка загрузки layout:", error);
        }
      };

      loadLayout();
    }, [restaurantId]);

    useEffect(() => {
      if (selectedId && transformerRef.current) {
        const selectedNode = stageRef.current.findOne(`#${selectedId}`);
        if (selectedNode) {
          transformerRef.current.nodes([selectedNode]);
          transformerRef.current.getLayer().batchDraw();
        } else {
          transformerRef.current.nodes([]);
        }
      } else if (transformerRef.current) {
        transformerRef.current.nodes([]);
      }
    }, [selectedId]);

    // AUTO-SAVE ПОЗИЦИЙ (каждую секунду)
    useEffect(() => {
      if (items.length > 0) {
        const timeoutId = setTimeout(() => {
          const layoutData = {
            version: "1.0",
            tables: items
              .filter((item): item is TableItem => item.type === "table")
              .map((item) => ({
                id: item.id,
                type: "table",
                tableType: item.tableType,
                position: { x: item.x, y: item.y },
                size: { width: item.width, height: item.height },
                rotation: item.rotation,
                tableNumber: item.tableNumber,
                tableId: item.tableId,
                seats: item.seats,
                isBooked: item.isBooked,
              })),
            walls: items
              .filter((item): item is WallItem => item.type === "wall")
              .map((item) => ({
                id: item.id,
                position: { x: item.x, y: item.y },
                size: { width: item.width, height: item.height },
                rotation: item.rotation,
                color: item.color,
              })),
            windows: items
              .filter((item): item is WindowItem => item.type === "window")
              .map((item) => ({
                id: item.id,
                position: { x: item.x, y: item.y },
                size: { width: item.width, height: item.height },
                rotation: item.rotation,
                stroke: item.stroke,
                strokeWidth: item.strokeWidth,
              })),
            metadata: {
              canvasSize: CANVAS_SIZE,
              lastModified: new Date().toISOString(),
            },
          };

          restaurantStore
            .saveRestaurantLayout(restaurantId, layoutData)
            .catch((error) => console.error("Auto-save error:", error));
        }, 1000);

        return () => clearTimeout(timeoutId);
      }
    }, [items, restaurantId]);

    const handleDragBoundFunc = useCallback(
      (pos: { x: number; y: number }, item: CanvasItem) => {
        // Полная свобода перемещения - убраны все ограничения
        return {
          x: pos.x,
          y: pos.y,
        };
      },
      []
    );

    const handleStageClick = useCallback(
      (e: any) => {
        if (e.target === e.target.getStage()) {
          if (isManager) {
            setSelectedId(null);
            return;
          }

          if (activeTool !== "table") {
            const point = e.target.getPointerPosition();
            // Убираем проверки границ и центрирование:
            let x = point.x;
            let y = point.y;

            if (activeTool === "wall" && canCreateWalls) {
              const newItem: WallItem = {
                id: generateId(),
                x,
                y,
                width: selectedWallTemplate.width,
                height: selectedWallTemplate.height,
                rotation: 0,
                type: "wall",
                color: EDITOR_COLORS.wall,
              };
              setItems((prev) => [...prev, newItem]);
            } else if (activeTool === "window" && canCreateWindows) {
              const newItem: WindowItem = {
                id: generateId(),
                x,
                y,
                width: selectedWallTemplate.width,
                height: selectedWallTemplate.height,
                rotation: 0,
                type: "window",
                stroke: EDITOR_COLORS.window,
                strokeWidth: 4,
                fill: EDITOR_COLORS.window,
              };
              setItems((prev) => [...prev, newItem]);
            }
          }
          setSelectedId(null);
          return;
        }

        const id = e.target.attrs.id || e.target.parent.attrs.id;
        setSelectedId(id);
      },
      [
        activeTool,
        canCreateWalls,
        canCreateWindows,
        isManager,
        selectedWallTemplate,
      ]
    );

    const createTable = (template: any) => {
      if (!canCreateTables) {
        setModalState({
          isOpen: true,
          title: "Нет прав",
          message: "У вас нет прав для создания столов",
          type: "warning",
          onConfirm: async () => {
            setModalState((prev) => ({ ...prev, isOpen: false }));
          },
        });
        return;
      }

      const existingTables = items.filter(
        (item): item is TableItem => item.type === "table"
      );
      const lastTableNumber =
        existingTables.length > 0
          ? Math.max(...existingTables.map((t) => t.tableNumber || 0))
          : 0;

      const nextTableNumber = lastTableNumber + 1;

      const newItem: TableItem = {
        id: generateId(),
        x: 100 + items.length * 30,
        y: 100 + items.length * 30,
        width: template.width,
        height: template.height,
        rotation: 0,
        type: "table",
        imageUrl: template.imageUrl,
        tableNumber: nextTableNumber,
        seats: template.seats,
        isBooked: false,
        tableType: template.type,
      };

      setItems((prev) => [...prev, newItem]);
      setSelectedId(newItem.id);
    };

    const updateItem = (
      id: string,
      updates: Partial<Omit<CanvasItem, "id" | "type">>
    ) => {
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
      );
    };

    const saveLayoutToDB = async () => {
      if (items.length === 0) {
        setModalState({
          isOpen: true,
          title: "Нет элементов",
          message: "Нет элементов для сохранения",
          type: "info",
          onConfirm: async () => {
            setModalState((prev) => ({ ...prev, isOpen: false }));
          },
        });
        return;
      }

      setSaving(true);
      try {
        const tablesToCreate = items.filter(
          (item): item is TableItem => item.type === "table" && !item.tableId
        );

        console.log("Столы для создания в БД:", tablesToCreate);

        for (const table of tablesToCreate) {
          try {
            const newTable = await restaurantStore.createTable(restaurantId, {
              number: table.tableNumber || 1,
              seats: table.seats,
            });

            const itemIndex = items.findIndex((item) => item.id === table.id);
            if (itemIndex !== -1) {
              const updatedItems = [...items];
              (updatedItems[itemIndex] as TableItem).tableId = newTable.id;
              setItems(updatedItems);
            }
          } catch (error: any) {
            console.error("Ошибка создания стола:", error);
          }
        }

        await restaurantStore.loadRestaurant(restaurantId);
        const currentTables = restaurantStore.currentRestaurant?.tables || [];

        const layoutData = {
          version: "1.0",
          tables: items
            .filter((item): item is TableItem => item.type === "table")
            .map((item) => {
              const dbTable = currentTables.find(
                (t) => t.number === item.tableNumber
              );

              return {
                id: item.id,
                type: "table",
                tableType: item.tableType,
                position: { x: item.x, y: item.y },
                size: { width: item.width, height: item.height },
                rotation: item.rotation,
                tableNumber: item.tableNumber,
                tableId: dbTable?.id || item.tableId || 0,
                seats: item.seats,
                isBooked: item.isBooked,
              };
            }),
          walls: items
            .filter((item): item is WallItem => item.type === "wall")
            .map((item) => ({
              id: item.id,
              position: { x: item.x, y: item.y },
              size: { width: item.width, height: item.height },
              rotation: item.rotation,
              color: item.color,
            })),
          windows: items
            .filter((item): item is WindowItem => item.type === "window")
            .map((item) => ({
              id: item.id,
              position: { x: item.x, y: item.y },
              size: { width: item.width, height: item.height },
              rotation: item.rotation,
              stroke: item.stroke,
              strokeWidth: item.strokeWidth,
            })),
          metadata: {
            canvasSize: CANVAS_SIZE,
            lastModified: new Date().toISOString(),
          },
        };

        console.log("Сохраняем layout:", layoutData);

        await restaurantStore.saveRestaurantLayout(restaurantId, layoutData);
        await restaurantStore.loadRestaurant(restaurantId);

        setModalState({
          isOpen: true,
          title: "Успешно",
          message: "План успешно сохранен!",
          type: "info",
          onConfirm: async () => {
            setModalState((prev) => ({ ...prev, isOpen: false }));
          },
        });
      } catch (error) {
        console.error("Ошибка сохранения layout:", error);
        setModalState({
          isOpen: true,
          title: "Ошибка",
          message: "Ошибка сохранения плана",
          type: "danger",
          onConfirm: async () => {
            setModalState((prev) => ({ ...prev, isOpen: false }));
          },
        });
      } finally {
        setSaving(false);
      }
    };

    const deleteSelected = async () => {
      if (!selectedId || !canDeleteItems) {
        setModalState({
          isOpen: true,
          title: "Нет прав",
          message: "У вас нет прав для удаления элементов",
          type: "warning",
          onConfirm: async () => {
            setModalState((prev) => ({ ...prev, isOpen: false }));
          },
        });
        return;
      }

      const item = items.find((item) => item.id === selectedId);

      if (item?.type === "table") {
        const tableItem = item as TableItem;

        if (tableItem.tableId) {
          try {
            await restaurantStore.deleteTable(tableItem.tableId);
          } catch (error) {
            console.error("Ошибка удаления стола из БД:", error);
            setModalState({
              isOpen: true,
              title: "Ошибка",
              message: "Ошибка удаления стола из базы данных",
              type: "danger",
              onConfirm: async () => {
                setModalState((prev) => ({ ...prev, isOpen: false }));
              },
            });
            return;
          }
        }
      }

      setItems((prev) => prev.filter((item) => item.id !== selectedId));
      setSelectedId(null);
    };

    const clearAll = async () => {
      if (!canClearAll || items.length === 0) {
        setModalState({
          isOpen: true,
          title: "Нет прав или элементов",
          message: "У вас нет прав для очистки или нет элементов",
          type: "warning",
          onConfirm: async () => {
            setModalState((prev) => ({ ...prev, isOpen: false }));
          },
        });
        return;
      }

      // Вместо confirm используем модальное окно
      setModalState({
        isOpen: true,
        title: "Очистка всех элементов",
        message:
          "Вы уверены, что хотите удалить все элементы? Это действие нельзя отменить. Все стены, окна и столы будут удалены из плана и базы данных.",
        type: "danger",
        onConfirm: async () => {
          try {
            const tables = items.filter(
              (item): item is TableItem => item.type === "table" && item.tableId
            );

            for (const table of tables) {
              if (table.tableId) {
                await restaurantStore.deleteTable(table.tableId);
              }
            }

            setItems([]);
            setSelectedId(null);

            const layoutData = {
              version: "1.0",
              tables: [],
              walls: [],
              windows: [],
              metadata: {
                canvasSize: CANVAS_SIZE,
                lastModified: new Date().toISOString(),
              },
            };

            await restaurantStore.saveRestaurantLayout(
              restaurantId,
              layoutData
            );

            setModalState({
              isOpen: true,
              title: "Успешно",
              message: "Все элементы удалены!",
              type: "info",
              onConfirm: async () => {
                setModalState((prev) => ({ ...prev, isOpen: false }));
              },
            });
          } catch (error) {
            console.error("Ошибка очистки:", error);
            setModalState({
              isOpen: true,
              title: "Ошибка",
              message: "Ошибка удаления элементов",
              type: "danger",
              onConfirm: async () => {
                setModalState((prev) => ({ ...prev, isOpen: false }));
              },
            });
          }
        },
      });
    };

    const isWallItem = (item: CanvasItem): item is WallItem =>
      item.type === "wall";
    const isWindowItem = (item: CanvasItem): item is WindowItem =>
      item.type === "window";
    const isTableItem = (item: CanvasItem): item is TableItem =>
      item.type === "table";

    const renderItem = (item: CanvasItem) => {
      const isItemSelected = item.id === selectedId;

      if (isWallItem(item)) {
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
            draggable={canMoveItems}
            dragBoundFunc={(pos) => handleDragBoundFunc(pos, item)}
            onDragEnd={(e) =>
              updateItem(item.id, {
                x: e.target.x(),
                y: e.target.y(),
              })
            }
            onTransformEnd={(e) => {
              const node = e.target;
              updateItem(item.id, {
                x: node.x(),
                y: node.y(),
                rotation: node.rotation(),
              });
            }}
            onClick={() => setSelectedId(item.id)}
            onTap={() => setSelectedId(item.id)}
            stroke={
              isItemSelected ? EDITOR_COLORS.strokeSelected : "transparent"
            }
            strokeWidth={2}
          />
        );
      } else if (isWindowItem(item)) {
        return (
          <Rect
            key={item.id}
            id={item.id}
            x={item.x}
            y={item.y}
            width={item.width}
            height={item.height}
            rotation={item.rotation}
            fill={item.fill}
            stroke={isItemSelected ? EDITOR_COLORS.strokeSelected : item.stroke}
            strokeWidth={item.strokeWidth || 4}
            draggable={canMoveItems}
            dragBoundFunc={(pos) => handleDragBoundFunc(pos, item)}
            onDragEnd={(e) =>
              updateItem(item.id, {
                x: e.target.x(),
                y: e.target.y(),
              })
            }
            onTransformEnd={(e) => {
              const node = e.target;
              updateItem(item.id, {
                x: node.x(),
                y: node.y(),
                rotation: node.rotation(),
              });
            }}
            onClick={() => setSelectedId(item.id)}
            onTap={() => setSelectedId(item.id)}
          />
        );
      } else if (isTableItem(item)) {
        return (
          <TableElement
            key={item.id}
            item={item}
            isSelected={isItemSelected}
            draggable={canMoveItems}
            onSelect={() => setSelectedId(item.id)}
            onChange={(updates) => updateItem(item.id, updates)}
          />
        );
      }
      return null;
    };

    return (
      <>
        <Container>
          <Sidebar>
            {isAdmin ? (
              <>
                <h3 style={{ marginBottom: 0, marginTop: 0, color: "#fff" }}>
                  Инструменты
                </h3>
                <div style={{ marginBottom: "15px" }}>
                  <Button
                    onClick={() => setActiveTool("table")}
                    style={{
                      backgroundColor:
                        activeTool === "table" ? "#007bff" : "#495057",
                      color: "white",
                      marginBottom: "5px",
                    }}
                  >
                    Столы
                  </Button>
                  <Button
                    onClick={() => setActiveTool("wall")}
                    style={{
                      backgroundColor:
                        activeTool === "wall" ? "#007bff" : "#495057",
                      color: "white",
                      marginBottom: "5px",
                    }}
                  >
                    Стена
                  </Button>
                  <Button
                    onClick={() => setActiveTool("window")}
                    style={{
                      backgroundColor:
                        activeTool === "window" ? "#007bff" : "#495057",
                      color: "white",
                      marginBottom: "5px",
                    }}
                  >
                    Окно
                  </Button>
                </div>

                {activeTool === "table" && (
                  <ControlSection>
                    <h4
                      style={{
                        marginTop: 0,
                        marginBottom: "10px",
                        color: "#fff",
                      }}
                    >
                      Столы
                    </h4>
                    {TABLE_TEMPLATES.map((table, index) => (
                      <StyledTableItem
                        key={index}
                        onClick={() => createTable(table)}
                      >
                        <img src={table.imageUrl} alt={table.name} />
                        <span style={{ color: "#ddd" }}>{table.name}</span>
                      </StyledTableItem>
                    ))}
                  </ControlSection>
                )}

                {activeTool === "wall" && (
                  <ControlSection>
                    <h4
                      style={{
                        marginTop: 0,
                        marginBottom: "10px",
                        color: "#fff",
                      }}
                    >
                      Добавление стен
                    </h4>

                    <div style={{ marginBottom: "15px" }}>
                      <h5
                        style={{
                          color: "#fff",
                          marginBottom: "8px",
                          fontSize: "14px",
                        }}
                      >
                        Выберите размер:
                      </h5>
                      {WALL_TEMPLATES.map((template) => (
                        <StyledTableItem
                          key={template.id}
                          onClick={() => setSelectedWallTemplate(template)}
                          style={{
                            border:
                              selectedWallTemplate.id === template.id
                                ? "2px solid #007bff"
                                : "1px solid #444",
                            padding: "8px",
                            marginBottom: "8px",
                            cursor: "pointer",
                            height: "auto",
                            minHeight: "60px",
                          }}
                        >
                          <div
                            style={{
                              width: "100%",
                              height:
                                template.id === "corner" ? "100px" : "20px",
                              backgroundColor: EDITOR_COLORS.wall,
                              borderRadius: "2px",
                              marginBottom: "5px",
                            }}
                          />
                          <span style={{ color: "#ddd", fontSize: "12px" }}>
                            {template.name} ({template.width}x{template.height})
                          </span>
                        </StyledTableItem>
                      ))}
                    </div>

                    <p
                      style={{
                        fontSize: "14px",
                        color: "#aaa",
                        margin: "10px 0",
                      }}
                    >
                      Кликните на холст, чтобы добавить выбранную стену
                    </p>
                  </ControlSection>
                )}

                {activeTool === "window" && (
                  <ControlSection>
                    <h4
                      style={{
                        marginTop: 0,
                        marginBottom: "10px",
                        color: "#fff",
                      }}
                    >
                      Добавление окон
                    </h4>
                    <p
                      style={{
                        fontSize: "14px",
                        color: "#aaa",
                        margin: "10px 0",
                      }}
                    >
                      Кликните на холст, чтобы добавить окно
                    </p>
                    <div
                      style={{
                        width: "100%",
                        height: "20px",
                        backgroundColor: EDITOR_COLORS.window,
                        borderRadius: "2px",
                        marginBottom: "10px",
                      }}
                    />
                  </ControlSection>
                )}
              </>
            ) : (
              <ControlSection>
                <h4
                  style={{ marginTop: 0, marginBottom: "10px", color: "#fff" }}
                >
                  Инструкция для менеджера
                </h4>
                <p style={{ fontSize: "14px", color: "#aaa" }}>
                  Вы <strong style={{ color: "#fff" }}>не можете</strong>{" "}
                  создавать новые элементы
                </p>
              </ControlSection>
            )}
          </Sidebar>

          <CanvasWrapper>
            <div
              style={{
                position: "relative",
                width: CANVAS_SIZE.width,
                height: CANVAS_SIZE.height,
              }}
            >
              {saving && (
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(0, 0, 0, 0.7)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: 10,
                    borderRadius: "8px",
                  }}
                >
                  <Loader text="Сохранение плана..." />
                </div>
              )}

              <Stage
                width={CANVAS_SIZE.width}
                height={CANVAS_SIZE.height}
                ref={stageRef}
                onClick={handleStageClick}
                onTap={handleStageClick}
                style={{
                  backgroundColor: EDITOR_COLORS.background,
                  border: "2px solid #333",
                  borderRadius: "8px",
                  opacity: saving ? 0.5 : 1,
                }}
              >
                <Layer>
                  {items.map(renderItem)}

                  <Transformer
                    ref={transformerRef}
                    keepRatio={true}
                    enabledAnchors={[
                      "top-left",
                      "top-right",
                      "bottom-left",
                      "bottom-right",
                    ]}
                    rotateEnabled={canRotateItems}
                    resizeEnabled={canResizeItems}
                    borderStroke="#007bff"
                    borderStrokeWidth={2}
                    anchorStroke="#007bff"
                    anchorFill="#007bff"
                    anchorSize={10}
                    rotationSnaps={ROTATION_SNAPS}
                    rotationSnapTolerance={10}
                  />
                </Layer>
              </Stage>
            </div>
          </CanvasWrapper>

          <ControlSection>
            <h4 style={{ marginTop: 0, marginBottom: "10px", color: "#fff" }}>
              Управление
            </h4>

            <Button
              onClick={deleteSelected}
              disabled={!selectedId || !canDeleteItems || saving}
              style={{ marginBottom: "10px", width: "100%" }}
            >
              Удалить выбранное
            </Button>

            <Button
              onClick={clearAll}
              disabled={!canClearAll || items.length === 0 || saving}
              style={{ marginBottom: "10px", width: "100%" }}
            >
              Очистить всё
            </Button>

            <Button
              onClick={saveLayoutToDB}
              disabled={items.length === 0 || saving}
              style={{
                backgroundColor:
                  items.length === 0 || saving ? "#6c757d" : "#28a745",
                color: "white",
                width: "100%",
              }}
            >
              {saving ? "Сохранение..." : "Сохранить план"}
            </Button>
          </ControlSection>
        </Container>

        <Modal
          isOpen={modalState.isOpen}
          onClose={() => setModalState((prev) => ({ ...prev, isOpen: false }))}
          onConfirm={modalState.onConfirm}
          title={modalState.title}
          message={modalState.message}
          type={modalState.type}
          confirmText="Подтвердить"
          cancelText="Отмена"
        />
      </>
    );
  }
);
