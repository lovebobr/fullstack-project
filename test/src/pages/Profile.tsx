import React, { useState, useCallback, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import {
  Edit,
  Save,
  X,
  User,
  Mail,
  Phone,
  LogOut,
  Utensils,
  Calendar,
  Clock,
  RefreshCw,
  Users,
  MapPin,
  Table as TableIcon,
  CreditCard,
  ChefHat,
  Package,
  ShoppingCart,
} from "lucide-react";
import Header from "../app/component/Header";
import { Modal } from "../app/component/ModalConfirm";
import { profileStore } from "../app/store/profile.store";
import { authStore } from "../app/store/auth.store";
import { applicationsStore } from "../app/store/applications.store";
import { useAuth } from "../useAuth";
import {
  ProfileContainer,
  ProfileHeader,
  Avatar,
  ProfileName,
  ProfileContent,
  Section,
  SectionTitle,
  FieldGrid,
  FieldGroup,
  FieldLabel,
  FieldValue,
  FieldInput,
  ActionButtons,
  EditButton,
  SaveButton,
  CancelButton,
  EmptyValue,
  LogoutButton,
  LoadingOverlay,
  ErrorMessage,
  EmptyState,
  ProfileError,
  SectionHeader,
  RefreshButton,
  ReservationsList,
  ReservationCard,
  ReservationHeader,
  RestaurantInfo,
  TableIconWrapper,
  RestaurantDetails,
  TableNumber,
  RestaurantName,
  RestaurantId,
  StatusSection,
  StatusBadge,
  ReservationId,
  DetailsGrid,
  DetailItem,
  DetailLabel,
  DetailValue,
  GuestsInfo,
  GuestsCount,
  SpecialRequests,
  RequestsLabel,
  RequestsText,
  ActionButtonsRow,
  ActionButton,
  EmptyReservations,
  FoodItemsSection,
  FoodItemsHeader,
  FoodItemsList,
  FoodItemCard,
  FoodItemImage,
  FoodItemDetails,
  FoodItemName,
  FoodItemPrice,
  FoodItemQuantity,
  FoodItemTotal,
  NoFoodItems,
  FoodSummary,
  SummaryItem,
  SummaryLabel,
  SummaryValue,
  FoodItemDescription,
  FoodItemInfo,
} from "../styled/Profile.styles";

export const Profile = observer(() => {
  const navigate = useNavigate();
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState<string>("");
  const [expandedReservations, setExpandedReservations] = useState<Set<string>>(
    new Set()
  );
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: "info" | "warning" | "danger";
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm?: () => void;
  }>({
    isOpen: false,
    type: "info",
    title: "",
    message: "",
  });
  const { user } = useAuth();
  const isAdmin = user?.role === "manager" || user?.role === "admin";

  useEffect(() => {
    console.log("Загрузка профиля...");
    profileStore.loadProfile();
  }, []);

  const showModal = useCallback(
    (modalProps: {
      type: "info" | "warning" | "danger";
      title: string;
      message: string;
      confirmText?: string;
      cancelText?: string;
      onConfirm: () => void;
    }) => {
      setModalState({
        isOpen: true,
        ...modalProps,
      });
    },
    []
  );

  const closeModal = useCallback(() => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const handleLogout = useCallback(() => {
    showModal({
      type: "warning",
      title: "Выход из системы",
      message: "Вы уверены, что хотите выйти из своего аккаунта?",
      confirmText: "Выйти",
      cancelText: "Отмена",
      onConfirm: () => {
        authStore.logout();
        navigate("/login", { replace: true });
      },
    });
  }, [navigate, showModal]);

  const handleBookTable = () => {
    navigate("/booking");
  };

  const handleViewMenu = () => {
    navigate("/menu");
  };

  const startEditing = useCallback(
    (fieldName: string, currentValue: string) => {
      setEditingField(fieldName);
      setTempValue(currentValue);
    },
    []
  );

  const saveField = useCallback(async () => {
    if (editingField && tempValue) {
      try {
        await profileStore.updateProfileField(editingField, tempValue);
        setEditingField(null);
        setTempValue("");

        showModal({
          type: "info",
          title: "Сохранено",
          message: "Данные успешно обновлены",
          confirmText: "OK",
          onConfirm: closeModal,
        });
      } catch (error) {
        console.error("Ошибка сохранения:", error);
        showModal({
          type: "danger",
          title: "Ошибка",
          message:
            "Не удалось сохранить изменения. Пожалуйста, попробуйте еще раз.",
          confirmText: "OK",
          onConfirm: closeModal,
        });
      }
    }
  }, [editingField, tempValue, showModal, closeModal]);

  const cancelEditing = useCallback(() => {
    setEditingField(null);
    setTempValue("");
    profileStore.clearError();
  }, []);

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        saveField();
      } else if (e.key === "Escape") {
        cancelEditing();
      }
    },
    [saveField, cancelEditing]
  );

  const handleRefreshReservations = useCallback(() => {
    console.log("Обновление списка бронирований...");
    profileStore.loadReservationHistory();
  }, []);

  const toggleFoodItems = useCallback((reservationId: string) => {
    setExpandedReservations((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(reservationId)) {
        newSet.delete(reservationId);
      } else {
        newSet.add(reservationId);
      }
      return newSet;
    });
  }, []);

  const handleCancelReservation = useCallback(
    (reservationId: string) => {
      showModal({
        type: "danger",
        title: "Отмена бронирования",
        message:
          "Вы уверены, что хотите отменить это бронирование? Это действие нельзя будет отменить.",
        confirmText: "Да, отменить",
        cancelText: "Нет, оставить",
        onConfirm: async () => {
          try {
            const result = await applicationsStore.cancelApplication(
              reservationId
            );

            if (result.success) {
              await profileStore.loadReservationHistory();

              showModal({
                type: "info",
                title: "Успешно",
                message: "Бронирование успешно отменено!",
                confirmText: "OK",
                onConfirm: closeModal,
              });
            } else {
              showModal({
                type: "warning",
                title: "Ошибка",
                message:
                  "Не удалось отменить бронирование. Возможно, оно уже отменено или не найдено.",
                confirmText: "OK",
                onConfirm: closeModal,
              });
            }
          } catch (error: any) {
            console.error("Ошибка при отмене бронирования:", error);
            showModal({
              type: "danger",
              title: "Ошибка",
              message: `Ошибка: ${
                error.message || "Не удалось отменить бронирование"
              }`,
              confirmText: "OK",
              onConfirm: closeModal,
            });
          }
        },
      });
    },
    [showModal, closeModal]
  );

  const formatDateTime = (dateString: string) => {
    if (!dateString) return "Не указано";
    const date = new Date(dateString);
    return date.toLocaleString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: "Ожидание оплаты",
      confirmed: "Подтверждено",
      cancelled: "Отменено",
      completed: "Завершено",
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colorMap: Record<string, { bg: string; text: string }> = {
      pending: { bg: "rgba(255, 149, 0, 0.2)", text: "#ff9500" },
      confirmed: { bg: "rgba(39, 174, 96, 0.2)", text: "#27ae60" },
      cancelled: { bg: "rgba(220, 53, 69, 0.2)", text: "#dc3545" },
      completed: { bg: "rgba(108, 117, 125, 0.2)", text: "#6c757d" },
    };
    return (
      colorMap[status] || { bg: "rgba(108, 117, 125, 0.2)", text: "#6c757d" }
    );
  };

  const renderFoodItems = (foods: any[], reservationId: string) => {
    if (!foods || foods.length === 0) {
      return (
        <NoFoodItems>
          <Package size={24} />
          <span>Нет заказанных блюд</span>
        </NoFoodItems>
      );
    }

    const foodsTotal = foods.reduce(
      (sum, item) => sum + (item.price || 0) * (item.pivot?.quantity || 1),
      0
    );

    return (
      <FoodItemsSection>
        <FoodItemsHeader onClick={() => toggleFoodItems(reservationId)}>
          <div>
            <ChefHat size={16} />
            <span>Заказанные блюда ({foods.length})</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "14px", color: "#adb5bd" }}>
              {expandedReservations.has(reservationId) ? "Скрыть" : "Показать"}
            </span>
            <div
              style={{
                transform: expandedReservations.has(reservationId)
                  ? "rotate(180deg)"
                  : "rotate(0deg)",
                transition: "transform 0.3s",
              }}
            >
              ▼
            </div>
          </div>
        </FoodItemsHeader>

        {expandedReservations.has(reservationId) && (
          <>
            <FoodItemsList>
              {foods.map((food, index) => {
                const quantity = food.pivot?.quantity || 1;
                const price = food.price || 0;
                const total = price * quantity;

                return (
                  <FoodItemCard key={`${food.id}-${index}`}>
                    {food.image_url && (
                      <FoodItemImage
                        src={food.image_url}
                        alt={food.name}
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    )}
                    <FoodItemDetails>
                      <FoodItemInfo>
                        <FoodItemName>{food.name}</FoodItemName>
                        {food.description && (
                          <FoodItemDescription>
                            {food.description}
                          </FoodItemDescription>
                        )}
                      </FoodItemInfo>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "16px",
                        }}
                      >
                        <FoodItemQuantity>
                          <span>×{quantity}</span>
                        </FoodItemQuantity>
                        <FoodItemPrice>{price} ₽</FoodItemPrice>
                        <FoodItemTotal>{total} ₽</FoodItemTotal>
                      </div>
                    </FoodItemDetails>
                  </FoodItemCard>
                );
              })}
            </FoodItemsList>

            <FoodSummary>
              <SummaryItem>
                <SummaryLabel>
                  <ShoppingCart size={14} />
                  Количество блюд:
                </SummaryLabel>
                <SummaryValue>{foods.length}</SummaryValue>
              </SummaryItem>
              <SummaryItem>
                <SummaryLabel>Сумма за блюда:</SummaryLabel>
                <SummaryValue>{foodsTotal} ₽</SummaryValue>
              </SummaryItem>
            </FoodSummary>
          </>
        )}
      </FoodItemsSection>
    );
  };

  const renderField = (
    fieldName: string,
    label: string,
    value: string,
    icon: React.ReactNode
  ) => {
    const isEditing = editingField === fieldName;

    return (
      <FieldGroup>
        <FieldLabel>
          {icon}
          {label}
        </FieldLabel>

        {isEditing ? (
          <>
            <FieldInput
              type={fieldName === "email" ? "email" : "text"}
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              onKeyDown={handleKeyPress}
              autoFocus
              disabled={profileStore.updating}
            />
            <ActionButtons>
              <SaveButton onClick={saveField} disabled={profileStore.updating}>
                <Save size={14} />
                {profileStore.updating ? "Сохранение..." : "Сохранить"}
              </SaveButton>
              <CancelButton
                onClick={cancelEditing}
                disabled={profileStore.updating}
              >
                <X size={14} />
                Отмена
              </CancelButton>
            </ActionButtons>
          </>
        ) : (
          <>
            <FieldValue>
              {value || <EmptyValue>Не указано</EmptyValue>}
            </FieldValue>
            <ActionButtons>
              {isAdmin && (
                <EditButton onClick={() => startEditing(fieldName, value)}>
                  <Edit size={14} />
                  Редактировать
                </EditButton>
              )}
            </ActionButtons>
          </>
        )}
      </FieldGroup>
    );
  };

  if (profileStore.loading) {
    return (
      <ProfileContainer>
        <Header onBookTable={handleBookTable} onViewMenu={handleViewMenu} />
        <LoadingOverlay>
          <div className="spinner"></div>
          <div className="loading-text">Загрузка профиля...</div>
        </LoadingOverlay>
      </ProfileContainer>
    );
  }

  if (profileStore.error && !profileStore.profileData) {
    return (
      <ProfileContainer>
        <Header onBookTable={handleBookTable} onViewMenu={handleViewMenu} />
        <ErrorMessage>
          <div className="error-title">Ошибка загрузки профиля</div>
          <div className="error-message">{profileStore.error}</div>
          <button
            className="retry-button"
            onClick={() => profileStore.loadProfile()}
          >
            Попробовать снова
          </button>
        </ErrorMessage>
      </ProfileContainer>
    );
  }

  if (!profileStore.profileData) {
    return (
      <ProfileContainer>
        <Header onBookTable={handleBookTable} onViewMenu={handleViewMenu} />
        <EmptyState>
          <User size={64} className="empty-icon" />
          <div className="empty-title">Данные профиля не найдены</div>
          <button
            className="empty-button"
            onClick={() => profileStore.loadProfile()}
          >
            Загрузить профиль
          </button>
        </EmptyState>
      </ProfileContainer>
    );
  }

  const { profileData } = profileStore;

  return (
    <>
      <ProfileContainer>
        <Header onBookTable={handleBookTable} onViewMenu={handleViewMenu} />

        <ProfileHeader>
          <div style={{ textAlign: "center" }}>
            <Avatar>
              <User size={48} />
            </Avatar>
            <ProfileName>{profileData.name}</ProfileName>
          </div>
        </ProfileHeader>

        <ProfileContent>
          {profileStore.error && (
            <ProfileError>
              <span>{profileStore.error}</span>
              <button
                className="error-close"
                onClick={() => profileStore.clearError()}
              >
                ×
              </button>
            </ProfileError>
          )}

          <Section>
            <SectionTitle>
              <User size={20} />
              Основная информация
            </SectionTitle>
            <FieldGrid>
              {renderField(
                "name",
                "Полное имя",
                profileData.name,
                <User size={16} />
              )}
              {renderField(
                "email",
                "Email",
                profileData.email,
                <Mail size={16} />
              )}
              {profileData.phone &&
                renderField(
                  "phone",
                  "Телефон",
                  profileData.phone,
                  <Phone size={16} />
                )}
            </FieldGrid>
          </Section>

          {!isAdmin && (
            <Section>
              <SectionHeader>
                <SectionTitle>
                  <Calendar size={20} />
                  Мои бронирования
                  <span className="count-badge">
                    {profileData.reservations?.length || 0}
                  </span>
                </SectionTitle>
                <RefreshButton
                  onClick={handleRefreshReservations}
                  disabled={profileStore.loadingReservations}
                >
                  <RefreshCw
                    size={14}
                    className={profileStore.loadingReservations ? "spin" : ""}
                  />
                  {profileStore.loadingReservations
                    ? "Обновление..."
                    : "Обновить"}
                </RefreshButton>
              </SectionHeader>

              {profileData.reservations &&
              profileData.reservations.length > 0 ? (
                <ReservationsList>
                  {profileData.reservations.map((reservation) => {
                    const statusColors = getStatusColor(reservation.status);
                    const isActive = reservation.status === "confirmed";
                    const isPending = reservation.status === "pending";
                    const canCancel =
                      (isPending || isActive) &&
                      reservation.status !== "cancelled";

                    const hasFoods =
                      reservation.foods && reservation.foods.length > 0;

                    return (
                      <ReservationCard
                        key={reservation.id}
                        $isActive={isActive}
                        $isPending={isPending}
                      >
                        <ReservationHeader>
                          <RestaurantInfo>
                            <TableIconWrapper
                              $isActive={isActive}
                              $isPending={isPending}
                            >
                              <TableIcon size={28} />
                            </TableIconWrapper>
                            <RestaurantDetails>
                              <TableNumber>
                                Стол №
                                {reservation.tableNumber || reservation.id}
                              </TableNumber>
                              <RestaurantName>
                                <Utensils size={16} />
                                <span>
                                  {reservation.restaurantName || "Ресторан"}
                                </span>
                              </RestaurantName>
                              {reservation.restaurant_id && (
                                <RestaurantId>
                                  <MapPin size={14} />
                                  ID ресторана: {reservation.restaurant_id}
                                </RestaurantId>
                              )}
                            </RestaurantDetails>
                          </RestaurantInfo>
                          <StatusSection>
                            <StatusBadge
                              $bg={statusColors.bg}
                              $text={statusColors.text}
                            >
                              {getStatusText(reservation.status)}
                            </StatusBadge>
                            <ReservationId>ID: #{reservation.id}</ReservationId>
                          </StatusSection>
                        </ReservationHeader>

                        <DetailsGrid>
                          <DetailItem>
                            <DetailLabel>
                              <Calendar size={12} />
                              Дата и время
                            </DetailLabel>
                            <DetailValue>
                              {formatDateTime(reservation.date_time)}
                            </DetailValue>
                          </DetailItem>

                          <DetailItem>
                            <DetailLabel>
                              <Clock size={12} />
                              Длительность
                            </DetailLabel>
                            <DetailValue>
                              {reservation.duration || 2} часа
                            </DetailValue>
                          </DetailItem>

                          <DetailItem>
                            <DetailLabel>
                              <Users size={12} />
                              Мест/Гостей
                            </DetailLabel>
                            <GuestsInfo>
                              <DetailValue>
                                {reservation.tableSeats || 2} мест
                              </DetailValue>
                              {reservation.guests_count && (
                                <>
                                  <div style={{ color: "#adb5bd" }}>•</div>
                                  <GuestsCount>
                                    {reservation.guests_count} гостей
                                  </GuestsCount>
                                </>
                              )}
                            </GuestsInfo>
                          </DetailItem>

                          <DetailItem>
                            <DetailLabel>
                              <CreditCard size={12} />
                              Сумма
                            </DetailLabel>
                            <DetailValue>
                              {reservation.price
                                ? `${reservation.price} ₽`
                                : "Бесплатно"}
                            </DetailValue>
                          </DetailItem>
                        </DetailsGrid>

                        {reservation.special_requests && (
                          <SpecialRequests>
                            <RequestsLabel>Особые пожелания:</RequestsLabel>
                            <RequestsText>
                              {reservation.special_requests}
                            </RequestsText>
                          </SpecialRequests>
                        )}

                        {/* Секция с заказанными блюдами */}
                        {hasFoods &&
                          renderFoodItems(reservation.foods, reservation.id)}

                        <ActionButtonsRow>
                          {isPending && (
                            <ActionButton
                              $variant="success"
                              onClick={() =>
                                navigate(
                                  `/payment?reservation_id=${reservation.id}`
                                )
                              }
                            >
                              <CreditCard size={14} />
                              Оплатить
                            </ActionButton>
                          )}

                          <ActionButton
                            $variant="outline"
                            onClick={() => {
                              if (reservation.restaurant_id) {
                                navigate(
                                  `/restaurants/${reservation.restaurant_id}`
                                );
                              } else {
                                navigate("/restaurants");
                              }
                            }}
                          >
                            <Utensils size={14} />
                            Посмотреть ресторан
                          </ActionButton>

                          {canCancel && (
                            <ActionButton
                              $variant="danger"
                              onClick={() =>
                                handleCancelReservation(
                                  reservation.id.toString()
                                )
                              }
                            >
                              <X size={14} />
                              Отменить
                            </ActionButton>
                          )}
                        </ActionButtonsRow>
                      </ReservationCard>
                    );
                  })}
                </ReservationsList>
              ) : (
                <EmptyReservations>
                  <Calendar size={64} className="empty-icon" />
                  <div className="empty-title">Нет активных бронирований</div>
                  <div className="empty-description">
                    У вас пока нет забронированных столов. Вы можете выбрать
                    ресторан и забронировать стол прямо сейчас.
                  </div>
                  <button
                    className="empty-button"
                    onClick={() => navigate("/restaurants")}
                  >
                    <TableIcon size={16} />
                    Забронировать стол
                  </button>
                </EmptyReservations>
              )}
            </Section>
          )}

          {/* Кнопка выхода */}
          <Section>
            <LogoutButton onClick={handleLogout}>
              <LogOut size={16} />
              Выйти из системы
            </LogoutButton>
          </Section>
        </ProfileContent>
      </ProfileContainer>

      {/* Модальное окно */}
      <Modal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        onConfirm={() => {
          modalState.onConfirm?.();
          closeModal();
        }}
        title={modalState.title}
        message={modalState.message}
        confirmText={modalState.confirmText}
        cancelText={modalState.cancelText}
        type={modalState.type}
      />
    </>
  );
});

export default Profile;
