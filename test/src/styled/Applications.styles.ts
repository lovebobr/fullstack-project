import styled from "styled-components";

// CSS переменные для темы
export const theme = {
  // Основные цвета
  bgPrimary: "#f8f9fa",
  bgSecondary: "#ffffff",
  bgDark: "#2d2d2d",
  textPrimary: "#2c3e50",
  textSecondary: "#6c757d",
  textLight: "#ffffff",
  accentColor: "#f4616c",
  accentSecondary: "#9c46ae",
  borderColor: "#eaeaea",
  borderDark: "#444",
  // Цвета статусов
  success: "#52c41a",
  warning: "#ffc107",
  error: "#dc3545",
  info: "#1890ff",
  pending: "#ff9500",
  // Тени
  shadowSm: "0 1px 3px rgba(0,0,0,0.1)",
  shadowMd: "0 4px 20px rgba(0,0,0,0.08)",
  shadowLg: "0 8px 30px rgba(0,0,0,0.12)",
  // Радиусы
  radiusSm: "4px",
  radiusMd: "8px",
  radiusLg: "12px",
  radiusXl: "16px",
  // Отступы
  spacingXs: "4px",
  spacingSm: "8px",
  spacingMd: "16px",
  spacingLg: "24px",
  spacingXl: "32px",
  spacingXxl: "48px",
};

export const ApplicationsContainer = styled.div`
  min-height: 100vh;
  background-color: ${theme.bgPrimary};
  color: ${theme.textPrimary};
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
  overflow-x: hidden; /* Предотвращаем горизонтальную прокрутку */
`;

export const ResponsiveContainer = styled.div`
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  padding: ${theme.spacingLg};
  box-sizing: border-box;

  @media (max-width: 1200px) {
    padding: ${theme.spacingMd};
  }

  @media (max-width: 768px) {
    padding: ${theme.spacingSm};
  }

  @media (max-width: 576px) {
    padding: ${theme.spacingXs};
  }
`;

export const PageHeader = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-start;
  gap: ${theme.spacingMd};
  margin-bottom: ${theme.spacingLg};
  background: white;
  padding: ${theme.spacingLg};
  border-radius: ${theme.radiusLg};
  box-shadow: ${theme.shadowSm};

  @media (max-width: 768px) {
    flex-direction: column;
    padding: ${theme.spacingMd};
  }
`;

export const PageTitle = styled.h1`
  margin: 0 0 ${theme.spacingSm} 0;
  color: ${theme.textPrimary};
  font-size: clamp(1.5rem, 3vw, 1.75rem);
  font-weight: 700;
  line-height: 1.2;
`;

export const PageSubtitle = styled.p`
  margin: 0;
  color: ${theme.textSecondary};
  font-size: clamp(0.875rem, 2vw, 1rem);
  opacity: 0.8;
`;

export const ControlsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${theme.spacingMd};
  margin-bottom: ${theme.spacingLg};
  align-items: center;
  background: white;
  padding: ${theme.spacingMd};
  border-radius: ${theme.radiusLg};
  box-shadow: ${theme.shadowSm};

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const SearchInput = styled.input`
  flex: 1;
  min-width: 200px;
  padding: 12px 16px 12px 44px;
  border: 1px solid ${theme.borderColor};
  border-radius: ${theme.radiusMd};
  font-size: clamp(0.875rem, 2vw, 1rem);
  transition: all 0.2s;
  width: 100%;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: ${theme.accentColor};
    box-shadow: 0 0 0 3px rgba(244, 97, 108, 0.1);
  }

  &::placeholder {
    color: ${theme.textSecondary};
    opacity: 0.7;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const SearchIcon = styled.span`
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: ${theme.textSecondary};
  pointer-events: none;
`;

export const FilterButton = styled.button<{ active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: ${(props) =>
    props.active ? theme.accentColor : theme.bgPrimary};
  border: 1px solid
    ${(props) => (props.active ? theme.accentColor : theme.borderColor)};
  border-radius: ${theme.radiusMd};
  color: ${(props) => (props.active ? theme.textLight : theme.textSecondary)};
  font-size: clamp(0.875rem, 2vw, 1rem);
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  position: relative;
  min-width: 120px;

  &:hover {
    background: ${(props) =>
      props.active ? theme.accentSecondary : "#e9ecef"};
    border-color: ${(props) =>
      props.active ? theme.accentSecondary : "#adb5bd"};
  }

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
`;

export const FilterDropdown = styled.div`
  background: white;
  border: 1px solid ${theme.borderColor};
  border-radius: ${theme.radiusLg};
  padding: ${theme.spacingLg};
  margin-bottom: ${theme.spacingLg};
  box-shadow: ${theme.shadowMd};
  animation: slideDown 0.3s ease;

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 768px) {
    padding: ${theme.spacingMd};
  }
`;

export const FilterSection = styled.div`
  margin-bottom: ${theme.spacingLg};
  padding-bottom: ${theme.spacingLg};
  border-bottom: 1px solid ${theme.borderColor};

  &:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
  }
