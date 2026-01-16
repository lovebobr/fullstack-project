import React, { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import {
  Filter,
  Calendar,
  User,
  Phone,
  Mail,
  Clock,
  Users,
  CreditCard,
  CheckCircle,
  XCircle,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Trash2,
} from "lucide-react";
import {
  ApplicationsContainer,
  ControlsRow,
  SearchInput,
  FilterButton,
  FilterDropdown,
  FilterSection,
  FilterLabel,
  FilterCheckbox,
  StatusBadge,
  ApplicationsTable,
  TableHeader,
  TableRow,
  TableCell,
  TableActions,
  ActionButton,
  Pagination,
  PaginationButton,
  PaginationInfo,
  EmptyState,
} from "../styled/Applications.styles";
import { applicationsStore } from "../app/store/applications.store";

// Статусы заявок
const STATUS_OPTIONS = [
  { value: "pending", label: "Ожидание оплаты", color: "#ffc107" },
  { value: "confirmed", label: "Подтверждено", color: "#28a745" },
  { value: "canceled", label: "Отменено", color: "#dc3545" },
];

interface FilterState {
  status: string[];
  dateRange: {
    start: string;
    end: string;
  };
  minGuests: number | null;
  maxGuests: number | null;
}

export const ApplicationsPage = observer(() => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    status: [],
    dateRange: { start: "", end: "" },
    minGuests: null,
    maxGuests: null,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  // Загружаем заявки
  useEffect(() => {
    applicationsStore.loadApplications();
  }, []);

  // Фильтрация
  const filteredApplications = applicationsStore.applications.filter((app) => {
    // Поиск
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        app.user_name?.toLowerCase().includes(searchLower) ||
        app.user_email?.toLowerCase().includes(searchLower) ||
        app.user_phone?.toLowerCase().includes(searchLower) ||
        app.restaurant_name?.toLowerCase().includes(searchLower) ||
        app.table_number?.toString().includes(searchTerm) ||
        app.id?.toString().includes(searchTerm);

      if (!matchesSearch) return false;
    }

    // Фильтр по статусу
    if (filters.status.length > 0 && !filters.status.includes(app.status)) {
      return false;
    }

    // Фильтр по дате
    if (filters.dateRange.start && app.date_time) {
      const appDate = new Date(app.date_time);
      const startDate = new Date(filters.dateRange.start);
      if (appDate < startDate) return false;
    }

    if (filters.dateRange.end && app.date_time) {
      const appDate = new Date(app.date_time);
      const endDate = new Date(filters.dateRange.end);
      endDate.setHours(23, 59, 59, 999);
      if (appDate > endDate) return false;
    }

    // Фильтр по гостям
    if (filters.minGuests !== null && app.guests_count < filters.minGuests) {
      return false;
    }
    if (filters.maxGuests !== null && app.guests_count > filters.maxGuests) {
      return false;
    }

    return true;
  });

  // Пагинация
  const totalPages = Math.ceil(filteredApplications.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedApplications = filteredApplications.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusFilter = (status: string) => {
    setFilters((prev) => ({
      ...prev,
      status: prev.status.includes(status)
        ? prev.status.filter((s) => s !== status)
        : [...prev.status, status],
    }));
    setCurrentPage(1);
  };

  const handleDateFilter = (field: "start" | "end", value: string) => {
    setFilters((prev) => ({
      ...prev,
      dateRange: { ...prev.dateRange, [field]: value },
    }));
    setCurrentPage(1);
  };

  const handleGuestsFilter = (
    field: "minGuests" | "maxGuests",
    value: string
  ) => {
    const numValue = value ? parseInt(value) : null;
    setFilters((prev) => ({ ...prev, [field]: numValue }));
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters({
      status: [],
      dateRange: { start: "", end: "" },
      minGuests: null,
      maxGuests: null,
    });
    setSearchTerm("");
    setCurrentPage(1);
  };

  const handleRefresh = () => {
    applicationsStore.loadApplications();
  };

  // ПРОСТАЯ ОТМЕНА БРОНИ
  const handleCancelApplication = async (applicationId: string) => {
    if (window.confirm("Отменить это бронирование?")) {
      await applicationsStore.cancelApplication(applicationId);
    }
  };

  const handleChangeStatus = async (
    applicationId: string,
    newStatus: string
  ) => {
    if (window.confirm(`Изменить статус заявки на "${newStatus}"?`)) {
      await applicationsStore.updateApplicationStatus(applicationId, newStatus);
    }
  };

  const handleDeleteApplication = async (applicationId: string) => {
    if (window.confirm("Удалить эту заявку?")) {
      await applicationsStore.deleteApplication(applicationId);
    }
  };

  const getStatusConfig = (status: string) => {
    return (
      STATUS_OPTIONS.find((opt) => opt.value === status) || {
        value: status,
        label: status,
        color: "#6c757d",
      }
    );
  };

  const toggleRowExpand = (applicationId: string) => {
    setExpandedRow(expandedRow === applicationId ? null : applicationId);
  };

  if (applicationsStore.loading) {
    return (
      <ApplicationsContainer>
        <div style={{ textAlign: "center", padding: "30px 20px" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              border: "3px solid #f3f3f3",
              borderTop: "3px solid #3498db",
              borderRadius: "50%",
              margin: "0 auto 20px",
              animation: "spin 1s linear infinite",
            }}
          />
          <div style={{ fontSize: "16px", color: "#666" }}>
            Загрузка заявок...
          </div>
        </div>
      </ApplicationsContainer>
    );
  }

  return (
    <ApplicationsContainer>
      {/* Управление */}
      <ControlsRow>
        <div style={{ position: "relative", flex: 1 }}>
          <SearchInput
            type="text"
            placeholder="Поиск по ID, имени, email, телефону, ресторану..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <FilterButton onClick={() => setShowFilters(!showFilters)}>
          <Filter size={16} />
          Фильтры
          {(filters.status.length > 0 ||
            filters.dateRange.start ||
            filters.dateRange.end) && (
            <span
              style={{
                position: "absolute",
                top: "-4px",
                right: "-4px",
                width: "12px",
                height: "12px",
                background: "#dc3545",
                borderRadius: "50%",
                border: "2px solid white",
              }}
            />
          )}
        </FilterButton>
        <div>
          <button
            onClick={handleRefresh}
            disabled={applicationsStore.loading}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 16px",
              background: "#f8f9fa",
              border: "1px solid #dee2e6",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "14px",
              color: "#495057",
            }}
          >
            <RefreshCw size={16} />
            Обновить
          </button>
        </div>
      </ControlsRow>

      {/* Фильтры */}
      {showFilters && (
        <FilterDropdown>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
            }}
          >
            <h4 style={{ margin: 0, fontSize: "16px" }}>Фильтры заявок</h4>
            <button
              onClick={handleClearFilters}
              style={{
                padding: "4px 12px",
                background: "transparent",
                border: "1px solid #dc3545",
                color: "#dc3545",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "12px",
              }}
            >
              Очистить все
            </button>
          </div>

          <FilterSection>
            <FilterLabel>Статус заявки</FilterLabel>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {STATUS_OPTIONS.map((status) => (
                <FilterCheckbox
                  key={status.value}
                  checked={filters.status.includes(status.value)}
                  onClick={() => handleStatusFilter(status.value)}
                  style={{
                    background: filters.status.includes(status.value)
                      ? status.color
                      : "#f8f9fa",
                    color: filters.status.includes(status.value)
                      ? "white"
                      : "#495057",
                    borderColor: filters.status.includes(status.value)
                      ? status.color
                      : "#dee2e6",
                  }}
                >
                  {status.label}
                </FilterCheckbox>
              ))}
            </div>
          </FilterSection>

          <FilterSection>
            <FilterLabel>Дата бронирования</FilterLabel>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
              }}
            >
              <div>
                <input
                  type="date"
                  value={filters.dateRange.start}
                  onChange={(e) => handleDateFilter("start", e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px",
                    border: "1px solid #dee2e6",
                    borderRadius: "4px",
                    fontSize: "14px",
                  }}
                />
              </div>
              <div>
                <input
                  type="date"
                  value={filters.dateRange.end}
                  onChange={(e) => handleDateFilter("end", e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px",
                    border: "1px solid #dee2e6",
                    borderRadius: "4px",
                    fontSize: "14px",
                  }}
                />
              </div>
            </div>
          </FilterSection>

          <FilterSection>
            <FilterLabel>Количество гостей</FilterLabel>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
              }}
            >
              <div>
                <input
                  type="number"
                  placeholder="От"
                  value={filters.minGuests || ""}
                  onChange={(e) =>
                    handleGuestsFilter("minGuests", e.target.value)
                  }
                  min="1"
                  style={{
                    width: "100%",
                    padding: "8px",
                    border: "1px solid #dee2e6",
                    borderRadius: "4px",
                    fontSize: "14px",
                  }}
                />
              </div>
              <div>
                <input
                  type="number"
                  placeholder="До"
                  value={filters.maxGuests || ""}
                  onChange={(e) =>
                    handleGuestsFilter("maxGuests", e.target.value)
                  }
                  min="1"
                  style={{
                    width: "100%",
                    padding: "8px",
                    border: "1px solid #dee2e6",
                    borderRadius: "4px",
                    fontSize: "14px",
                  }}
                />
              </div>
            </div>
          </FilterSection>
        </FilterDropdown>
      )}

      {/* Сообщение об ошибке */}
      {applicationsStore.error && (
        <div
          style={{
            padding: "15px",
            margin: "0 0 20px 0",
            background: "#f8d7da",
            color: "#dc3545",
            borderRadius: "4px",
            border: "1px solid #f5c6cb",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>{applicationsStore.error}</span>
            <button
              onClick={() => applicationsStore.clearError()}
              style={{
                background: "none",
                border: "none",
                color: "#dc3545",
                cursor: "pointer",
                fontSize: "18px",
              }}
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Таблица */}
      {filteredApplications.length > 0 ? (
        <>
          <div
            style={{ marginBottom: "10px", color: "#666", fontSize: "14px" }}
          >
            Найдено заявок: {filteredApplications.length}
          </div>

          <ApplicationsTable>
            <thead>
              <TableHeader>
                <TableCell style={{ width: "80px" }}>ID</TableCell>
                <TableCell>Клиент</TableCell>
                <TableCell>Ресторан / Стол</TableCell>
                <TableCell>Дата и время</TableCell>
                <TableCell>Гости / Сумма</TableCell>
                <TableCell>Статус</TableCell>
                <TableCell style={{ width: "120px" }}>Действия</TableCell>
              </TableHeader>
            </thead>
            <tbody>
              {paginatedApplications.map((app) => {
                const statusConfig = getStatusConfig(app.status);
                const isExpanded = expandedRow === app.id;

                return (
                  <React.Fragment key={app.id}>
                    <TableRow clickable onClick={() => toggleRowExpand(app.id)}>
                      <TableCell
                        style={{ fontWeight: "bold", color: "#007bff" }}
                      >
                        #{app.id}
                      </TableCell>
                      <TableCell>
                        <div style={{ fontWeight: "500", marginBottom: "4px" }}>
                          {app.user_name}
                        </div>
                        <div style={{ fontSize: "12px", color: "#666" }}>
                          {app.user_email}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div style={{ fontWeight: "500", marginBottom: "4px" }}>
                          {app.restaurant_name}
                        </div>
                        <div style={{ fontSize: "12px", color: "#666" }}>
                          Стол №{app.table_number}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div style={{ fontWeight: "500" }}>
                          {new Date(app.date_time).toLocaleDateString("ru-RU")}
                        </div>
                        <div style={{ fontSize: "12px", color: "#666" }}>
                          {new Date(app.date_time).toLocaleTimeString("ru-RU", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <Users size={14} />
                          <span>{app.guests_count}</span>
                          <span style={{ color: "#adb5bd" }}>•</span>
                          <CreditCard size={14} />
                          <span>{app.price} ₽</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <StatusBadge
                          style={{
                            background: `${statusConfig.color}20`,
                            color: statusConfig.color,
                            border: `1px solid ${statusConfig.color}`,
                          }}
                        >
                          {statusConfig.label}
                        </StatusBadge>
                      </TableCell>
                      <TableCell>
                        <TableActions>
                          {isExpanded ? (
                            <ChevronUp size={16} />
                          ) : (
                            <ChevronDown size={16} />
                          )}
                        </TableActions>
                      </TableCell>
                    </TableRow>

                    {isExpanded && (
                      <tr>
                        <td colSpan={7}>
                          <div
                            style={{
                              padding: "20px",
                              background: "#f8f9fa",
                              borderTop: "1px solid #e9ecef",
                              borderBottom: "1px solid #e9ecef",
                            }}
                          >
                            <div
                              style={{
                                display: "grid",
                                gridTemplateColumns:
                                  "repeat(auto-fit, minmax(250px, 1fr))",
                                gap: "20px",
                                marginBottom: "20px",
                              }}
                            >
                              <div>
                                <h4
                                  style={{
                                    margin: "0 0 12px 0",
                                    fontSize: "14px",
                                    color: "#666",
                                  }}
                                >
                                  Контактная информация
                                </h4>
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "8px",
                                  }}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "8px",
                                    }}
                                  >
                                    <User size={14} />
                                    <span>{app.user_name}</span>
                                  </div>
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "8px",
                                    }}
                                  >
                                    <Mail size={14} />
                                    <span>{app.user_email}</span>
                                  </div>
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "8px",
                                    }}
                                  >
                                    <Phone size={14} />
                                    <span>{app.user_phone}</span>
                                  </div>
                                </div>
                              </div>

                              <div>
                                <h4
                                  style={{
                                    margin: "0 0 12px 0",
                                    fontSize: "14px",
                                    color: "#666",
                                  }}
                                >
                                  Детали брони
                                </h4>
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "8px",
                                  }}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "8px",
                                    }}
                                  >
                                    <Clock size={14} />
                                    <span>Длительность: {app.duration} ч</span>
                                  </div>
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "8px",
                                    }}
                                  >
                                    <Users size={14} />
                                    <span>Гостей: {app.guests_count}</span>
                                  </div>
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "8px",
                                    }}
                                  >
                                    <CreditCard size={14} />
                                    <span>Сумма: {app.price} ₽</span>
                                  </div>
                                </div>
                              </div>

                              {app.special_requests && (
                                <div>
                                  <h4
                                    style={{
                                      margin: "0 0 12px 0",
                                      fontSize: "14px",
                                      color: "#666",
                                    }}
                                  >
                                    Особые пожелания
                                  </h4>
                                  <div
                                    style={{
                                      padding: "12px",
                                      background: "white",
                                      borderRadius: "6px",
                                      border: "1px solid #dee2e6",
                                      fontSize: "14px",
                                    }}
                                  >
                                    {app.special_requests}
                                  </div>
                                </div>
                              )}

                              {app.foods && app.foods.length > 0 && (
                                <div>
                                  <h4
                                    style={{
                                      margin: "0 0 12px 0",
                                      fontSize: "14px",
                                      color: "#666",
                                    }}
                                  >
                                    Заказанная еда ({app.foods.length})
                                  </h4>
                                  <div
                                    style={{
                                      padding: "12px",
                                      background: "white",
                                      borderRadius: "6px",
                                      border: "1px solid #dee2e6",
                                    }}
                                  >
                                    {app.foods.map(
                                      (food: any, index: number) => (
                                        <div
                                          key={food.id || index}
                                          style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            padding: "4px 0",
                                            borderBottom:
                                              index < app.foods!.length - 1
                                                ? "1px solid #f0f0f0"
                                                : "none",
                                          }}
                                        >
                                          <span>{food.name}</span>
                                          <span>
                                            {food.quantity || 1} × {food.price}{" "}
                                            ₽
                                          </span>
                                        </div>
                                      )
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>

                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              <div style={{ fontSize: "12px", color: "#666" }}>
                                Создано:{" "}
                                {new Date(app.created_at).toLocaleString(
                                  "ru-RU"
                                )}
                              </div>
                              <div style={{ display: "flex", gap: "8px" }}>
                                {app.status === "pending" && (
                                  <ActionButton
                                    onClick={() =>
                                      handleChangeStatus(app.id, "confirmed")
                                    }
                                    style={{
                                      background: "#28a745",
                                      color: "white",
                                      border: "none",
                                    }}
                                  >
                                    <CheckCircle size={14} />
                                    Подтвердить
                                  </ActionButton>
                                )}

                                {/* КНОПКА ОТМЕНЫ - ВСЕГДА ДОСТУПНА */}
                                {app.status !== "canceled" && (
                                  <ActionButton
                                    onClick={() =>
                                      handleCancelApplication(app.id)
                                    }
                                    style={{
                                      background: "#dc3545",
                                      color: "white",
                                      border: "none",
                                    }}
                                  >
                                    <XCircle size={14} />
                                    Отменить
                                  </ActionButton>
                                )}

                                <ActionButton
                                  onClick={() =>
                                    handleDeleteApplication(app.id)
                                  }
                                  style={{
                                    background: "#6c757d",
                                    color: "white",
                                    border: "none",
                                  }}
                                >
                                  <Trash2 size={14} />
                                  Удалить
                                </ActionButton>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </ApplicationsTable>

          {/* Пагинация */}
          <Pagination>
            <PaginationInfo>
              Показано {startIndex + 1}-
              {Math.min(startIndex + itemsPerPage, filteredApplications.length)}{" "}
              из {filteredApplications.length}
            </PaginationInfo>
            <div style={{ display: "flex", gap: "8px" }}>
              <PaginationButton
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
              >
                Назад
              </PaginationButton>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <PaginationButton
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    style={{
                      background:
                        currentPage === pageNum ? "#007bff" : "transparent",
                      color: currentPage === pageNum ? "white" : "#007bff",
                    }}
                  >
                    {pageNum}
                  </PaginationButton>
                );
              })}
              <PaginationButton
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                Вперед
              </PaginationButton>
            </div>
          </Pagination>
        </>
      ) : (
        <EmptyState>
          <Calendar
            size={48}
            style={{ marginBottom: "16px", color: "#adb5bd" }}
          />
          <div
            style={{ fontSize: "18px", fontWeight: "500", marginBottom: "8px" }}
          >
            Заявки не найдены
          </div>
          <div style={{ color: "#6c757d", marginBottom: "20px" }}>
            Попробуйте изменить параметры поиска или фильтры
          </div>
          <button
            onClick={handleClearFilters}
            style={{
              padding: "10px 20px",
              background: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            Сбросить фильтры
          </button>
        </EmptyState>
      )}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </ApplicationsContainer>
  );
});

export default ApplicationsPage;
