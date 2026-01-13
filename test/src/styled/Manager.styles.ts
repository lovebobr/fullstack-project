import styled from "styled-components";

// Формы для менеджеров
export const ManagerForm = styled.form`
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  margin-bottom: 24px;
  border: 1px solid #eaeaea;
  max-width: 100%;
  box-sizing: border-box;
`;

export const AssignForm = styled.form`
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  margin-bottom: 30px;
  border: 1px solid #eaeaea;
  max-width: 100%;
  box-sizing: border-box;
`;

export const FormGrid = styled.div<{ columns?: number }>`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  margin-bottom: 20px;
  width: 100%;

  @media (min-width: 768px) {
    grid-template-columns: ${(props) => `repeat(${props.columns || 2}, 1fr)`};
  }
`;

export const FormInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s;
  background: #fafbfc;
  box-sizing: border-box;

  /* Убираем автозаполнение */
  &:-webkit-autofill,
  &:-webkit-autofill:hover,
  &:-webkit-autofill:focus,
  &:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0 30px #fafbfc inset !important;
    -webkit-text-fill-color: #333 !important;
    transition: background-color 5000s ease-in-out 0s;
  }

  &:focus {
    outline: none;
    border-color: #f4616c;
    box-shadow: 0 0 0 3px rgba(244, 97, 108, 0.1);
    background: white;

    &:-webkit-autofill {
      -webkit-box-shadow: 0 0 0 30px white inset !important;
      -webkit-text-fill-color: #333 !important;
    }
  }

  &::placeholder {
    color: #999;
  }
`;

export const FormSelect = styled.select`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s;
  background: #fafbfc;
  cursor: pointer;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #f4616c;
    box-shadow: 0 0 0 3px rgba(244, 97, 108, 0.1);
    background: white;
  }
`;

export const FormButton = styled.button`
  padding: 12px 24px;
  background-color: #f4616c;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: fit-content;
  box-sizing: border-box;
  min-width: 120px;

  &:hover:not(:disabled) {
    background-color: #e05560;
    transform: translateY(-1px);
  }

  &:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

// Таблица менеджеров
export const ManagerTable = styled.table`
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
    padding: 16px;
    text-align: left;
  }
`;

export const TableRow = styled.tr`
  border-bottom: 1px solid #f0f0f0;
  transition: all 0.2s;

  &:hover {
    background-color: #fafafa;
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

export const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  div {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: #666;
  }
`;

export const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;

  h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: #2c3e50;
  }
`;

export const AssignFormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  width: 100%;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr auto;
    align-items: end;
  }
`;