`;

export const FilterLabel = styled.div`
  font-size: clamp(0.875rem, 2vw, 1rem);
  font-weight: 600;
  color: ${theme.textPrimary};
  margin-bottom: ${theme.spacingSm};
`;

export const FilterCheckbox = styled.button<{ checked?: boolean }>`
  padding: 8px 16px;
  border: 1px solid ${theme.borderColor};
  border-radius: 20px;
  background: ${(props) =>
    props.checked ? props.color || theme.accentColor : "transparent"};
  color: ${(props) => (props.checked ? theme.textLight : theme.textSecondary)};
  font-size: clamp(0.75rem, 1.5vw, 0.875rem);
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;

  &:hover {
    background: ${(props) =>
      props.checked ? theme.accentSecondary : "#e9ecef"};
    border-color: ${(props) =>
      props.checked ? theme.accentSecondary : "#adb5bd"};
  }

  @media (max-width: 768px) {
    padding: 6px 12px;
    font-size: 0.75rem;
  }
`;

export const StatusBadge = styled.span`
  display: inline-block;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: clamp(0.75rem, 1.5vw, 0.875rem);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border: 1px solid;
  white-space: nowrap;
`;

export const ApplicationsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: ${theme.radiusLg};
  overflow: hidden;
  box-shadow: ${theme.shadowSm};
  min-width: 800px; /* Минимальная ширина для корректного отображения на десктопе */

  @media (max-width: 768px) {
    min-width: unset;
    border-radius: ${theme.radiusMd};
  }
`;

export const TableHeader = styled.tr`
  background: #f8f9fa;
  border-bottom: 2px solid #e9ecef;

  th {
    text-align: left;
    padding: ${theme.spacingMd};
    font-weight: 600;
    color: ${theme.textPrimary};
    font-size: clamp(0.75rem, 1.5vw, 0.875rem);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    white-space: nowrap;

    @media (max-width: 768px) {
      padding: ${theme.spacingSm};
    }
  }
`;

export const TableRow = styled.tr<{ clickable?: boolean }>`
  border-bottom: 1px solid ${theme.borderColor};
  transition: background-color 0.2s;
  cursor: ${(props) => (props.clickable ? "pointer" : "default")};

  &:hover {
    background-color: ${(props) =>
      props.clickable ? "#f8f9fa" : "transparent"};
  }

  &:last-child {
    border-bottom: none;
  }
`;

export const TableCell = styled.td`
  padding: ${theme.spacingMd};
  color: ${theme.textSecondary};
  font-size: clamp(0.875rem, 2vw, 1rem);
  vertical-align: top;

  @media (max-width: 768px) {
    padding: ${theme.spacingSm};
  }
`;

export const TableActions = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  align-items: center;
`;

export const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border: 1px solid ${theme.borderColor};
  border-radius: ${theme.radiusSm};
  background: white;
  color: ${theme.textSecondary};
  font-size: clamp(0.75rem, 1.5vw, 0.875rem);
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;

  &:hover:not(:disabled) {
    background: #e9ecef;
    border-color: #adb5bd;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    padding: 6px 8px;
    font-size: 0.75rem;
  }
`;

export const Pagination = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: ${theme.spacingMd};
  margin-top: ${theme.spacingLg};
  padding: ${theme.spacingMd};
  background: white;
  border-radius: ${theme.radiusMd};
  box-shadow: ${theme.shadowSm};

  @media (max-width: 768px) {
    flex-direction: column;
    justify-content: center;
  }
`;

export const PaginationButton = styled.button<{ disabled?: boolean }>`
  padding: 8px 16px;
  border: 1px solid ${theme.borderColor};
  border-radius: ${theme.radiusSm};
  background: transparent;
  color: ${theme.accentColor};
  font-size: clamp(0.875rem, 2vw, 1rem);
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
  transition: all 0.2s;
  min-width: 80px;

  &:hover:not(:disabled) {
    background: ${theme.accentColor};
    color: white;
    border-color: ${theme.accentColor};
  }

  @media (max-width: 768px) {
    padding: 6px 12px;
    min-width: 60px;
  }
