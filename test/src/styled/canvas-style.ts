// styled/canvas-style.ts
import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  gap: 20px;
  padding: 20px;
  background-color: #2d2d2d;
  border-radius: 10px;
  min-height: 800px;
`;

export const Sidebar = styled.div`
  width: 250px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  background-color: #333;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #444;
`;

export const CanvasWrapper = styled.div`
  background-color: #1a1a1a;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #444;
`;

export const ControlSection = styled.div`
  background-color: #3a3a3a;
  padding: 15px;
  border-radius: 6px;
  border: 1px solid #444;
`;

export const Button = styled.button`
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

export const TableItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 10px;
  background-color: #444;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid #555;

  &:hover {
    background-color: #555;
    border-color: #007bff;
    transform: translateY(-2px);
  }

  img {
    width: 60px;
    height: 60px;
    object-fit: cover;
    border-radius: 4px;
  }

  span {
    font-size: 12px;
    text-align: center;
    max-width: 100%;
    word-break: break-word;
  }
`;
