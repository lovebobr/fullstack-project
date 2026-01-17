import React, {
  useState,
  useEffect,
  type ChangeEvent,
  type FormEvent,
  useCallback,
  useMemo,
} from "react";
import { observer } from "mobx-react-lite";
import { restaurantStore } from "../app/store/restaurant.store";
import { authStore } from "../app/store/auth.store";
import { ApplicationsPage } from "./ApplicationsPage";
import { Editor } from "../app/component/Editor";
import {
  Home,
  Utensils,
  Users,
  Calendar,
  Map,
  Edit,
  Trash2,
  Plus,
  X,
  User,
  BookOpen,
  MapPin,
  FileText,
} from "lucide-react";
import { BookingPage } from "./BookingPage";
import { ManagerManagement } from "./ManagerManagement";
import { Profile } from "./Profile";
import { managerStore } from "../app/store/manager.store";

// Импортируем все стили из отдельного файла
import {
  AdminLayout,
  Sidebar,
  SidebarHeader,
  SidebarItem,
  SidebarIcon,
  MainContent,
  ContentHeader,
  ContentBody,
  StatsGrid,
  StatCard,
  StatValue,
  StatLabel,
  StatIcon,
  UserProfile,
  RestaurantGrid,
  RestaurantCard,
  RestaurantImage,
  RestaurantIcon,
  RestaurantContent,
  RestaurantName,
  RestaurantInfo,
  InfoRow,
  RestaurantFooter,
  TablesCount,
  AdminBookingContainer,
  AdminBookingContent,
  AdminBookingGrid,
  AdminMapContainer,
  LoadingState,
  ErrorState,
  EmptyState,
  SectionTitle,
} from "../styled/AdminPanel.styles";

import {
  RestaurantForm,
  FormInput,
  FormTextarea,
  FormButton,
  RestaurantTable,
  TableHeader,
  TableRow,
  TableCell,
  TableActions,
  IconButton,
  StatusBadge,
} from "../styled/Restaurant.styles";

