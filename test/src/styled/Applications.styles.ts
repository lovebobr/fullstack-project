// styled/Applications.styles.ts
import styled from "styled-components";

export const ApplicationsContainer = styled.div`
  padding: 2rem;
  background: #f8f9fa;
  min-height: 100vh;
`;

export const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
`;

export const PageTitle = styled.h1`
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
  font-size: 28px;
  font-weight: 700;
`;

export const PageSubtitle = styled.p`
  margin: 0;
  color: #6c757d;
  font-size: 15px;
`;

export const ControlsRow = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  align-items: center;
  background: white;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
`;

export const SearchInput = styled.input`
  flex: 1;
  padding: 10px 16px;
  padding-right: 40px;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
  }
`;

export const FilterButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  color: #495057;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;

  &:hover {
    background: #e9ecef;
    border-color: #adb5bd;
  }
`;

export const FilterDropdown = styled.div`
  background: white;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

export const FilterSection = styled.div`
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e9ecef;

  &:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
  }
`;

export const FilterLabel = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #495057;
  margin-bottom: 0.75rem;
`;

export const FilterCheckbox = styled.button<{ checked?: boolean }>`
  padding: 6px 12px;
  border: 1px solid #dee2e6;
  border-radius: 20px;
  background: ${(props) => (props.checked ? "#007bff" : "transparent")};
  color: ${(props) => (props.checked ? "white" : "#495057")};
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${(props) => (props.checked ? "#0056b3" : "#e9ecef")};
    border-color: ${(props) => (props.checked ? "#0056b3" : "#adb5bd")};
  }
`;

export const StatusBadge = styled.span`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border: 1px solid;
`;

export const ApplicationsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
`;

export const TableHeader = styled.tr`
  background: #f8f9fa;
  border-bottom: 2px solid #e9ecef;

  th {
    text-align: left;
    padding: 1rem;
    font-weight: 600;
    color: #495057;
    font-size: 14px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
`;

export const TableRow = styled.tr<{ clickable?: boolean }>`
  border-bottom: 1px solid #e9ecef;
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
  padding: 1rem;
  color: #495057;
  font-size: 14px;
`;

export const TableActions = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
`;

// ДОБАВЛЯЕМ НЕДОСТАЮЩИЙ ActionButton
export const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  background: white;
  color: #495057;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #e9ecef;
    border-color: #adb5bd;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const Pagination = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1.5rem;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
`;

export const PaginationButton = styled.button<{ disabled?: boolean }>`
  padding: 8px 16px;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  background: transparent;
  color: #007bff;
  font-size: 14px;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: #007bff;
    color: white;
    border-color: #007bff;
  }
`;

export const PaginationInfo = styled.span`
  color: #6c757d;
  font-size: 14px;
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 12px;
  border: 2px dashed #dee2e6;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
`;

export const ExportButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: #28a745;
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #218838;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

export const StatsCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border-left: 4px solid #007bff;
`;

export const Section = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
`;

export const SectionTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0;
  color: #2c3e50;
  font-size: 18px;
  font-weight: 600;

  svg {
    color: #f4616c;
  }
`;