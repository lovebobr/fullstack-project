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
  History,
  Utensils,
  Calendar,
  Clock,
  RefreshCw,
  Users,
  MapPin,
  Hash,
  Table as TableIcon,
  CreditCard,
  Info,
} from "lucide-react";
import {
  ProfileContainer,
  ProfileHeader,
  Avatar,
  ProfileName,
  ProfileRole,
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
} from "../styled/Profile.styles";
import { profileStore } from "../app/store/profile.store";
import { authStore } from "../app/store/auth.store";

export const Profile = observer(() => {
  const navigate = useNavigate();
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState<string>("");

  useEffect(() => {
    console.log("Загрузка профиля...");
    profileStore.loadProfile();
  }, []);

  const handleLogout = useCallback(() => {
    authStore.logout();
    navigate("/login", { replace: true });
  }, [navigate]);

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
      } catch (error) {
        console.error("Ошибка сохранения:", error);
      }
    }
  }, [editingField, tempValue]);

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

  const formatDate = (dateString: string) => {
    if (!dateString) return "Не указано";
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    if (!dateString) return "Не указано";
    const date = new Date(dateString);
    return date.toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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
      completed: "Завершено",
      cancelled: "Отменено",
      no_show: "Неявка",
      active: "Активно",
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colorMap: Record<string, { bg: string; text: string }> = {
      pending: { bg: "#fff3cd", text: "#856404" },
      confirmed: { bg: "#d1e7dd", text: "#0f5132" },
      completed: { bg: "#cfe2ff", text: "#084298" },
      cancelled: { bg: "#f8d7da", text: "#721c24" },
      no_show: { bg: "#e2e3e5", text: "#41464b" },
      active: { bg: "#cce5ff", text: "#004085" },
    };
    return colorMap[status] || { bg: "#e2e3e5", text: "#41464b" };
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
              <EditButton onClick={() => startEditing(fieldName, value)}>
                <Edit size={14} />
                Редактировать
              </EditButton>
            </ActionButtons>
          </>
        )}
      </FieldGroup>
    );
  };

  // Если идет загрузка
  if (profileStore.loading) {
    return (
      <ProfileContainer>
        <ProfileContent>
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <div
              className="spin"
              style={{
                width: "40px",
                height: "40px",
                border: "3px solid #f3f3f3",
                borderTop: "3px solid #3498db",
                borderRadius: "50%",
                margin: "0 auto 20px",
              }}
            ></div>
            <div style={{ fontSize: "16px", color: "#666" }}>
              Загрузка профиля...
            </div>
          </div>
        </ProfileContent>
      </ProfileContainer>
    );
  }

  // Если ошибка при загрузке
  if (profileStore.error && !profileStore.profileData) {
    return (
      <ProfileContainer>
        <ProfileContent>
          <div
            style={{
              textAlign: "center",
              padding: "40px",
              color: "#dc3545",
              background: "#f8d7da",
              borderRadius: "8px",
              margin: "20px",
            }}
          >
            <div
              style={{
                fontSize: "18px",
                fontWeight: "500",
                marginBottom: "10px",
              }}
            >
              Ошибка загрузки профиля
            </div>
            <div style={{ marginBottom: "20px" }}>{profileStore.error}</div>
            <button
              onClick={() => profileStore.loadProfile()}
              style={{
                padding: "10px 20px",
                background: "#dc3545",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: "500",
              }}
            >
              Попробовать снова
            </button>
          </div>
        </ProfileContent>
      </ProfileContainer>
    );
  }

  // Если данных профиля нет
  if (!profileStore.profileData) {
    return (
      <ProfileContainer>
        <ProfileContent>
          <div
            style={{ textAlign: "center", padding: "60px 20px", color: "#666" }}
          >
            <User size={48} style={{ marginBottom: "20px", color: "#999" }} />
            <div style={{ fontSize: "18px", marginBottom: "10px" }}>
              Данные профиля не найдены
            </div>
            <button
              onClick={() => profileStore.loadProfile()}
              style={{
                padding: "10px 20px",
                background: "#1976d2",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                marginTop: "20px",
              }}
            >
              Загрузить профиль
            </button>
          </div>
        </ProfileContent>
      </ProfileContainer>
    );
  }

  const { profileData } = profileStore;

  return (
    <ProfileContainer>
      <ProfileHeader>
        <Avatar>
          <User size={40} />
        </Avatar>
        <div>
          <ProfileName>{profileData.name}</ProfileName>
          <ProfileRole>
            {profileData.role === "admin" ? "Администратор" : "Пользователь"}
            <span
              style={{ marginLeft: "12px", fontSize: "12px", opacity: 0.7 }}
            >
              ID: {profileData.id}
            </span>
          </ProfileRole>
        </div>
      </ProfileHeader>

      <ProfileContent>
        {/* Блок информации о текущем пользователе */}
        <div
          style={{
            backgroundColor: "#e9ecef",
            padding: "12px 16px",
            borderRadius: "8px",
            marginBottom: "24px",
            fontSize: "14px",
            color: "#495057",
            border: "1px solid #dee2e6",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "8px",
            }}
          >
            <Info size={16} />
            <span style={{ fontWeight: "500" }}>Информация о сессии:</span>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "8px",
            }}
          >
            <div>
              ID пользователя: <strong>{profileData.id}</strong>
            </div>
            <div>
              Email: <strong>{profileData.email}</strong>
            </div>
            <div>
              Роль: <strong>{profileData.role}</strong>
            </div>
            <div>
              Бронирований:{" "}
              <strong>{profileData.reservations?.length || 0}</strong>
            </div>
          </div>
        </div>

        {profileStore.error && (
          <div
            style={{
              color: "#721c24",
              background: "#f8d7da",
              padding: "12px 16px",
              borderRadius: "8px",
              marginBottom: "20px",
              border: "1px solid #f5c6cb",
              fontSize: "14px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span>{profileStore.error}</span>
              <button
                onClick={() => profileStore.clearError()}
                style={{
                  background: "none",
                  border: "none",
                  color: "#721c24",
                  cursor: "pointer",
                  fontSize: "18px",
                  padding: "0",
                  lineHeight: "1",
                }}
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Основная информация */}
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

        {/* Раздел бронирований */}
        <Section>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
            }}
          >
            <SectionTitle>
              <Calendar size={20} />
              Мои бронирования
              <span
                style={{
                  marginLeft: "8px",
                  fontSize: "14px",
                  fontWeight: "normal",
                  color: "#6c757d",
                }}
              >
                ({profileData.reservations?.length || 0})
              </span>
            </SectionTitle>
            <button
              onClick={handleRefreshReservations}
              disabled={profileStore.loadingReservations}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 12px",
                backgroundColor: "#f8f9fa",
                border: "1px solid #dee2e6",
                borderRadius: "4px",
                cursor: profileStore.loadingReservations
                  ? "not-allowed"
                  : "pointer",
                fontSize: "14px",
                color: profileStore.loadingReservations ? "#6c757d" : "#495057",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                if (!profileStore.loadingReservations) {
                  e.currentTarget.style.backgroundColor = "#e9ecef";
                }
              }}
              onMouseLeave={(e) => {
                if (!profileStore.loadingReservations) {
                  e.currentTarget.style.backgroundColor = "#f8f9fa";
                }
              }}
            >
              <RefreshCw
                size={14}
                className={profileStore.loadingReservations ? "spin" : ""}
              />
              {profileStore.loadingReservations ? "Обновление..." : "Обновить"}
            </button>
          </div>

          {profileData.reservations && profileData.reservations.length > 0 ? (
            <div style={{ marginTop: "8px" }}>
              {profileData.reservations.map((reservation) => {
                const statusColors = getStatusColor(reservation.status);
                const isActive =
                  reservation.status === "confirmed" ||
                  reservation.status === "active";
                const isPending = reservation.status === "pending";

                return (
                  <div
                    key={reservation.id}
                    style={{
                      padding: "20px",
                      marginBottom: "16px",
                      backgroundColor: isActive
                        ? "#f0f9ff"
                        : isPending
                        ? "#fffcf5"
                        : "#ffffff",
                      borderRadius: "12px",
                      border: `2px solid ${
                        isActive ? "#b3e0ff" : isPending ? "#ffe8b3" : "#e9ecef"
                      }`,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow =
                        "0 4px 12px rgba(0,0,0,0.1)";
                      e.currentTarget.style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow =
                        "0 2px 8px rgba(0,0,0,0.06)";
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: "16px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "16px",
                        }}
                      >
                        <div
                          style={{
                            width: "56px",
                            height: "56px",
                            borderRadius: "12px",
                            backgroundColor: isActive
                              ? "#e3f2fd"
                              : isPending
                              ? "#fff3cd"
                              : "#f5f5f5",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: isActive
                              ? "#1976d2"
                              : isPending
                              ? "#ff9800"
                              : "#757575",
                            flexShrink: 0,
                          }}
                        >
                          <TableIcon size={28} />
                        </div>
                        <div>
                          <div
                            style={{
                              fontWeight: "700",
                              color: "#212529",
                              fontSize: "20px",
                              marginBottom: "6px",
                            }}
                          >
                            Стол №{reservation.tableNumber || reservation.id}
                          </div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              fontSize: "16px",
                              color: "#495057",
                              marginBottom: "4px",
                            }}
                          >
                            <Utensils size={16} />
                            <span style={{ fontWeight: "600" }}>
                              {reservation.restaurantName || "Ресторан"}
                            </span>
                          </div>
                          {reservation.restaurant_id && (
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                fontSize: "14px",
                                color: "#6c757d",
                              }}
                            >
                              <MapPin size={14} />
                              ID ресторана: {reservation.restaurant_id}
                            </div>
                          )}
                        </div>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-end",
                          gap: "8px",
                        }}
                      >
                        <div
                          style={{
                            padding: "6px 16px",
                            backgroundColor: statusColors.bg,
                            color: statusColors.text,
                            borderRadius: "16px",
                            fontSize: "13px",
                            fontWeight: "700",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                          }}
                        >
                          {getStatusText(reservation.status)}
                        </div>
                        <div style={{ fontSize: "12px", color: "#6c757d" }}>
                          ID: #{reservation.id}
                        </div>
                      </div>
                    </div>

                    {/* Детали бронирования */}
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fit, minmax(200px, 1fr))",
                        gap: "16px",
                        padding: "16px",
                        backgroundColor: "white",
                        borderRadius: "8px",
                        marginBottom: "16px",
                        border: "1px solid #e9ecef",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "8px",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "12px",
                            color: "#6c757d",
                            fontWeight: "500",
                          }}
                        >
                          <Calendar size={12} style={{ marginRight: "6px" }} />
                          Дата и время
                        </div>
                        <div
                          style={{
                            fontSize: "16px",
                            fontWeight: "600",
                            color: "#212529",
                          }}
                        >
                          {formatDateTime(reservation.date_time)}
                        </div>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "8px",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "12px",
                            color: "#6c757d",
                            fontWeight: "500",
                          }}
                        >
                          <Clock size={12} style={{ marginRight: "6px" }} />
                          Длительность
                        </div>
                        <div
                          style={{
                            fontSize: "16px",
                            fontWeight: "600",
                            color: "#212529",
                          }}
                        >
                          {reservation.duration || 2} часа
                        </div>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "8px",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "12px",
                            color: "#6c757d",
                            fontWeight: "500",
                          }}
                        >
                          <Users size={12} style={{ marginRight: "6px" }} />
                          Мест/Гостей
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <div
                            style={{
                              fontSize: "16px",
                              fontWeight: "600",
                              color: "#212529",
                            }}
                          >
                            {reservation.tableSeats || 2} мест
                          </div>
                          {reservation.guests_count && (
                            <>
                              <div style={{ color: "#adb5bd" }}>•</div>
                              <div
                                style={{
                                  fontSize: "16px",
                                  fontWeight: "600",
                                  color: "#28a745",
                                }}
                              >
                                {reservation.guests_count} гостей
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "8px",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "12px",
                            color: "#6c757d",
                            fontWeight: "500",
                          }}
                        >
                          <CreditCard
                            size={12}
                            style={{ marginRight: "6px" }}
                          />
                          Сумма
                        </div>
                        <div
                          style={{
                            fontSize: "16px",
                            fontWeight: "600",
                            color: "#212529",
                          }}
                        >
                          {reservation.price
                            ? `${reservation.price} ₽`
                            : "Бесплатно"}
                        </div>
                      </div>
                    </div>

                    {/* Дополнительная информация */}
                    {reservation.special_requests && (
                      <div
                        style={{
                          padding: "12px 16px",
                          backgroundColor: "#f8f9fa",
                          borderRadius: "8px",
                          marginBottom: "16px",
                          borderLeft: "4px solid #007bff",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "14px",
                            fontWeight: "600",
                            color: "#495057",
                            marginBottom: "4px",
                          }}
                        >
                          Особые пожелания:
                        </div>
                        <div style={{ fontSize: "14px", color: "#6c757d" }}>
                          {reservation.special_requests}
                        </div>
                      </div>
                    )}

                    {/* Кнопки действий */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: "12px",
                      }}
                    >
                      {isPending && (
                        <button
                          onClick={() =>
                            navigate(
                              `/payment?reservation_id=${reservation.id}`
                            )
                          }
                          style={{
                            padding: "8px 16px",
                            backgroundColor: "#28a745",
                            color: "white",
                            border: "none",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontWeight: "600",
                            fontSize: "14px",
                            transition: "background-color 0.2s",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "#218838";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "#28a745";
                          }}
                        >
                          <CreditCard
                            size={14}
                            style={{ marginRight: "6px" }}
                          />
                          Оплатить
                        </button>
                      )}

                      <button
                        onClick={() => {
                          if (reservation.restaurant_id) {
                            navigate(
                              `/restaurants/${reservation.restaurant_id}`
                            );
                          } else {
                            navigate("/restaurants");
                          }
                        }}
                        style={{
                          padding: "8px 16px",
                          backgroundColor: "#007bff",
                          color: "white",
                          border: "none",
                          borderRadius: "6px",
                          cursor: "pointer",
                          fontWeight: "600",
                          fontSize: "14px",
                          transition: "background-color 0.2s",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "#0056b3";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "#007bff";
                        }}
                      >
                        <Utensils size={14} style={{ marginRight: "6px" }} />
                        Посмотреть ресторан
                      </button>

                      {(isPending || isActive) && (
                        <button
                          onClick={() => {
                            if (
                              window.confirm(
                                "Вы уверены, что хотите отменить это бронирование?"
                              )
                            ) {
                              alert(
                                "Функция отмены бронирования будет добавлена позже"
                              );
                              // TODO: Добавить вызов API для отмены бронирования
                            }
                          }}
                          style={{
                            padding: "8px 16px",
                            backgroundColor: "transparent",
                            color: "#dc3545",
                            border: "2px solid #dc3545",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontWeight: "600",
                            fontSize: "14px",
                            transition: "all 0.2s",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "#dc3545";
                            e.currentTarget.style.color = "white";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor =
                              "transparent";
                            e.currentTarget.style.color = "#dc3545";
                          }}
                        >
                          <X size={14} style={{ marginRight: "6px" }} />
                          Отменить
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div
              style={{
                textAlign: "center",
                padding: "60px 24px",
                color: "#6c757d",
                backgroundColor: "#f8f9fa",
                borderRadius: "12px",
                border: "2px dashed #dee2e6",
              }}
            >
              <Calendar
                size={64}
                style={{ marginBottom: "20px", color: "#adb5bd", opacity: 0.5 }}
              />
              <div
                style={{
                  fontSize: "18px",
                  fontWeight: "500",
                  marginBottom: "12px",
                  color: "#495057",
                }}
              >
                Нет активных бронирований
              </div>
              <div
                style={{
                  fontSize: "15px",
                  color: "#868e96",
                  marginBottom: "24px",
                  maxWidth: "400px",
                  margin: "0 auto 24px",
                }}
              >
                У вас пока нет забронированных столов. Вы можете выбрать
                ресторан и забронировать стол прямо сейчас.
              </div>
              <button
                onClick={() => navigate("/restaurants")}
                style={{
                  padding: "12px 24px",
                  backgroundColor: "#1976d2",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "15px",
                  fontWeight: "600",
                  transition: "background-color 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#1565c0";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#1976d2";
                }}
              >
                <TableIcon size={16} style={{ marginRight: "8px" }} />
                Забронировать стол
              </button>
            </div>
          )}
        </Section>

        {/* Кнопка выхода */}
        <Section>
          <LogoutButton onClick={handleLogout}>
            <LogOut size={16} />
            Выйти из системы
          </LogoutButton>
        </Section>
      </ProfileContent>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .spin {
            animation: spin 1s linear infinite;
          }
        `}
      </style>
    </ProfileContainer>
  );
});

export default Profile;