export const AdminPanel = observer(() => {
  const [activeTab, setActiveTab] = useState<
    | "dashboard"
    | "restaurants"
    | "managers"
    | "bookings"
    | "profile"
    | "applications"
  >("dashboard");
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<
    number | null
  >(null);
  const [bookingRestaurantId, setBookingRestaurantId] = useState<number | null>(
    null
  );
  const [showEditor, setShowEditor] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    description: "",
  });
  const [editingRestaurant, setEditingRestaurant] = useState<number | null>(
    null
  );

  useEffect(() => {
    restaurantStore.loadRestaurants();
  }, []);

  useEffect(() => {
    if (authStore.user?.role === "admin") {
      managerStore.loadManagers();
    }
  }, [authStore.user?.role]);

  const currentUser = authStore.user;
  const userRole = currentUser?.role;
  const isAdmin = userRole === "admin";
  const isManager = userRole === "manager";
  const isLoading = authStore.loading || restaurantStore.loading;

  const handleProfileClick = useCallback(() => {
    setActiveTab("profile");
  }, []);

  const handleFormChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleCreateRestaurant = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      if (!isAdmin) return;

      try {
        const restaurantData = {
          name: formData.name,
          address: formData.address,
          description: formData.description,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          email: "",
          opening_hours: "",
          is_active: true,
          manager_id: null,
        };

        await restaurantStore.createRestaurant(restaurantData);
        setFormData({ name: "", address: "", description: "" });
        restaurantStore.loadRestaurants();
      } catch (error) {
        console.error("Ошибка создания ресторана:", error);
      }
    },
    [formData, isAdmin]
  );

  const handleEditRestaurant = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      if (!editingRestaurant || !isAdmin) return;

      try {
        await restaurantStore.updateRestaurant(editingRestaurant, formData);
        setFormData({ name: "", address: "", description: "" });
        setEditingRestaurant(null);
        restaurantStore.loadRestaurants();
      } catch (error) {
        console.error("Ошибка редактирования ресторана:", error);
      }
    },
    [editingRestaurant, formData, isAdmin]
  );

  const handleDeleteRestaurant = useCallback(
    async (id: number) => {
      if (!isAdmin) return;
      if (window.confirm("Вы уверены, что хотите удалить ресторан?")) {
        try {
          await restaurantStore.deleteRestaurant(id);
          restaurantStore.loadRestaurants();
        } catch (error) {
          console.error("Ошибка удаления ресторана:", error);
        }
      }
    },
    [isAdmin]
  );

  const handleOpenEditor = useCallback((restaurantId: number) => {
    setSelectedRestaurantId(restaurantId);
    setShowEditor(true);
  }, []);

  const handleCloseEditor = useCallback(() => {
    setShowEditor(false);
    setSelectedRestaurantId(null);
  }, []);

  const handleCancelEdit = useCallback(() => {
    setEditingRestaurant(null);
    setFormData({ name: "", address: "", description: "" });
  }, []);

  const handleOpenBookingPage = useCallback((restaurantId: number) => {
    setBookingRestaurantId(restaurantId);
    setActiveTab("bookings");
  }, []);

  const handleCloseBookingPage = useCallback(() => {
    setBookingRestaurantId(null);
    setActiveTab("restaurants");
  }, []);

  const DashboardContent = useMemo(() => {
    if (isLoading) {
      return <LoadingState>Загрузка данных...</LoadingState>;
    }

    const totalTables = restaurantStore.restaurants.reduce(
      (acc, restaurant) => acc + (restaurant.tables?.length || 0),
      0
    );

    return (
      <div>
        <StatsGrid>
          <StatCard>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <div>
                <StatValue>{restaurantStore.restaurants.length}</StatValue>
                <StatLabel>
                  {isManager ? "Мои рестораны" : "Всего ресторанов"}
                </StatLabel>
              </div>
              <StatIcon
                style={{ backgroundColor: "#F4616C15", color: "#F4616C" }}
              >
                <Utensils size={24} />
              </StatIcon>
            </div>
          </StatCard>

          <StatCard>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <div>
                <StatValue>{totalTables}</StatValue>
                <StatLabel>Столики</StatLabel>
              </div>
              <StatIcon
                style={{ backgroundColor: "#9C46AE15", color: "#9C46AE" }}
              >
                <Utensils size={24} />
              </StatIcon>
            </div>
          </StatCard>

          {isAdmin && (
            <StatCard>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <div>
                  <StatValue>{managerStore.managers.length}</StatValue>
                  <StatLabel>Всего менеджеров</StatLabel>
                </div>
                <StatIcon
                  style={{ backgroundColor: "#F4616C15", color: "#F4616C" }}
                >
                  <Users size={24} />
                </StatIcon>
              </div>
            </StatCard>
          )}
        </StatsGrid>
      </div>
    );
  }, [restaurantStore.restaurants, isAdmin, isManager, isLoading]);

  const RestaurantsContent = useMemo(() => {
    const handleEditClick = (restaurant: any) => {
      if (!isAdmin) return;
      setEditingRestaurant(restaurant.id);
      setFormData({
        name: restaurant.name,
        address: restaurant.address,
        description: restaurant.description,
      });
    };

    if (isLoading) {
      return <LoadingState>Загрузка ресторанов...</LoadingState>;
    }

    return (
      <div>
        {isAdmin && (
          <RestaurantForm
            onSubmit={
              editingRestaurant ? handleEditRestaurant : handleCreateRestaurant
            }
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "20px",
              }}
            >
              {editingRestaurant ? (
                <>
                  <Edit size={20} />
                  <h3
                    style={{
                      margin: 0,
                      fontSize: "18px",
                      fontWeight: "600",
                      color: "#2c3e50",
                    }}
                  >
                    Редактировать ресторан
                  </h3>
                </>
              ) : (
                <>
                  <Plus size={20} />
                  <h3
                    style={{
                      margin: 0,
                      fontSize: "18px",
                      fontWeight: "600",
                      color: "#2c3e50",
                    }}
                  >
                    Создать новый ресторан
                  </h3>
                </>
              )}
            </div>

            {editingRestaurant && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginBottom: "20px",
                }}
              >
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    background: "none",
                    border: "1px solid #dc3545",
                    color: "#dc3545",
                    padding: "8px 16px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "14px",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#dc3545";
                    e.currentTarget.style.color = "white";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "#dc3545";
                  }}
                >
                  <X size={16} />
                  Отменить
                </button>
              </div>
            )}

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "20px",
                marginBottom: "20px",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    fontWeight: "500",
                  }}
                >
                  Название ресторана *
                </label>
                <FormInput
                  type="text"
                  name="name"
                  placeholder="Введите название ресторана"
                  value={formData.name}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    fontWeight: "500",
                  }}
                >
                  Адрес *
                </label>
                <FormInput
                  type="text"
                  name="address"
                  placeholder="Введите адрес ресторана"
                  value={formData.address}
                  onChange={handleFormChange}
                  required
                />
              </div>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "5px",
                  fontWeight: "500",
                }}
              >
                Описание ресторана
              </label>
              <FormTextarea
                name="description"
                placeholder="Опишите особенности ресторана..."
                value={formData.description}
                onChange={handleFormChange}
                rows={3}
              />
            </div>

            <FormButton
              type="submit"
              style={{
                backgroundColor: "#3498db",
                minWidth: "200px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              {editingRestaurant ? (
                <>
                  <Edit size={16} />
                  Сохранить изменения
                </>
              ) : (
                <>
                  <Plus size={16} />
                  Создать ресторан
                </>
              )}
            </FormButton>
          </RestaurantForm>
        )}

        <div
          style={{
            background: "white",
            borderRadius: "8px",
            overflow: "hidden",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "20px",
              borderBottom: "1px solid #eaeaea",
              margin: 0,
            }}
          >
            <Utensils size={20} />
            <h3
              style={{
                margin: 0,
                fontSize: "18px",
                fontWeight: "600",
                color: "#2c3e50",
              }}
            >
              {isAdmin ? "Список ресторанов" : "Мои рестораны"}
              <span
                style={{
                  background: "#e9ecef",
                  color: "#495057",
                  padding: "2px 8px",
                  borderRadius: "12px",
                  fontSize: "14px",
                  fontWeight: "normal",
                  marginLeft: "10px",
                }}
              >
                {restaurantStore.restaurants.length}
              </span>
            </h3>
          </div>

          {restaurantStore.loading && (
            <LoadingState>Загрузка ресторанов...</LoadingState>
          )}

          {restaurantStore.error && (
            <ErrorState>{restaurantStore.error}</ErrorState>
          )}

          {!restaurantStore.loading &&
            restaurantStore.restaurants.length > 0 && (
              <RestaurantTable>
                <thead>
                  <TableHeader>
                    <TableCell>Название</TableCell>
                    <TableCell>Адрес</TableCell>
                    <TableCell>Количество столов</TableCell>
                    <TableCell>Статус</TableCell>
                    <TableCell style={{ textAlign: "center" }}>
                      Действия
                    </TableCell>
                  </TableHeader>
                </thead>
                <tbody>
                  {restaurantStore.restaurants.map((restaurant) => (
                    <TableRow key={restaurant.id}>
                      <TableCell>
                        <div>
                          <div
                            style={{ fontWeight: "600", marginBottom: "4px" }}
                          >
                            {restaurant.name}
                          </div>
                          {restaurant.description && (
                            <div
                              style={{
                                fontSize: "12px",
                                color: "#666",
                                lineHeight: "1.3",
                              }}
                            >
                              {restaurant.description.length > 60
                                ? `${restaurant.description.substring(
                                    0,
                                    60
                                  )}...`
                                : restaurant.description}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div style={{ fontSize: "14px" }}>
                          {restaurant.address}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div
                          style={{
                            background: "#e7f3ff",
                            color: "#0066cc",
                            padding: "4px 8px",
                            borderRadius: "12px",
                            fontSize: "12px",
                            fontWeight: "600",
                            display: "inline-block",
                          }}
                        >
                          {(restaurant.tables && restaurant.tables.length) || 0}{" "}
                          столов
                        </div>
                      </TableCell>
                      <TableCell>
                        <StatusBadge active={true}>Активен</StatusBadge>
                      </TableCell>
                      <TableCell>
                        <TableActions>
                          <IconButton
                            onClick={() => handleOpenEditor(restaurant.id)}
                            title="Карта зала"
                            color="#17a2b8"
                          >
                            <Map size={16} />
                          </IconButton>

                          <IconButton
                            onClick={() => handleOpenBookingPage(restaurant.id)}
                            title="Забронировать столик"
                            color="#28a745"
                          >
                            <BookOpen size={16} />
                          </IconButton>

                          {isAdmin && (
                            <>
                              <IconButton
                                onClick={() => handleEditClick(restaurant)}
                                title="Редактировать"
                                color="#ffc107"
                              >
                                <Edit size={16} />
                              </IconButton>

                              <IconButton
                                onClick={() =>
                                  handleDeleteRestaurant(restaurant.id)
                                }
                                title="Удалить"
                                color="#dc3545"
                              >
                                <Trash2 size={16} />
                              </IconButton>
                            </>
                          )}
                        </TableActions>
                      </TableCell>
                    </TableRow>
                  ))}
                </tbody>
              </RestaurantTable>
            )}

          {!restaurantStore.loading &&
            restaurantStore.restaurants.length === 0 && (
              <EmptyState>
                <div style={{ fontSize: "48px", marginBottom: "10px" }}>🏪</div>
                <h4 style={{ margin: "0 0 10px 0", color: "#333" }}>
                  {isAdmin
                    ? "Нет созданных ресторанов"
                    : "Вам не назначены рестораны"}
                </h4>
                <p style={{ margin: 0 }}>
                  {isAdmin
                    ? "Создайте первый ресторан, используя форму выше"
                    : "Обратитесь к администратору для назначения ресторана"}
                </p>
              </EmptyState>
            )}
        </div>
      </div>
    );
  }, [
    editingRestaurant,
    formData,
    handleFormChange,
    handleCreateRestaurant,
    handleEditRestaurant,
    handleCancelEdit,
    handleOpenEditor,
    handleDeleteRestaurant,
    handleOpenBookingPage,
    restaurantStore.loading,
    restaurantStore.error,
    restaurantStore.restaurants,
    isAdmin,
    isLoading,
  ]);

  const BookingsContent = useMemo(() => {
    if (isLoading) {
      return <LoadingState>Загрузка ресторанов...</LoadingState>;
    }

    return (
      <div>
        <SectionTitle>
          <BookOpen size={24} />
          Выберите ресторан для бронирования
        </SectionTitle>

        {restaurantStore.loading ? (
          <LoadingState>Загрузка ресторанов...</LoadingState>
        ) : restaurantStore.error ? (
          <ErrorState>{restaurantStore.error}</ErrorState>
        ) : restaurantStore.restaurants.length > 0 ? (
          <RestaurantGrid>
            {restaurantStore.restaurants.map((restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                onClick={() => handleOpenBookingPage(restaurant.id)}
              >
                <RestaurantImage>
                  <RestaurantIcon>
                    <Utensils size={70} />
                  </RestaurantIcon>
                </RestaurantImage>

                <RestaurantContent>
                  <RestaurantName>{restaurant.name}</RestaurantName>

                  <RestaurantInfo>
                    <InfoRow>
                      <MapPin size={14} />
                      <span>{restaurant.address}</span>
                    </InfoRow>

                    {restaurant.description && (
                      <InfoRow>
                        <span>{restaurant.description}</span>
                      </InfoRow>
                    )}
                  </RestaurantInfo>

                  <RestaurantFooter>
                    <TablesCount>
                      {restaurant.tables?.length || 0} столов
                    </TablesCount>
                    <div style={{ fontSize: "12px", color: "#6c757d" }}>
                      Нажмите для бронирования
                    </div>
                  </RestaurantFooter>
                </RestaurantContent>
              </RestaurantCard>
            ))}
          </RestaurantGrid>
        ) : (
          <EmptyState>
            <div style={{ fontSize: "48px", marginBottom: "10px" }}>🏪</div>
            <h4 style={{ margin: "0 0 10px 0", color: "#333" }}>
              Нет доступных ресторанов
            </h4>
            <p style={{ margin: 0, color: "#666" }}>
              {isAdmin
                ? "Создайте ресторан для возможности бронирования"
                : "Обратитесь к администратору для назначения ресторана"}
            </p>
          </EmptyState>
        )}
      </div>
    );
  }, [isLoading, restaurantStore, handleOpenBookingPage, isAdmin]);

  const AdminBookingPageContent = useMemo(() => {
    if (!bookingRestaurantId) return null;

    return (
      <AdminBookingContainer>
        <AdminBookingContent>
          <AdminBookingGrid>
            <AdminMapContainer>
              <BookingPage
                restaurantId={bookingRestaurantId}
                onClose={handleCloseBookingPage}
                hideHeader={true}
                adminMode={true}
              />
            </AdminMapContainer>
          </AdminBookingGrid>
        </AdminBookingContent>
      </AdminBookingContainer>
    );
  }, [bookingRestaurantId, handleCloseBookingPage]);

  // Если открыта страница бронирования для конкретного ресторана
  if (bookingRestaurantId) {
    return (
      <AdminLayout>
        <Sidebar>
          <SidebarHeader>
            <h3>{isAdmin ? "Админ Панель" : "Панель Менеджера"}</h3>
          </SidebarHeader>

          <SidebarItem
            active={activeTab === "dashboard"}
            onClick={() => {
              handleCloseBookingPage();
              setActiveTab("dashboard");
            }}
          >
            <SidebarIcon>
              <Home size={20} />
            </SidebarIcon>
            <span>Главная</span>
          </SidebarItem>

          <SidebarItem
            active={activeTab === "restaurants"}
            onClick={() => {
              handleCloseBookingPage();
              setActiveTab("restaurants");
            }}
          >
            <SidebarIcon>
              <Utensils size={20} />
            </SidebarIcon>
            <span>Рестораны</span>
          </SidebarItem>

          <SidebarItem
            active={activeTab === "bookings"}
            onClick={handleCloseBookingPage}
          >
            <SidebarIcon>
              <BookOpen size={20} />
            </SidebarIcon>
            <span>Бронировать</span>
          </SidebarItem>

          {isAdmin && (
            <SidebarItem
              active={activeTab === "managers"}
              onClick={() => {
                handleCloseBookingPage();
                setActiveTab("managers");
              }}
            >
              <SidebarIcon>
                <Users size={20} />
              </SidebarIcon>
              <span>Менеджеры</span>
            </SidebarItem>
          )}

          {isAdmin && (
            <SidebarItem
              active={activeTab === "applications"}
              onClick={() => {
                handleCloseBookingPage();
                setActiveTab("applications");
              }}
            >
              <SidebarIcon>
                <FileText size={20} />
              </SidebarIcon>
              <span>Заявки</span>
            </SidebarItem>
          )}

          <SidebarItem
            active={activeTab === "profile"}
            onClick={() => {
              handleCloseBookingPage();
              setActiveTab("profile");
            }}
          >
            <SidebarIcon>
              <User size={20} />
            </SidebarIcon>
            <span>Профиль</span>
          </SidebarItem>
        </Sidebar>

        <MainContent>
          <ContentHeader>
            <h1>Бронирование столика</h1>
            <UserProfile
              onClick={() => {
                handleCloseBookingPage();
                setActiveTab("profile");
              }}
            >
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  backgroundColor: isAdmin ? "#667eea" : "#4facfe",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "14px",
                  marginRight: "8px",
                }}
              >
                {currentUser?.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontWeight: "500", fontSize: "14px" }}>
                  {currentUser?.name}
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#666",
                    fontWeight: "normal",
                  }}
                >
                  {isAdmin ? "Администратор" : "Менеджер"}
                </div>
              </div>
            </UserProfile>
          </ContentHeader>

          <ContentBody>{AdminBookingPageContent}</ContentBody>
        </MainContent>
      </AdminLayout>
    );
  }

  // Если показываем редактор
  if (showEditor && selectedRestaurantId) {
    return (
      <AdminLayout>
        <MainContent style={{ marginLeft: 0, width: "100%" }}>
          <ContentHeader>
            <h1 style={{ margin: 0 }}>Редактор карты зала</h1>

            <UserProfile
              onClick={() => {
                handleCloseEditor();
                setActiveTab("profile");
              }}
            >
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  backgroundColor: isAdmin ? "#667eea" : "#4facfe",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "14px",
                  marginRight: "8px",
                }}
              >
                {currentUser?.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontWeight: "500", fontSize: "14px" }}>
                  {currentUser?.name}
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#666",
                    fontWeight: "normal",
                  }}
                >
                  {isAdmin ? "Администратор" : "Менеджер"}
                </div>
              </div>
            </UserProfile>
          </ContentHeader>
          <ContentBody style={{ paddingTop: "1rem" }}>
            <Editor restaurantId={selectedRestaurantId} userRole={userRole} />
          </ContentBody>
        </MainContent>
      </AdminLayout>
    );
  }

  // Если еще загружается информация о пользователе
  if (authStore.loading) {
    return (
      <AdminLayout>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <LoadingState>Проверка авторизации...</LoadingState>
        </div>
      </AdminLayout>
    );
  }

  // Если пользователь не авторизован или не админ/менеджер
  if (!authStore.isAuthenticated || (!isAdmin && !isManager)) {
    return (
      <AdminLayout>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            padding: "20px",
          }}
        >
          <div
            style={{
              textAlign: "center",
              maxWidth: "400px",
              background: "white",
              padding: "40px",
              borderRadius: "8px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            }}
          >
            <h2 style={{ color: "#dc3545", marginBottom: "20px" }}>
              Доступ запрещен
            </h2>
            <p style={{ marginBottom: "20px", color: "#666" }}>
              У вас нет прав для доступа к административной панели.
              {!authStore.isAuthenticated && " Пожалуйста, войдите в систему."}
            </p>
            {!authStore.isAuthenticated && (
              <button
                onClick={() => (window.location.href = "/login")}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#f4616c",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Перейти на страницу входа
              </button>
            )}
          </div>
        </div>
      </AdminLayout>
    );
  }

  // Основной рендер админ-панели
  return (
    <AdminLayout>
      <Sidebar>
        <SidebarHeader>
          <h3>{isAdmin ? "Админ Панель" : "Панель Менеджера"}</h3>
        </SidebarHeader>

        <SidebarItem
          active={activeTab === "dashboard"}
          onClick={() => setActiveTab("dashboard")}
        >
          <SidebarIcon>
            <Home size={20} />
          </SidebarIcon>
          <span>Главная</span>
        </SidebarItem>

        <SidebarItem
          active={activeTab === "restaurants"}
          onClick={() => setActiveTab("restaurants")}
        >
          <SidebarIcon>
            <Utensils size={20} />
          </SidebarIcon>
          <span>Рестораны</span>
        </SidebarItem>

        <SidebarItem
          active={activeTab === "bookings"}
          onClick={() => setActiveTab("bookings")}
        >
          <SidebarIcon>
            <BookOpen size={20} />
          </SidebarIcon>
          <span>Бронировать</span>
        </SidebarItem>

        {isAdmin && (
          <SidebarItem
            active={activeTab === "managers"}
            onClick={() => setActiveTab("managers")}
          >
            <SidebarIcon>
              <Users size={20} />
            </SidebarIcon>
            <span>Менеджеры</span>
          </SidebarItem>
        )}

        {isAdmin && (
          <SidebarItem
            active={activeTab === "applications"}
            onClick={() => setActiveTab("applications")}
          >
            <SidebarIcon>
              <FileText size={20} />
            </SidebarIcon>
            <span>Заявки</span>
          </SidebarItem>
        )}

        <SidebarItem
          active={activeTab === "profile"}
          onClick={() => setActiveTab("profile")}
        >
          <SidebarIcon>
            <User size={20} />
          </SidebarIcon>
          <span>Профиль</span>
        </SidebarItem>
      </Sidebar>

      <MainContent>
        <ContentHeader>
          <h1>
            {activeTab === "dashboard" && "Главная панель"}
            {activeTab === "restaurants" &&
              (isAdmin ? "Рестораны" : "Мои рестораны")}
            {activeTab === "bookings" && "Бронирование столиков"}
            {activeTab === "managers" && "Менеджеры"}
            {activeTab === "profile" && "Мой профиль"}
            {activeTab === "applications" && "Управление заявками"}
          </h1>
          <UserProfile onClick={handleProfileClick}>
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                backgroundColor: isAdmin ? "#667eea" : "#4facfe",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: "bold",
                fontSize: "14px",
                marginRight: "8px",
              }}
            >
              {currentUser?.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontWeight: "500", fontSize: "14px" }}>
                {currentUser?.name}
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: "#666",
                  fontWeight: "normal",
                }}
              >
                {isAdmin ? "Администратор" : "Менеджер"}
              </div>
            </div>
          </UserProfile>
        </ContentHeader>

        <ContentBody>
          {activeTab === "dashboard" && DashboardContent}
          {activeTab === "restaurants" && RestaurantsContent}
          {activeTab === "bookings" && BookingsContent}
          {activeTab === "managers" && isAdmin && <ManagerManagement />}
          {activeTab === "profile" && <Profile />}
          {activeTab === "applications" && isAdmin && <ApplicationsPage />}
        </ContentBody>
      </MainContent>
    </AdminLayout>
  );
});

export default AdminPanel;
