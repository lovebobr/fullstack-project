import { useState, useEffect, type FormEvent } from "react";
import { observer } from "mobx-react-lite";
import {
  Users,
  Plus,
  Mail,
  Edit,
  Trash2,
  Ban,
  CheckCircle,
  X,
  Search,
  Filter,
  Shield,
  ShieldOff,
  Calendar,
  Phone,
} from "lucide-react";
import { managerStore } from "../app/store/manager.store";
import { restaurantStore } from "../app/store/restaurant.store";
import { userStore } from "../app/store/user.store"; // ИМПОРТИРУЕМ НОВЫЙ СТОР
import {
  ManagerForm,
  FormInput,
  FormButton,
  ManagerTable,
  TableHeader,
  TableRow,
  TableCell,
  TableActions,
  IconButton,
  StatusBadge,
  FormGrid,
  ContactInfo,
  SectionHeader,
} from "../styled/Manager.styles";

export const ManagerManagement = observer(() => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [editingManager, setEditingManager] = useState<number | null>(null);

  // НОВЫЕ СОСТОЯНИЯ ДЛЯ ФИЛЬТРАЦИИ ПОЛЬЗОВАТЕЛЕЙ
  const [searchTerm, setSearchTerm] = useState("");
  const [showAllUsers, setShowAllUsers] = useState(false);

  useEffect(() => {
    managerStore.loadManagers();
    restaurantStore.loadRestaurants();
    userStore.loadUsers(); // Загружаем всех пользователей
  }, []);

  // ПРИМЕНЯЕМ ФИЛЬТРЫ К ПОЛЬЗОВАТЕЛЯМ
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      userStore.setFilter("search", searchTerm);
      userStore.loadUsers();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const handleCreateManager = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await managerStore.createManager(formData);
      setFormData({ name: "", email: "", password: "" });
      // Перезагружаем оба списка
      managerStore.loadManagers();
      userStore.loadUsers();
    } catch (error) {
      console.error("Ошибка создания менеджера:", error);
    }
  };

  const handleEditManager = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingManager) return;

    try {
      await managerStore.updateManager(editingManager, {
        name: formData.name,
        email: formData.email,
      });

      setFormData({ name: "", email: "", password: "" });
      setEditingManager(null);
      // Перезагружаем оба списка
      managerStore.loadManagers();
      userStore.loadUsers();
    } catch (error) {
      console.error("Ошибка редактирования менеджера:", error);
    }
  };

  // НОВЫЙ МЕТОД: НАЗНАЧЕНИЕ РОЛИ МЕНЕДЖЕРА ИЗ СПИСКА ПОЛЬЗОВАТЕЛЕЙ
  const handleAssignManagerRole = async (
    userId: number,
    currentRole: string
  ) => {
    const newRole = currentRole === "manager" ? "user" : "manager";
    const confirmMessage =
      newRole === "manager"
        ? "Назначить пользователя менеджером?"
        : "Снять роль менеджера?";

    if (window.confirm(confirmMessage)) {
      try {
        await userStore.updateUserRole(userId, newRole as "manager" | "user");
        // Перезагружаем оба списка
        managerStore.loadManagers();
        userStore.loadUsers();
      } catch (error) {
        console.error("Ошибка изменения роли:", error);
      }
    }
  };

  // ФОРМАТИРОВАНИЕ ДАТЫ
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // ПОЛУЧАЕМ ПОЛЬЗОВАТЕЛЕЙ С ФИЛЬТРАЦИЕЙ
  const getFilteredUsers = () => {
    if (!showAllUsers) return [];

    return userStore.users.filter(
      (user) =>
        user.role !== "admin" && // Не показываем админов
        (searchTerm === "" ||
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };

  // ПОЛУЧАЕМ ТОЛЬКО МЕНЕДЖЕРОВ ИЗ СПИСКА МЕНЕДЖЕРОВ
  const getManagersOnly = () => {
    return managerStore.managers;
  };

  // РЕНДЕРИМ ТАБЛИЦУ ПОЛЬЗОВАТЕЛЕЙ ДЛЯ НАЗНАЧЕНИЯ МЕНЕДЖЕРОМ
  const renderUsersTable = () => {
    const filteredUsers = getFilteredUsers();

    if (!showAllUsers) return null;

    return (
      <div
        style={{
          background: "white",
          borderRadius: "8px",
          overflow: "hidden",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          marginBottom: "20px",
        }}
      >
        <div style={{ padding: "20px", borderBottom: "1px solid #eaeaea" }}>
          <h3
            style={{
              margin: 0,
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <Users size={20} />
            Все пользователи
            <span
              style={{
                background: "#e9ecef",
                color: "#495057",
                padding: "2px 8px",
                borderRadius: "12px",
                fontSize: "14px",
                fontWeight: "normal",
              }}
            >
              {filteredUsers.length} пользователей
            </span>
          </h3>
          <p style={{ margin: "5px 0 0 0", color: "#666", fontSize: "14px" }}>
            Назначьте роль менеджера из списка зарегистрированных пользователей
          </p>
        </div>

        {/* ПОИСК */}
        <div
          style={{ padding: "15px 20px", borderBottom: "1px solid #eaeaea" }}
        >
          <div style={{ position: "relative", maxWidth: "400px" }}>
            <Search
              size={18}
              style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#6c757d",
              }}
            />
            <input
              type="text"
              placeholder="Поиск по имени или email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 16px 10px 40px",
                border: "1px solid #dee2e6",
                borderRadius: "4px",
                fontSize: "14px",
              }}
            />
          </div>
        </div>

        {userStore.loading ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#666" }}>
            Загрузка пользователей...
          </div>
        ) : filteredUsers.length > 0 ? (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f8f9fa" }}>
                  <th
                    style={{
                      padding: "12px 16px",
                      textAlign: "left",
                      borderBottom: "1px solid #dee2e6",
                      fontWeight: "600",
                    }}
                  >
                    Пользователь
                  </th>
                  <th
                    style={{
                      padding: "12px 16px",
                      textAlign: "left",
                      borderBottom: "1px solid #dee2e6",
                      fontWeight: "600",
                    }}
                  >
                    Контакты
                  </th>
                  <th
                    style={{
                      padding: "12px 16px",
                      textAlign: "left",
                      borderBottom: "1px solid #dee2e6",
                      fontWeight: "600",
                    }}
                  >
                    Роль
                  </th>
                  <th
                    style={{
                      padding: "12px 16px",
                      textAlign: "left",
                      borderBottom: "1px solid #dee2e6",
                      fontWeight: "600",
                    }}
                  >
                    Статус
                  </th>
                  <th
                    style={{
                      padding: "12px 16px",
                      textAlign: "left",
                      borderBottom: "1px solid #dee2e6",
                      fontWeight: "600",
                    }}
                  >
                    Дата регистрации
                  </th>
                  <th
                    style={{
                      padding: "12px 16px",
                      textAlign: "center",
                      borderBottom: "1px solid #dee2e6",
                      fontWeight: "600",
                    }}
                  >
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    style={{ borderBottom: "1px solid #eaeaea" }}
                  >
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ fontWeight: "600" }}>{user.name}</div>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "4px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            fontSize: "14px",
                          }}
                        >
                          <Mail size={14} />
                          {user.email}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <div
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          padding: "4px 12px",
                          borderRadius: "20px",
                          fontSize: "12px",
                          fontWeight: "600",
                          background:
                            user.role === "manager" ? "#d1ecf1" : "#d4edda",
                          color:
                            user.role === "manager" ? "#0c5460" : "#155724",
                        }}
                      >
                        {user.role === "manager" ? (
                          <Shield size={12} />
                        ) : (
                          <Users size={12} />
                        )}
                        {user.role === "manager" ? "Менеджер" : "Пользователь"}
                      </div>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "4px 12px",
                          borderRadius: "20px",
                          fontSize: "12px",
                          fontWeight: "600",
                          background: user.is_blocked ? "#f8d7da" : "#d4edda",
                          color: user.is_blocked ? "#dc3545" : "#155724",
                        }}
                      >
                        {user.is_blocked ? "Заблокирован" : "Активен"}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          fontSize: "14px",
                        }}
                      >
                        <Calendar size={14} />
                        {formatDate(user.created_at)}
                      </div>
                    </td>
                    <td style={{ padding: "12px 16px", textAlign: "center" }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          gap: "8px",
                        }}
                      >
                        <button
                          onClick={() =>
                            handleAssignManagerRole(user.id, user.role)
                          }
                          title={
                            user.role === "manager"
                              ? "Снять роль менеджера"
                              : "Назначить менеджером"
                          }
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            padding: "6px 12px",
                            background:
                              user.role === "manager" ? "#6c757d" : "#28a745",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontSize: "12px",
                            fontWeight: "500",
                          }}
                        >
                          {user.role === "manager" ? (
                            <ShieldOff size={14} />
                          ) : (
                            <Shield size={14} />
                          )}
                          {user.role === "manager"
                            ? "Снять роль"
                            : "Назначить менеджером"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ padding: "40px", textAlign: "center", color: "#666" }}>
            <div style={{ fontSize: "48px", marginBottom: "10px" }}>👤</div>
            <h4 style={{ margin: "0 0 10px 0", color: "#333" }}>
              Пользователи не найдены
            </h4>
            <p style={{ margin: 0 }}>
              {searchTerm
                ? "Попробуйте изменить поисковый запрос"
                : "Нет зарегистрированных пользователей"}
            </p>
          </div>
        )}
      </div>
    );
  };

  // КНОПКА ПЕРЕКЛЮЧЕНИЯ МЕЖДУ ВИДАМИ
  const renderToggleButton = () => (
    <div style={{ marginBottom: "20px" }}>
      <button
        onClick={() => setShowAllUsers(!showAllUsers)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "10px 16px",
          background: showAllUsers ? "#6c757d" : "#28a745",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "14px",
          fontWeight: "500",
        }}
      >
        <Filter size={16} />
        {showAllUsers
          ? "Показать только менеджеров"
          : "Назначить из пользователей"}
      </button>
    </div>
  );

  return (
    <div>
      {/* КНОПКА ПЕРЕКЛЮЧЕНИЯ */}
      {renderToggleButton()}

      {/* ТАБЛИЦА ВСЕХ ПОЛЬЗОВАТЕЛЕЙ (ДЛЯ НАЗНАЧЕНИЯ МЕНЕДЖЕРОМ) */}
      {renderUsersTable()}

      {/* ФОРМА СОЗДАНИЯ НОВОГО МЕНЕДЖЕРА (оставляем для создания с нуля) */}
      <ManagerForm
        onSubmit={editingManager ? handleEditManager : handleCreateManager}
      >
        <SectionHeader>
          {editingManager ? (
            <>
              <Edit size={20} />
              <h3>Редактировать менеджера</h3>
            </>
          ) : (
            <>
              <Plus size={20} />
              <h3>Создать нового менеджера</h3>
            </>
          )}
        </SectionHeader>

        {editingManager && (
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: "20px",
            }}
          >
            <button
              type="button"
              onClick={() => {
                setEditingManager(null);
                setFormData({ name: "", email: "", password: "" });
              }}
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

        <FormGrid columns={2}>
          <div>
            <label
              style={{
                display: "block",
                marginBottom: "5px",
                fontWeight: "500",
              }}
            >
              ФИО менеджера *
            </label>
            <FormInput
              type="text"
              name="name"
              placeholder="Введите ФИО менеджера"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
              autoComplete="new-name"
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
              Email *
            </label>
            <FormInput
              type="email"
              name="email"
              placeholder="Введите email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
              autoComplete="new-email"
            />
          </div>
        </FormGrid>

        {!editingManager && (
          <div style={{ marginBottom: "20px", maxWidth: "400px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "5px",
                fontWeight: "500",
              }}
            >
              Пароль *
            </label>
            <FormInput
              type="password"
              name="password"
              placeholder="Введите пароль"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
              autoComplete="new-password"
            />
          </div>
        )}

        <FormButton
          type="submit"
          style={{
            backgroundColor: editingManager ? "#3498db" : "#f4616c",
            minWidth: "200px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
          disabled={managerStore.loading}
        >
          {editingManager ? (
            <>
              <Edit size={16} />
              {managerStore.loading ? "Сохранение..." : "Сохранить изменения"}
            </>
          ) : (
            <>
              <Plus size={16} />
              {managerStore.loading ? "Создание..." : "Создать менеджера"}
            </>
          )}
        </FormButton>
      </ManagerForm>

      {/* ТАБЛИЦА МЕНЕДЖЕРОВ (существующая) */}
      <div
        style={{
          background: "white",
          borderRadius: "8px",
          overflow: "hidden",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          marginTop: "20px",
        }}
      >
        <div style={{ padding: "20px", borderBottom: "1px solid #eaeaea" }}>
          <h3
            style={{
              margin: 0,
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <Users size={20} />
            Список менеджеров
            <span
              style={{
                background: "#e9ecef",
                color: "#495057",
                padding: "2px 8px",
                borderRadius: "12px",
                fontSize: "14px",
                fontWeight: "normal",
              }}
            >
              {getManagersOnly().length}
            </span>
          </h3>
        </div>

        {managerStore.loading && (
          <div style={{ padding: "40px", textAlign: "center", color: "#666" }}>
            Загрузка менеджеров...
          </div>
        )}

        {!managerStore.loading && getManagersOnly().length > 0 && (
          <ManagerTable>
            <thead>
              <TableHeader>
                <TableCell>Менеджер</TableCell>
                <TableCell>Контакты</TableCell>
                <TableCell>Ресторан</TableCell>
                <TableCell>Статус</TableCell>
                <TableCell style={{ textAlign: "center" }}>Действия</TableCell>
              </TableHeader>
            </thead>
            <tbody>
              {getManagersOnly().map((manager) => (
                <TableRow key={manager.id}>
                  <TableCell>
                    <div style={{ fontWeight: "600" }}>{manager.name}</div>
                  </TableCell>
                  <TableCell>
                    <ContactInfo>
                      <div>
                        <Mail size={14} />
                        {manager.email}
                      </div>
                    </ContactInfo>
                  </TableCell>
                  <TableCell>
                    <div style={{ fontSize: "14px" }}>
                      {manager.restaurants && manager.restaurants.length > 0
                        ? manager.restaurants.map((r) => r.name).join(", ")
                        : "Не назначен"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge active={!manager.is_blocked}>
                      {manager.is_blocked ? "Заблокирован" : "Активен"}
                    </StatusBadge>
                  </TableCell>
                  <TableCell>
                    <TableActions>
                      <IconButton
                        onClick={() => {
                          setEditingManager(manager.id);
                          setFormData({
                            name: manager.name,
                            email: manager.email,
                            password: "",
                          });
                        }}
                        title="Редактировать"
                        color="#ffc107"
                      >
                        <Edit size={16} />
                      </IconButton>

                      <IconButton
                        onClick={() =>
                          manager.is_blocked
                            ? managerStore.unblockManager(manager.id)
                            : managerStore.blockManager(manager.id)
                        }
                        title={
                          manager.is_blocked
                            ? "Разблокировать"
                            : "Заблокировать"
                        }
                        color={manager.is_blocked ? "#28a745" : "#dc3545"}
                      >
                        {manager.is_blocked ? (
                          <CheckCircle size={16} />
                        ) : (
                          <Ban size={16} />
                        )}
                      </IconButton>

                      <IconButton
                        onClick={() => managerStore.deleteManager(manager.id)}
                        title="Удалить"
                        color="#dc3545"
                      >
                        <Trash2 size={16} />
                      </IconButton>
                    </TableActions>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </ManagerTable>
        )}

        {!managerStore.loading && getManagersOnly().length === 0 && (
          <div style={{ padding: "40px", textAlign: "center", color: "#666" }}>
            <div style={{ fontSize: "48px", marginBottom: "10px" }}>👥</div>
            <h4 style={{ margin: "0 0 10px 0", color: "#333" }}>
              Нет созданных менеджеров
            </h4>
            <p style={{ margin: 0 }}>
              Создайте менеджера с помощью формы выше или назначьте роль из
              списка пользователей
            </p>
          </div>
        )}
      </div>
    </div>
  );
});
