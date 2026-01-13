import styled from "styled-components";

// Основной лейаут админ панели
export const AdminLayout = styled.div`
  display: flex;
  background-color: #f8f9fa;
`;

export const Sidebar = styled.div`
  width: 280px;
  background: linear-gradient(135deg, #f4616c 0%, #9c46ae 100%);
  color: white;
  position: fixed;
  height: 100vh;
  left: 0;
  top: 0;
  overflow-y: auto;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
`;

export const SidebarHeader = styled.div`
  padding: 25px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  margin-bottom: 10px;

  h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: white;
  }
`;

export const SidebarItem = styled.div<{ active?: boolean }>`
  display: flex;
  align-items: center;
  padding: 16px 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${(props) =>
    props.active ? "rgba(255, 255, 255, 0.15)" : "transparent"};
  border-left: 4px solid ${(props) => (props.active ? "white" : "transparent")};
  margin: 4px 10px;
  border-radius: 8px;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateX(2px);
  }

  span {
    font-size: 15px;
    font-weight: ${(props) => (props.active ? "600" : "400")};
    color: white;
  }
`;

export const SidebarIcon = styled.span`
  margin-right: 15px;
  width: 24px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const MainContent = styled.div`
  margin-left: 280px;
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

export const ContentHeader = styled.div`
  background: white;
  padding: 20px 30px;
  border-bottom: 1px solid #eaeaea;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

  h1 {
    margin: 0;
    font-size: 24px;
    font-weight: 700;
    color: #2c3e50;
  }
`;

export const ContentBody = styled.div`
  flex: 1;
  padding: 30px;
  background-color: #f8f9fa;
  overflow-y: auto;
`;

// Статистика для главной страницы
export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 30px;
`;

export const StatCard = styled.div`
  background: white;
  padding: 25px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #eaeaea;
  transition: all 0.3s ease;

  // &:hover {
  //   transform: translateY(-4px);
  //   box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  // }
`;

export const StatValue = styled.div`
  font-size: 36px;
  font-weight: 800;
  color: #2c3e50;
  margin-bottom: 8px;
  line-height: 1;
`;

export const StatLabel = styled.div`
  font-size: 14px;
  color: #666;
  font-weight: 500;
  margin-bottom: 8px;
`;

export const StatIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
`;

export const UserProfile = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  border-radius: 8px;
  background: #f8f9fa;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #e9ecef;
  }
`;

export const RestaurantForm = styled.form`
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  margin-bottom: 30px;
  border: 1px solid #eaeaea;
`;

export const FormInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s;
  background: #fafbfc;

  &:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
    background: white;
  }

  &::placeholder {
    color: #999;
  }
`;

export const FormTextarea = styled.textarea`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  resize: vertical;
  transition: all 0.2s;
  background: #fafbfc;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
    background: white;
  }

  &::placeholder {
    color: #999;
  }
`;

export const FormButton = styled.button<{
  variant?: "primary" | "secondary" | "danger";
}>`
  padding: 12px 24px;
  background-color: ${(props) => {
    switch (props.variant) {
      case "secondary":
        return "#6c757d";
      case "danger":
        return "#dc3545";
      default:
        return "#3498db";
    }
  }};
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 8px;

  &:hover:not(:disabled) {
    background-color: ${(props) => {
      switch (props.variant) {
        case "secondary":
          return "#5a6268";
        case "danger":
          return "#c82333";
        default:
          return "#2980b9";
      }
    }};
    transform: translateY(-1px);
  }

  &:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

// Таблица ресторанов
export const RestaurantTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
  background: white;
`;

export const TableHeader = styled.tr`
  background-color: #f8f9fa;
  border-bottom: 2px solid #eaeaea;

  th {
    font-weight: 600;
    color: #2c3e50;
  }
`;

export const TableRow = styled.tr`
  border-bottom: 1px solid #f0f0f0;
  transition: all 0.2s;

  &:hover {
    background-color: #f8f9fa;
    transform: scale(1.01);
  }

  &:last-child {
    border-bottom: none;
  }
`;

export const TableCell = styled.td`
  padding: 16px;
  text-align: left;
  vertical-align: middle;

  &:first-child {
    padding-left: 25px;
  }

  &:last-child {
    padding-right: 25px;
  }
`;

export const TableActions = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
`;

export const IconButton = styled.button<{ color?: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 8px;
  background-color: ${(props) =>
    props.color ? `${props.color}15` : "#f8f9fa"};
  color: ${(props) => props.color || "#6c757d"};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: ${(props) => (props.color ? props.color : "#e9ecef")};
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const StatusBadge = styled.span<{ active: boolean }>`
  display: inline-block;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  background-color: ${(props) => (props.active ? "#d4edda" : "#f8d7da")};
  color: ${(props) => (props.active ? "#155724" : "#721c24")};
  border: 1px solid ${(props) => (props.active ? "#c3e6cb" : "#f5c6cb")};
`;

export const SectionTitle = styled.h2`
  font-size: 22px;
  font-weight: 700;
  color: #2c3e50;
  margin: 0 0 20px 0;
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const LoadingState = styled.div`
  padding: 60px 20px;
  text-align: center;
  color: #666;
  font-size: 16px;
`;

export const ErrorState = styled.div`
  padding: 20px;
  color: #dc3545;
  background: #f8d7da;
  margin: 20px;
  border-radius: 8px;
  border: 1px solid #f5c6cb;
  font-size: 14px;
`;

export const EmptyState = styled.div`
  padding: 60px 20px;
  text-align: center;
  color: #666;

  h4 {
    margin: 0 0 10px 0;
    color: #333;
    font-size: 18px;
  }

  p {
    margin: 0;
    font-size: 14px;
  }
`;
