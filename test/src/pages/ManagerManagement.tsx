import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
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
} from "lucide-react";
import { managerStore } from "../app/store/manager.store";
import { restaurantStore } from "../app/store/restaurant.store";
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
  const [assignFormData, setAssignFormData] = useState({
    managerId: "",
    restaurantId: "",
  });
  const [editingManager, setEditingManager] = useState<number | null>(null);

  useEffect(() => {
    managerStore.loadManagers();
    restaurantStore.loadRestaurants();
  }, []);

  const handleCreateManager = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await managerStore.createManager(formData);
      setFormData({ name: "", email: "", password: "" });
    } catch (error) {
      console.error("Ошибка создания менеджера:", error);
    }
  };

  const handleEditManager = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingManager) return;

    try {
      // ВЫЗЫВАЕМ НОВЫЙ МЕТОД updateManager
      await managerStore.updateManager(editingManager, {
        name: formData.name,
        email: formData.email,
      });

      setFormData({ name: "", email: "", password: "" });
      setEditingManager(null);
    } catch (error) {
      console.error("Ошибка редактирования менеджера:", error);
    }
  };
  const handleAssignRestaurant = async (e: FormEvent) => {
    e.preventDefault();
    if (!assignFormData.managerId || !assignFormData.restaurantId) return;

    try {
      await managerStore.assignRestaurant(
        parseInt(assignFormData.managerId),
        parseInt(assignFormData.restaurantId)
      );
      setAssignFormData({ managerId: "", restaurantId: "" });
      managerStore.loadManagers();
    } catch (error) {
      console.error("Ошибка назначения ресторана:", error);
    }
  };

  const handleBlockManager = async (id: number) => {
    try {
      await managerStore.blockManager(id);
    } catch (error) {
      console.error("Ошибка блокировки менеджера:", error);
    }
  };

  const handleUnblockManager = async (id: number) => {
    try {
      await managerStore.unblockManager(id);
    } catch (error) {
      console.error("Ошибка разблокировки менеджера:", error);
    }
  };

  const handleDeleteManager = async (id: number) => {
    if (window.confirm("Вы уверены, что хотите удалить менеджера?")) {
      try {
        await managerStore.deleteManager(id);
      } catch (error) {
        console.error("Ошибка удаления менеджера:", error);
      }
    }
  };

  const handleFormChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAssignChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAssignFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Обработчик клика на редактирование менеджера
  const handleEditClick = (manager: any) => {
    setEditingManager(manager.id);
    setFormData({
      name: manager.name,
      email: manager.email,
      password: "", // Пароль оставляем пустым для редактирования
    });
  };

  // Отмена редактирования
  const handleCancelEdit = () => {
    setEditingManager(null);
    setFormData({ name: "", email: "", password: "" });
  };

  return (
    <div>
      {/* Форма создания/редактирования менеджера */}
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
              onChange={handleFormChange}
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
              onChange={handleFormChange}
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
              onChange={handleFormChange}
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

        {managerStore.error && (
          <div
            style={{ color: "#dc3545", marginTop: "10px", fontSize: "14px" }}
          >
            {managerStore.error}
          </div>
        )}
      </ManagerForm>

      {/* Таблица менеджеров */}
      <div
        style={{
          background: "white",
          borderRadius: "8px",
          overflow: "hidden",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
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
              {managerStore.managers.length}
            </span>
          </h3>
        </div>

        {managerStore.loading && (
          <div style={{ padding: "40px", textAlign: "center", color: "#666" }}>
            Загрузка менеджеров...
          </div>
        )}

        {managerStore.error && (
          <div
            style={{
              padding: "20px",
              color: "#dc3545",
              background: "#f8d7da",
              margin: "20px",
              borderRadius: "4px",
            }}
          >
            {managerStore.error}
          </div>
        )}

        {!managerStore.loading && managerStore.managers.length > 0 && (
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
              {managerStore.managers.map((manager) => (
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
                        onClick={() => handleEditClick(manager)}
                        title="Редактировать"
                        color="#ffc107"
                      >
                        <Edit size={16} />
                      </IconButton>

                      <IconButton
                        onClick={() =>
                          manager.is_blocked
                            ? handleUnblockManager(manager.id)
                            : handleBlockManager(manager.id)
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
                        onClick={() => handleDeleteManager(manager.id)}
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

        {!managerStore.loading && managerStore.managers.length === 0 && (
          <div style={{ padding: "40px", textAlign: "center", color: "#666" }}>
            <div style={{ fontSize: "48px", marginBottom: "10px" }}>👥</div>
            <h4 style={{ margin: "0 0 10px 0", color: "#333" }}>
              Нет созданных менеджеров
            </h4>
            <p style={{ margin: 0 }}>
              Создайте первого менеджера, используя форму выше
            </p>
          </div>
        )}
      </div>
    </div>
  );
});