`;

export const PaginationInfo = styled.span`
  color: ${theme.textSecondary};
  font-size: clamp(0.875rem, 2vw, 1rem);

  @media (max-width: 768px) {
    text-align: center;
  }
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: ${theme.spacingXl} ${theme.spacingLg};
  background: white;
  border-radius: ${theme.radiusLg};
  border: 2px dashed ${theme.borderColor};
  box-shadow: ${theme.shadowSm};
  margin: ${theme.spacingLg} 0;

  @media (max-width: 768px) {
    padding: ${theme.spacingLg} ${theme.spacingMd};
  }
`;

export const ExportButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: ${theme.accentColor};
  border: none;
  border-radius: ${theme.radiusMd};
  color: white;
  font-size: clamp(0.875rem, 2vw, 1rem);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;

  &:hover:not(:disabled) {
    background: ${theme.accentSecondary};
    transform: translateY(-2px);
    box-shadow: ${theme.shadowMd};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
    padding: 10px 16px;
  }
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${theme.spacingMd};
  margin-bottom: ${theme.spacingLg};

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

export const StatsCard = styled.div`
  background: white;
  padding: ${theme.spacingLg};
  border-radius: ${theme.radiusLg};
  box-shadow: ${theme.shadowSm};
  border-left: 4px solid ${theme.accentColor};

  @media (max-width: 768px) {
    padding: ${theme.spacingMd};
  }
`;

export const Section = styled.div`
  background: white;
  padding: ${theme.spacingLg};
  border-radius: ${theme.radiusLg};
  margin-bottom: ${theme.spacingLg};
  box-shadow: ${theme.shadowSm};

  @media (max-width: 768px) {
    padding: ${theme.spacingMd};
  }
`;

export const SectionTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0 0 ${theme.spacingLg} 0;
  color: ${theme.textPrimary};
  font-size: clamp(1.125rem, 2.5vw, 1.25rem);
  font-weight: 600;

  svg {
    color: ${theme.accentColor};
  }

  @media (max-width: 768px) {
    margin-bottom: ${theme.spacingMd};
  }
`;

// Дополнительные компоненты для резиновой верстки
export const FlexContainer = styled.div<{
  direction?: "row" | "column";
  justify?: string;
  align?: string;
  gap?: string;
  wrap?: string;
}>`
  display: flex;
  flex-direction: ${(props) => props.direction || "row"};
  justify-content: ${(props) => props.justify || "flex-start"};
  align-items: ${(props) => props.align || "stretch"};
  gap: ${(props) => props.gap || theme.spacingMd};
  flex-wrap: ${(props) => props.wrap || "nowrap"};
`;

export const GridContainer = styled.div<{
  columns?: string;
  gap?: string;
}>`
  display: grid;
  grid-template-columns: ${(props) =>
    props.columns || "repeat(auto-fit, minmax(200px, 1fr))"};
  gap: ${(props) => props.gap || theme.spacingMd};
  width: 100%;
`;

// Медиа-запросы для глобальных стилей
export const GlobalStyles = styled.div`
  /* Кастомный скроллбар */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${theme.bgPrimary};
    border-radius: ${theme.radiusSm};
  }

  ::-webkit-scrollbar-thumb {
    background: ${theme.textSecondary};
    border-radius: ${theme.radiusSm};
    opacity: 0.5;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${theme.accentColor};
  }

  /* Отзывчивые изображения */
  img {
    max-width: 100%;
    height: auto;
  }

  /* Отзывчивые таблицы */
  table {
    border-collapse: collapse;
    width: 100%;
  }

  /* Адаптивные кнопки */
  button {
    font-size: clamp(0.875rem, 2vw, 1rem);
  }

  /* Адаптивные заголовки */
  h1 {
    font-size: clamp(1.5rem, 4vw, 2rem);
  }
  h2 {
    font-size: clamp(1.25rem, 3.5vw, 1.75rem);
  }
  h3 {
    font-size: clamp(1.125rem, 3vw, 1.5rem);
  }
  h4 {
    font-size: clamp(1rem, 2.5vw, 1.25rem);
  }
  h5 {
    font-size: clamp(0.875rem, 2vw, 1rem);
  }
  h6 {
    font-size: clamp(0.75rem, 1.5vw, 0.875rem);
  }

  /* Отзывчивые отступы */
  .responsive-padding {
    padding: clamp(1rem, 5vw, 2rem);
  }

  .responsive-margin {
    margin: clamp(1rem, 5vw, 2rem);
  }

  /* Скрытие элементов на мобильных */
  .hide-on-mobile {
    @media (max-width: 768px) {
      display: none !important;
    }
  }

  .show-on-mobile {
    @media (min-width: 769px) {
      display: none !important;
    }
  }

  /* Адаптивные flex-контейнеры */
  .flex-responsive {
    display: flex;
    flex-wrap: wrap;
    gap: clamp(0.5rem, 2vw, 1rem);
  }
`;
