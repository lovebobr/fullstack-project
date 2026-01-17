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
  Search,
  Download,
} from "lucide-react";
import {
  ApplicationsContainer,
  PageHeader,
  PageTitle,
  PageSubtitle,
  ControlsRow,
  SearchInput,
  SearchIcon,
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
  ExportButton,
  StatsGrid,
  StatsCard,
  Section,
  SectionTitle,
  ResponsiveContainer,
  FlexContainer,
  GridContainer,
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
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Определяем мобильное устройство
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Адаптивное количество элементов на странице
  useEffect(() => {
    setItemsPerPage(isMobile ? 10 : 20);
  }, [isMobile]);

  // Загружаем заявки
  useEffect(() => {
    applicationsStore.loadApplications();
  }, []);

  // Статистика
  const stats = {
    total: applicationsStore.applications.length,
    pending: applicationsStore.applications.filter(
      (app) => app.status === "pending"
    ).length,
    confirmed: applicationsStore.applications.filter(
      (app) => app.status === "confirmed"
    ).length,
    canceled: applicationsStore.applications.filter(
      (app) => app.status === "canceled"
    ).length,
  };

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

  // Обработчики
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

  const handleExport = () => {
    // Временная заглушка для экспорта
    alert("Экспорт данных в разработке...");
  };

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

  // Компактный вид для мобильных
  const renderCompactRow = (app: any) => {
    const statusConfig = getStatusConfig(app.status);
    const isExpanded = expandedRow === app.id;

    return (
      <div
        key={app.id}
        style={{
          background: "white",
          borderRadius: "12px",
          marginBottom: "12px",
          border: "1px solid #eaeaea",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "16px",
            cursor: "pointer",
            borderBottom: isExpanded ? "1px solid #eaeaea" : "none",
          }}
          onClick={() => toggleRowExpand(app.id)}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "8px",
            }}
          >
            <span style={{ fontWeight: "bold", color: "#007bff" }}>
              #{app.id}
            </span>
            <StatusBadge
              style={{
                background: `${statusConfig.color}20`,
                color: statusConfig.color,
                border: `1px solid ${statusConfig.color}`,
                fontSize: "11px",
                padding: "3px 8px",
              }}
            >
              {statusConfig.label}
            </StatusBadge>
          </div>

          <div
            style={{ fontSize: "14px", fontWeight: "500", marginBottom: "4px" }}
          >
            {app.user_name}
          </div>

          <div style={{ fontSize: "12px", color: "#666", marginBottom: "8px" }}>
            {app.restaurant_name} • Стол №{app.table_number}
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ fontSize: "12px", color: "#666" }}>
              {new Date(app.date_time).toLocaleDateString("ru-RU")}
            </div>
            <div style={{ fontSize: "12px", fontWeight: "500" }}>
              {app.guests_count} гостей • {app.price} ₽
            </div>
          </div>
        </div>

        {isExpanded && (
          <div style={{ padding: "16px", background: "#f8f9fa" }}>
            <div style={{ marginBottom: "16px" }}>
              <div
                style={{ fontSize: "12px", color: "#666", marginBottom: "4px" }}
              >
                Контактная информация
              </div>
              <div
                style={{ display: "flex", flexDirection: "column", gap: "6px" }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "14px",
                  }}
                >
                  <Phone size={12} />
                  <span>{app.user_phone}</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "14px",
                  }}
                >
                  <Mail size={12} />
                  <span>{app.user_email}</span>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <div
                style={{ fontSize: "12px", color: "#666", marginBottom: "4px" }}
              >
                Детали брони
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "12px",
                }}
              >
                <div>
                  <div style={{ fontSize: "11px", color: "#999" }}>
                    Длительность
                  </div>
                  <div style={{ fontSize: "14px" }}>{app.duration} ч</div>
                </div>
                <div>
                  <div style={{ fontSize: "11px", color: "#999" }}>Гостей</div>
                  <div style={{ fontSize: "14px" }}>{app.guests_count}</div>
                </div>
              </div>
            </div>

            {app.special_requests && (
              <div style={{ marginBottom: "16px" }}>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#666",
                    marginBottom: "4px",
                  }}
                >
                  Особые пожелания
                </div>
                <div
                  style={{
                    padding: "8px",
                    background: "white",
                    borderRadius: "6px",
                    border: "1px solid #eaeaea",
                    fontSize: "13px",
                  }}
                >
                  {app.special_requests}
                </div>
              </div>
            )}

            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {app.status === "pending" && (
                <ActionButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handleChangeStatus(app.id, "confirmed");
                  }}
                  style={{
                    background: "#28a745",
                    color: "white",
                    border: "none",
                    flex: 1,
                    justifyContent: "center",
                  }}
                >
                  <CheckCircle size={14} />
                  Подтвердить
                </ActionButton>
              )}

              {app.status !== "canceled" && (
                <ActionButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCancelApplication(app.id);
                  }}
                  style={{
                    background: "#dc3545",
                    color: "white",
                    border: "none",
                    flex: 1,
                    justifyContent: "center",
                  }}
                >
                  <XCircle size={14} />
                  Отменить
                </ActionButton>
              )}

              <ActionButton
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteApplication(app.id);
                }}
                style={{
                  background: "#6c757d",
                  color: "white",
                  border: "none",
                  flex: 1,
                  justifyContent: "center",
                }}
              >
                <Trash2 size={14} />
                Удалить
              </ActionButton>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (applicationsStore.loading) {
    return (
      <ApplicationsContainer>
        <ResponsiveContainer>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "400px",
            }}
          >
            <div style={{ textAlign: "center" }}>
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
          </div>
        </ResponsiveContainer>
      </ApplicationsContainer>
    );
  }

  return (
    <ApplicationsContainer>
      <ResponsiveContainer>
        {/* Управление */}
        <ControlsRow>
          <div style={{ position: "relative", flex: 1 }}>
            <SearchIcon>
              <Search size={16} />
            </SearchIcon>
            <SearchInput
              type="text"
              placeholder="Поиск по ID, имени, email, телефону, ресторану..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          <FlexContainer gap="8px">
            <FilterButton
              onClick={() => setShowFilters(!showFilters)}
              active={
                showFilters ||
                filters.status.length > 0 ||
                filters.dateRange.start ||
                filters.dateRange.end
              }
            >
              <Filter size={16} />
              Фильтры
            </FilterButton>

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
                whiteSpace: "nowrap",
              }}
            >
              <RefreshCw size={16} />
              {isMobile ? "Обновить" : "Обновить список"}
            </button>
          </FlexContainer>
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
              <FlexContainer wrap="wrap" gap="8px">
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
              </FlexContainer>
            </FilterSection>

            <FilterSection>
              <FilterLabel>Дата бронирования</FilterLabel>
              <GridContainer columns={isMobile ? "1fr" : "1fr 1fr"} gap="12px">
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
              </GridContainer>
            </FilterSection>

            <FilterSection>
              <FilterLabel>Количество гостей</FilterLabel>
              <GridContainer columns={isMobile ? "1fr" : "1fr 1fr"} gap="12px">
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
              </GridContainer>
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

        {/* Содержимое */}
        {filteredApplications.length > 0 ? (
          <>
            <Section>
              <SectionTitle>
                <Calendar size={18} />
                Список заявок
                <span
                  style={{
                    marginLeft: "8px",
                    fontSize: "14px",
                    fontWeight: "normal",
                    color: "#666",
                  }}
                >
                  ({filteredApplications.length})
                </span>
              </SectionTitle>

              {/* Для мобильных - компактный вид */}
              {isMobile ? (
                <div>
                  {paginatedApplications.map((app) => renderCompactRow(app))}
                </div>
              ) : (
                /* Для десктопа - таблица */
                <div style={{ overflowX: "auto" }}>
                  <ApplicationsTable>
                    <thead>
                      <TableHeader>
                        <TableCell style={{ width: "80px" }}>ID</TableCell>
                        <TableCell>Клиент</TableCell>
                        <TableCell>Ресторан / Стол</TableCell>
                        <TableCell>Дата и время</TableCell>
                        <TableCell>Гости / Сумма</TableCell>
                        <TableCell>Статус</TableCell>
                        <TableCell style={{ width: "120px" }}>
                          Действия
                        </TableCell>
                      </TableHeader>
                    </thead>
                    <tbody>
                      {paginatedApplications.map((app) => {
                        const statusConfig = getStatusConfig(app.status);
                        const isExpanded = expandedRow === app.id;

                        return (
                          <React.Fragment key={app.id}>
                            <TableRow
                              clickable
                              onClick={() => toggleRowExpand(app.id)}
                            >
                              <TableCell
                                style={{ fontWeight: "bold", color: "#007bff" }}
                              >
                                #{app.id}
                              </TableCell>
                              <TableCell>
                                <div
                                  style={{
                                    fontWeight: "500",
                                    marginBottom: "4px",
                                  }}
                                >
                                  {app.user_name}
                                </div>
                                <div
                                  style={{ fontSize: "12px", color: "#666" }}
                                >
                                  {app.user_email}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div
                                  style={{
                                    fontWeight: "500",
                                    marginBottom: "4px",
                                  }}
                                >
                                  {app.restaurant_name}
                                </div>
                                <div
                                  style={{ fontSize: "12px", color: "#666" }}
                                >
                                  Стол №{app.table_number}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div style={{ fontWeight: "500" }}>
                                  {new Date(app.date_time).toLocaleDateString(
                                    "ru-RU"
                                  )}
                                </div>
                                <div
                                  style={{ fontSize: "12px", color: "#666" }}
                                >
                                  {new Date(app.date_time).toLocaleTimeString(
                                    "ru-RU",
                                    {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    }
                                  )}
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
                                      {/* Детали заявки (как в оригинале) */}
                                      {/* ... */}
                                    </div>

                                    <div
                                      style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                      }}
                                    >
                                      <div
                                        style={{
                                          fontSize: "12px",
                                          color: "#666",
                                        }}
                                      >
                                        Создано:{" "}
                                        {new Date(
                                          app.created_at
                                        ).toLocaleString("ru-RU")}
                                      </div>
                                      <div
                                        style={{ display: "flex", gap: "8px" }}
                                      >
                                        {app.status === "pending" && (
                                          <ActionButton
                                            onClick={() =>
                                              handleChangeStatus(
                                                app.id,
                                                "confirmed"
                                              )
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
                </div>
              )}

              {/* Пагинация */}
              <Pagination>
                <PaginationInfo>
                  Показано {startIndex + 1}-
                  {Math.min(
                    startIndex + itemsPerPage,
                    filteredApplications.length
                  )}{" "}
                  из {filteredApplications.length}
                </PaginationInfo>
                <FlexContainer gap="8px">
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
                </FlexContainer>
              </Pagination>
            </Section>
          </>
        ) : (
          <EmptyState>
            <Calendar
              size={48}
              style={{ marginBottom: "16px", color: "#adb5bd" }}
            />
            <div
              style={{
                fontSize: "18px",
                fontWeight: "500",
                marginBottom: "8px",
              }}
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
      </ResponsiveContainer>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        /* Скрываем скроллбар для таблицы на мобильных */
        @media (max-width: 768px) {
          .table-container {
            -webkit-overflow-scrolling: touch;
          }
        }
      `}</style>
    </ApplicationsContainer>
  );
});

export default ApplicationsPage;
