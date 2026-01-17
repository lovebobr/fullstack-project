// components/common/Modal.tsx
import React, { useEffect, useRef } from "react";
import styled, { keyframes } from "styled-components";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: "info" | "warning" | "danger";
}

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translate(-50%, -60%);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%);
  }
`;

const ModalOverlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: ${(props) => (props.isOpen ? "flex" : "none")};
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: ${fadeIn} 0.2s ease-out;
`;

const ModalContent = styled.div`
  background-color: #1a1a1a;
  border-radius: 12px;
  padding: 2rem;
  max-width: 500px;
  width: 90%;
  border: 1px solid #333;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: ${slideIn} 0.3s ease-out;
`;

const ModalHeader = styled.div`
  margin-bottom: 1.5rem;
`;

const ModalTitle = styled.h3<{ type?: "info" | "warning" | "danger" }>`
  color: ${(props) => {
    switch (props.type) {
      case "warning":
        return "#ff9500";
      case "danger":
        return "#dc3545";
      default:
        return "#fff";
    }
  }};
  margin: 0;
  font-size: 1.4rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const ModalMessage = styled.p`
  color: #ddd;
  margin: 0 0 2rem 0;
  font-size: 1.1rem;
  line-height: 1.5;
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
`;

const Button = styled.button<{ variant?: "primary" | "danger" | "secondary" }>`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: "Isadora Cyr", system-ui, Avenir, Helvetica, Arial, sans-serif;

  ${(props) => {
    switch (props.variant) {
      case "primary":
        return `
          background-color: #007bff;
          color: white;
          &:hover {
            background-color: #0056b3;
          }
        `;
      case "danger":
        return `
          background-color: #dc3545;
          color: white;
          &:hover {
            background-color: #b02a37;
          }
        `;
      case "secondary":
      default:
        return `
          background-color: #495057;
          color: white;
          &:hover {
            background-color: #343a40;
          }
        `;
    }
  }}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const WarningIcon = styled.span`
  font-size: 1.5rem;
  color: #ff9500;
`;

const DangerIcon = styled.span`
  font-size: 1.5rem;
  color: #dc3545;
`;

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Подтверждение действия",
  message,
  confirmText = "Подтвердить",
  cancelText = "Отмена",
  type = "info",
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  const getTitle = () => {
    if (type === "warning") return "Внимание!";
    if (type === "danger") return "Опасное действие!";
    return title;
  };

  const getIcon = () => {
    if (type === "warning") return <WarningIcon></WarningIcon>;
    if (type === "danger") return <DangerIcon></DangerIcon>;
    return null;
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay isOpen={isOpen} onClick={handleOverlayClick}>
      <ModalContent ref={modalRef} onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle type={type}>
            {getIcon()}
            {getTitle()}
          </ModalTitle>
        </ModalHeader>

        <ModalMessage>{message}</ModalMessage>

        <ModalActions>
          <Button variant="secondary" onClick={onClose}>
            {cancelText}
          </Button>
          <Button
            variant={type === "danger" ? "danger" : "primary"}
            onClick={onConfirm}
            autoFocus
          >
            {confirmText}
          </Button>
        </ModalActions>
      </ModalContent>
    </ModalOverlay>
  );
};
