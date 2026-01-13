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
    profileStore.loadReservationHistory();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: "Ожидание",
      confirmed: "Подтверждено",
      completed: "Завершено",
      cancelled: "Отменено",
      no_show: "Неявка",
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

  if (profileStore.loading) {
    return (
      <ProfileContainer>
        <ProfileContent>
          <div style={{ textAlign: "center", padding: "40px" }}>
            Загрузка профиля...
          </div>
        </ProfileContent>
      </ProfileContainer>
    );
  }

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
            Ошибка: {profileStore.error}
            <div style={{ marginTop: "10px" }}>
              <button
                onClick={() => profileStore.loadProfile()}
                style={{
                  padding: "8px 16px",
                  background: "#dc3545",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Попробовать снова
              </button>
            </div>
          </div>
        </ProfileContent>
      </ProfileContainer>
    );
  }

  if (!profileStore.profileData) {
    return (
      <ProfileContainer>
        <ProfileContent>
          <div style={{ textAlign: "center", padding: "40px" }}>
            Данные профиля не найдены
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
        <ProfileName>{profileData.name}</ProfileName>
        <ProfileRole>{profileData.role}</ProfileRole>
      </ProfileHeader>

      <ProfileContent>
        {profileStore.error && (
          <div
            style={{
              color: "#dc3545",
              background: "#f8d7da",
              padding: "12px",
              borderRadius: "8px",
              marginBottom: "20px",
              border: "1px solid #f5c6cb",
            }}
          >
            {profileStore.error}
            <button
              onClick={() => profileStore.clearError()}
              style={{
                marginLeft: "10px",
                background: "none",
                border: "none",
                color: "#721c24",
                cursor: "pointer",
                fontSize: "12px",
              }}
            >
              ×
            </button>
          </div>
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

        {/* Раздел истории бронирований */}
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
              <History size={20} />
              История бронирований
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
              }}
            >
              <RefreshCw
                size={14}
                className={profileStore.loadingReservations ? "spin" : ""}
              />
              {profileStore.loadingReservations ? "Обновление..." : "Обновить"}
            </button>
          </div>

          <div style={{ marginTop: "8px" }}>
            {profileData.reservations && profileData.reservations.length > 0 ? (
              <div>
                {profileData.reservations.map((reservation) => {
                  const statusColors = getStatusColor(reservation.status);

                  return (
                    <div
                      key={reservation.id}
                      style={{
                        padding: "16px",
                        marginBottom: "12px",
                        backgroundColor: "#ffffff",
                        borderRadius: "8px",
                        border: "1px solid #e9ecef",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow =
                          "0 2px 8px rgba(0,0,0,0.08)";
                        e.currentTarget.style.borderColor = "#cfe2ff";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow =
                          "0 1px 3px rgba(0,0,0,0.05)";
                        e.currentTarget.style.borderColor = "#e9ecef";
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          marginBottom: "12px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                          }}
                        >
                          <div
                            style={{
                              width: "48px",
                              height: "48px",
                              borderRadius: "50%",
                              backgroundColor: "#e3f2fd",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "#1976d2",
                              flexShrink: 0,
                            }}
                          >
                            <Utensils size={24} />
                          </div>
                          <div>
                            <div
                              style={{
                                fontWeight: "600",
                                color: "#212529",
                                fontSize: "18px",
                                marginBottom: "4px",
                              }}
                            >
                              {reservation.restaurantName}
                            </div>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "12px",
                                fontSize: "14px",
                                color: "#6c757d",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "4px",
                                }}
                              >
                                <Calendar size={14} />
                                {formatDate(reservation.date_time)}
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "4px",
                                }}
                              >
                                <Clock size={14} />
                                {formatTime(reservation.date_time)}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          style={{
                            padding: "4px 12px",
                            backgroundColor: statusColors.bg,
                            color: statusColors.text,
                            borderRadius: "12px",
                            fontSize: "12px",
                            fontWeight: "600",
                            textTransform: "uppercase",
                          }}
                        >
                          {getStatusText(reservation.status)}
                        </div>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          paddingTop: "12px",
                          borderTop: "1px solid #f8f9fa",
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
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                              padding: "6px 12px",
                              backgroundColor: "#f8f9fa",
                              borderRadius: "6px",
                              fontSize: "14px",
                              color: "#495057",
                            }}
                          >
                            <div style={{ fontWeight: "500" }}>Стол:</div>
                            <div style={{ fontWeight: "600" }}>
                              {reservation.tableNumber}
                            </div>
                          </div>

                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                              padding: "6px 12px",
                              backgroundColor: "#f8f9fa",
                              borderRadius: "6px",
                              fontSize: "14px",
                              color: "#495057",
                            }}
                          >
                            <Users size={14} />
                            <div style={{ fontWeight: "500" }}>Мест:</div>
                            <div style={{ fontWeight: "600" }}>
                              {reservation.tableSeats}
                            </div>
                          </div>

                          {reservation.guests_count && (
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                                padding: "6px 12px",
                                backgroundColor: "#f8f9fa",
                                borderRadius: "6px",
                                fontSize: "14px",
                                color: "#495057",
                              }}
                            >
                              <div style={{ fontWeight: "500" }}>Гостей:</div>
                              <div style={{ fontWeight: "600" }}>
                                {reservation.guests_count}
                              </div>
                            </div>
                          )}
                        </div>

                        <div
                          style={{
                            fontSize: "14px",
                            color: "#6c757d",
                            fontStyle: "italic",
                          }}
                        >
                          ID: #{reservation.id}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div
                style={{
                  textAlign: "center",
                  padding: "40px 24px",
                  color: "#6c757d",
                  backgroundColor: "#f8f9fa",
                  borderRadius: "8px",
                  border: "2px dashed #dee2e6",
                }}
              >
                <History
                  size={48}
                  style={{ marginBottom: "16px", color: "#adb5bd" }}
                />
                <div
                  style={{
                    fontSize: "16px",
                    fontWeight: "500",
                    marginBottom: "8px",
                  }}
                >
                  История бронирований пуста
                </div>
                <div style={{ fontSize: "14px", color: "#868e96" }}>
                  Здесь будут отображаться ваши бронирования столиков
                </div>
                <button
                  onClick={() => navigate("/restaurants")}
                  style={{
                    marginTop: "16px",
                    padding: "8px 16px",
                    backgroundColor: "#1976d2",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  Забронировать стол
                </button>
              </div>
            )}
          </div>
        </Section>

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
