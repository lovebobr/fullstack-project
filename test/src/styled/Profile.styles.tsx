// Profile.styles.ts
import styled from "styled-components";

export const ProfileContainer = styled.div`
  /* Стандартный системный шрифт для всего контейнера */
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #1a1a1a;
  color: #ffffff;
`;

export const ProfileHeader = styled.div`
  position: relative;
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  /* Градиентный фон как на главной странице */
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
        to bottom,
        rgba(26, 26, 26, 0.7) 0%,
        rgba(26, 26, 26, 0.85) 40%,
        rgba(26, 26, 26, 0.95) 80%,
        rgba(26, 26, 26, 1) 100%
      ),
      url("../../image/main.jpg") center/cover no-repeat;
    z-index: 1;
  }

  /* Эффект свечения как на главной */
  &::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 300px;
    height: 300px;
    background: radial-gradient(
      circle,
      rgba(255, 149, 0, 0.15) 0%,
      transparent 70%
    );
    z-index: 2;
  }

  & > * {
    position: relative;
    z-index: 3;
  }

  @media (max-width: 768px) {
    min-height: 250px;
  }
`;

export const Avatar = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  border: 3px solid rgba(255, 149, 0, 0.5);
  box-shadow: 0 0 20px rgba(255, 149, 0, 0.3), 0 0 40px rgba(255, 149, 0, 0.2),
    inset 0 0 20px rgba(255, 255, 255, 0.1);

  @media (max-width: 768px) {
    width: 100px;
    height: 100px;
  }
`;

export const ProfileName = styled.h2`
  /* Isadora Cyr только для заголовков */
  font-family: "Isadora Cyr", Georgia, "Times New Roman", Times, serif;
  font-style: italic; /* Курсив */
  margin: 0 0 10px 0;
  font-size: 2.5rem;
  font-weight: normal;
  color: #ffffff;
  letter-spacing: 1px;
  text-align: center;
  text-shadow: 0 0 20px rgba(0, 0, 0, 0.9), 0 0 40px rgba(0, 0, 0, 0.7),
    0 0 80px rgba(255, 149, 0, 0.3);

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

export const ProfileRole = styled.p`
  /* Стандартный шрифт для текста */
  font-family: inherit;
  font-size: 1.1rem;
  color: #ff9500;
  margin: 0;
  text-align: center;
  opacity: 0.9;
  font-weight: 500;
`;

export const ProfileContent = styled.div`
  flex: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  width: 100%;

  @media (max-width: 768px) {
    padding: 30px 15px;
  }
`;

export const Section = styled.div`
  margin-bottom: 40px;
  background: rgba(255, 255, 255, 0.05);
  padding: 30px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;

  &:hover {
    border-color: rgba(255, 149, 0, 0.3);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4), 0 0 20px rgba(255, 149, 0, 0.1);
  }

  &:last-child {
    margin-bottom: 0;
  }

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

export const SectionTitle = styled.h3`
  /* Isadora Cyr только для заголовков */
  font-family: "Isadora Cyr", Georgia, "Times New Roman", Times, serif;
  font-style: italic; /* Курсив */
  margin: 0 0 25px 0;
  font-size: 1.8rem;
  font-weight: normal;
  color: #ffffff;
  display: flex;
  align-items: center;
  gap: 12px;
  letter-spacing: 1px;
  padding-bottom: 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  .count-badge {
    margin-left: 10px;
    font-size: 1rem;
    font-weight: normal;
    color: #ff9500;
    background: rgba(255, 149, 0, 0.1);
    padding: 4px 12px;
    border-radius: 20px;
  }

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

export const FieldGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 25px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

export const FieldLabel = styled.label`
  /* Стандартный шрифт для текста */
  font-family: inherit;
  font-size: 14px;
  font-weight: 500;
  color: #ababab;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 10px;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

export const FieldValue = styled.div`
  /* Стандартный шрифт для текста */
  font-family: inherit;
  padding: 16px 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  font-size: 16px;
  color: #ffffff;
  min-height: 52px;
  display: flex;
  align-items: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s;
  font-weight: 500;

  &:hover {
    border-color: rgba(255, 149, 0, 0.3);
    background: rgba(255, 255, 255, 0.08);
  }
`;

export const FieldInput = styled.input`
  /* Стандартный шрифт для текста */
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
  padding: 16px 20px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  font-size: 16px;
  color: #ffffff;
  transition: all 0.3s;
  width: 100%;

  
  }
`;

export const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 15px;
`;

export const EditButton = styled.button`
  /* Стандартный шрифт для кнопок */
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: transparent;
  color: #ff9500;
  border: 1px solid #ff9500;
  border-radius: 25px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s;

  &:hover:not(:disabled) {
    background: rgba(255, 149, 0, 0.1);
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(255, 149, 0, 0.2);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const SaveButton = styled.button`
  /* Стандартный шрифт для кнопок */
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: #27ae60;
  color: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s;

  &:hover:not(:disabled) {
    background: #219a52;
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(39, 174, 96, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const CancelButton = styled.button`
  /* Стандартный шрифт для кнопок */
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: transparent;
  color: #ababab;
  border: 1px solid #ababab;
  border-radius: 25px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s;

  &:hover:not(:disabled) {
    background: rgba(171, 171, 171, 0.1);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const EmptyValue = styled.span`
  /* Стандартный шрифт для текста */
  font-family: inherit;
  color: #6c757d;
  font-style: italic;
  font-weight: normal;
`;

export const LogoutButton = styled.button`
  /* Стандартный шрифт для кнопок */
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 14px 32px;
  background: transparent;
  color: #dc3545;
  border: 2px solid #dc3545;
  border-radius: 25px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.3s;
  margin: 0 auto;
  min-width: 220px;

  &:hover {
    background: rgba(220, 53, 69, 0.1);
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(220, 53, 69, 0.2),
      0 0 20px rgba(220, 53, 69, 0.1);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const LoadingOverlay = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  text-align: center;
  background: #1a1a1a;

  .spinner {
    width: 60px;
    height: 60px;
    border: 4px solid rgba(255, 255, 255, 0.1);
    border-top: 4px solid #ff9500;
    border-radius: 50%;
    margin: 0 auto 25px;
    animation: spin 1s linear infinite;
  }

  .loading-text {
    /* Стандартный шрифт для текста */
    font-family: inherit;
    font-size: 18px;
    color: #ababab;
    letter-spacing: 1px;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

export const ErrorMessage = styled.div`
  text-align: center;
  padding: 60px 40px;
  color: #dc3545;
  background: rgba(220, 53, 69, 0.1);
  border-radius: 12px;
  margin: 40px auto;
  max-width: 600px;
  border: 1px solid rgba(220, 53, 69, 0.3);

  .error-title {
    /* Стандартный шрифт для текста */
    font-family: inherit;
    font-size: 24px;
    font-weight: 500;
    margin-bottom: 15px;
  }

  .error-message {
    /* Стандартный шрифт для текста */
    font-family: inherit;
    margin-bottom: 30px;
    font-size: 16px;
    line-height: 1.5;
  }

  .retry-button {
    /* Стандартный шрифт для кнопок */
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
      Roboto, "Helvetica Neue", Arial, sans-serif;
    padding: 12px 30px;
    background: #dc3545;
    color: white;
    border: none;
    border-radius: 25px;
    cursor: pointer;
    font-size: 16px;
    font-weight: 600;
    transition: all 0.3s;

    &:hover {
      background: #c82333;
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(220, 53, 69, 0.3);
    }
  }
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 80px 40px;
  color: #ababab;
  background: #1a1a1a;

  .empty-icon {
    margin-bottom: 25px;
    color: #ff9500;
    opacity: 0.7;
  }

  .empty-title {
    /* Стандартный шрифт для текста */
    font-family: inherit;
    font-size: 24px;
    margin-bottom: 15px;
    color: #ffffff;
    font-weight: 500;
  }

  .empty-button {
    /* Стандартный шрифт для кнопок */
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
      Roboto, "Helvetica Neue", Arial, sans-serif;
    padding: 12px 30px;
    background: #ff9500;
    color: white;
    border: none;
    border-radius: 25px;
    cursor: pointer;
    font-size: 16px;
    font-weight: 600;
    margin-top: 25px;
    transition: all 0.3s;

    &:hover {
      background: #e67e22;
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(255, 149, 0, 0.3);
    }
  }
`;

export const ProfileError = styled.div`
  /* Стандартный шрифт для текста */
  font-family: inherit;
  color: #dc3545;
  background: rgba(220, 53, 69, 0.1);
  padding: 16px 20px;
  border-radius: 8px;
  margin-bottom: 30px;
  border: 1px solid rgba(220, 53, 69, 0.3);
  font-size: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  backdrop-filter: blur(10px);

  .error-close {
    background: none;
    border: none;
    color: #dc3545;
    cursor: pointer;
    font-size: 20px;
    padding: 0;
    line-height: 1;
    transition: all 0.2s;

    &:hover {
      transform: scale(1.2);
    }
  }
`;

export const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
`;

export const RefreshButton = styled.button`
  /* Стандартный шрифт для кнопок */
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: transparent;
  border: 1px solid rgba(255, 149, 0, 0.3);
  border-radius: 25px;
  cursor: pointer;
  font-size: 14px;
  color: #ff9500;
  transition: all 0.3s;
  font-weight: 600;

  &:hover:not(:disabled) {
    background: rgba(255, 149, 0, 0.1);
    border-color: #ff9500;
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(255, 149, 0, 0.2);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .spin {
    animation: spin 1s linear infinite;
  }
`;

export const ReservationsList = styled.div`
  margin-top: 10px;
`;

export const ReservationCard = styled.div<{
  $isActive?: boolean;
  $isPending?: boolean;
}>`
  padding: 25px;
  margin-bottom: 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border: 1px solid
    ${(props) =>
      props.$isActive
        ? "rgba(25, 118, 210, 0.3)"
        : props.$isPending
        ? "rgba(255, 149, 0, 0.3)"
        : "rgba(255, 255, 255, 0.1)"};
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${(props) =>
      props.$isActive
        ? "linear-gradient(90deg, #1976d2, #64b5f6)"
        : props.$isPending
        ? "linear-gradient(90deg, #ff9500, #ffb74d)"
        : "linear-gradient(90deg, #6c757d, #adb5bd)"};
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3),
      0 0 20px
        ${(props) =>
          props.$isActive
            ? "rgba(25, 118, 210, 0.1)"
            : props.$isPending
            ? "rgba(255, 149, 0, 0.1)"
            : "rgba(255, 255, 255, 0.05)"};
    border-color: ${(props) =>
      props.$isActive
        ? "rgba(25, 118, 210, 0.5)"
        : props.$isPending
        ? "rgba(255, 149, 0, 0.5)"
        : "rgba(255, 255, 255, 0.2)"};
  }
`;

export const ReservationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 15px;
  }
`;

export const RestaurantInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;

  @media (max-width: 768px) {
    gap: 15px;
  }
`;

export const TableIconWrapper = styled.div<{
  $isActive?: boolean;
  $isPending?: boolean;
}>`
  width: 60px;
  height: 60px;
  border-radius: 12px;
  background: ${(props) =>
    props.$isActive
      ? "rgba(25, 118, 210, 0.15)"
      : props.$isPending
      ? "rgba(255, 149, 0, 0.15)"
      : "rgba(255, 255, 255, 0.08)"};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) =>
    props.$isActive ? "#1976d2" : props.$isPending ? "#ff9500" : "#ababab"};
  flex-shrink: 0;
  border: 1px solid
    ${(props) =>
      props.$isActive
        ? "rgba(25, 118, 210, 0.3)"
        : props.$isPending
        ? "rgba(255, 149, 0, 0.3)"
        : "rgba(255, 255, 255, 0.1)"};
`;

export const RestaurantDetails = styled.div`
  flex: 1;
`;

export const TableNumber = styled.div`
  /* Стандартный шрифт для текста */
  font-family: inherit;
  font-weight: 700;
  color: #ffffff;
  font-size: 22px;
  margin-bottom: 8px;
  letter-spacing: 0.5px;
`;

export const RestaurantName = styled.div`
  /* Стандартный шрифт для текста */
  font-family: inherit;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  color: #ababab;
  margin-bottom: 6px;

  span {
    font-weight: 600;
    color: #ffffff;
  }
`;

export const RestaurantId = styled.div`
  /* Стандартный шрифт для текста */
  font-family: inherit;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #6c757d;
  font-weight: 500;
`;

export const StatusSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;

  @media (max-width: 768px) {
    align-items: flex-start;
  }
`;

export const StatusBadge = styled.div<{ $bg: string; $text: string }>`
  /* Стандартный шрифт для текста */
  font-family: inherit;
  padding: 8px 18px;
  background: ${(props) => props.$bg};
  color: ${(props) => props.$text};
  border-radius: 20px;
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  border: 1px solid ${(props) => `${props.$text}30`};
  backdrop-filter: blur(10px);
`;

export const ReservationId = styled.div`
  /* Стандартный шрифт для текста */
  font-family: inherit;
  font-size: 13px;
  color: #6c757d;
  font-weight: 500;
  letter-spacing: 0.5px;
`;

export const DetailsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  margin-bottom: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const DetailItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const DetailLabel = styled.div`
  /* Стандартный шрифт для текста */
  font-family: inherit;
  font-size: 13px;
  color: #6c757d;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const DetailValue = styled.div`
  /* Стандартный шрифт для текста */
  font-family: inherit;
  font-size: 17px;
  font-weight: 600;
  color: #ffffff;
  letter-spacing: 0.5px;
`;

export const GuestsInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const GuestsCount = styled.div`
  /* Стандартный шрифт для текста */
  font-family: inherit;
  font-size: 17px;
  font-weight: 600;
  color: #28a745;
  letter-spacing: 0.5px;
`;

export const SpecialRequests = styled.div`
  /* Стандартный шрифт для текста */
  font-family: inherit;
  padding: 16px 20px;
  background: rgba(255, 149, 0, 0.08);
  border-radius: 10px;
  margin-bottom: 20px;
  border-left: 4px solid #ff9500;
  border: 1px solid rgba(255, 149, 0, 0.2);
  backdrop-filter: blur(10px);
`;

export const RequestsLabel = styled.div`
  /* Стандартный шрифт для текста */
  font-family: inherit;
  font-size: 15px;
  font-weight: 700;
  color: #ff9500;
  margin-bottom: 8px;
  letter-spacing: 0.5px;
  text-transform: uppercase;
`;

export const RequestsText = styled.div`
  /* Стандартный шрифт для текста */
  font-family: inherit;
  font-size: 15px;
  color: #ababab;
  line-height: 1.5;
  letter-spacing: 0.3px;
`;

export const ActionButtonsRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    justify-content: center;
  }
`;

export const ActionButton = styled.button<{
  $variant?: "primary" | "success" | "danger" | "outline";
}>`
  /* Стандартный шрифт для кнопок */
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
  padding: 12px 24px;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 600;
  font-size: 15px;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 8px;
  letter-spacing: 0.5px;
  min-width: 160px;
  justify-content: center;

  ${(props) => {
    switch (props.$variant) {
      case "success":
        return `
          background: #28a745;
          color: white;
          border: 1px solid #28a745;
          &:hover:not(:disabled) {
            background: #218838;
            border-color: #1e7e34;
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);
          }
        `;
      case "danger":
        return `
          background: transparent;
          color: #dc3545;
          border: 2px solid #dc3545;
          &:hover:not(:disabled) {
            background: rgba(220, 53, 69, 0.1);
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(220, 53, 69, 0.2);
          }
        `;
      case "outline":
        return `
          background: transparent;
          color: #ff9500;
          border: 2px solid #ff9500;
          &:hover:not(:disabled) {
            background: rgba(255, 149, 0, 0.1);
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(255, 149, 0, 0.2);
          }
        `;
      default:
        return `
          background: #ff9500;
          color: white;
          border: 1px solid #ff9500;
          &:hover:not(:disabled) {
            background: #e67e22;
            border-color: #d97706;
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(255, 149, 0, 0.3);
          }
        `;
    }
  }}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    min-width: 140px;
    padding: 10px 20px;
  }
`;

export const EmptyReservations = styled.div`
  text-align: center;
  padding: 60px 30px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  border: 2px dashed rgba(255, 255, 255, 0.1);
  margin: 20px 0;
  backdrop-filter: blur(10px);

  .empty-icon {
    margin-bottom: 25px;
    color: #ff9500;
    opacity: 0.6;
  }

  .empty-title {
    /* Стандартный шрифт для текста */
    font-family: inherit;
    font-size: 22px;
    font-weight: 600;
    margin-bottom: 15px;
    color: #ffffff;
    letter-spacing: 1px;
  }

  .empty-description {
    /* Стандартный шрифт для текста */
    font-family: inherit;
    font-size: 16px;
    color: #ababab;
    margin-bottom: 30px;
    max-width: 400px;
    margin: 0 auto 30px;
    line-height: 1.6;
    letter-spacing: 0.3px;
  }

  .empty-button {
    /* Стандартный шрифт для кнопок */
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
      Roboto, "Helvetica Neue", Arial, sans-serif;
    padding: 14px 32px;
    background: #ff9500;
    color: white;
    border: none;
    border-radius: 25px;
    cursor: pointer;
    font-size: 16px;
    font-weight: 600;
    transition: all 0.3s;
    display: inline-flex;
    align-items: center;
    gap: 10px;
    letter-spacing: 0.5px;

    &:hover {
      background: #e67e22;
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(255, 149, 0, 0.3);
    }
  }
`;

export const FoodItemsSection = styled.div`
  margin-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 16px;
`;

export const FoodItemsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: rgba(255, 149, 0, 0.05);
  border: 1px solid rgba(255, 149, 0, 0.2);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 10px;

  &:hover {
    background: rgba(255, 149, 0, 0.1);
  }

  & > div:first-child {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    font-weight: 600;
    color: #ff9500;
  }
`;

export const FoodItemsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 16px 0;
  max-height: 400px;
  overflow-y: auto;
`;

export const FoodItemCard = styled.div`
  display: flex;
  gap: 12px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 149, 0, 0.2);
  }
`;

export const FoodItemImage = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 6px;
  flex-shrink: 0;
`;

export const FoodItemDetails = styled.div`
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
`;

export const FoodItemInfo = styled.div`
  flex: 1;
`;

export const FoodItemName = styled.div`
  /* Стандартный шрифт для текста */
  font-family: inherit;
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 4px;
`;

export const FoodItemDescription = styled.div`
  /* Стандартный шрифт для текста */
  font-family: inherit;
  font-size: 12px;
  color: #adb5bd;
  line-height: 1.4;
`;

export const FoodItemQuantity = styled.div`
  /* Стандартный шрифт для текста */
  font-family: inherit;
  min-width: 40px;
  text-align: center;
  font-size: 14px;
  color: #ff9500;
  font-weight: 600;
`;

export const FoodItemPrice = styled.div`
  /* Стандартный шрифт для текста */
  font-family: inherit;
  min-width: 70px;
  text-align: right;
  font-size: 14px;
  color: #ffffff;
  font-weight: 500;
`;

export const FoodItemTotal = styled.div`
  /* Стандартный шрифт для текста */
  font-family: inherit;
  min-width: 70px;
  text-align: right;
  font-size: 14px;
  font-weight: 600;
  color: #ff9500;
`;

export const NoFoodItems = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px 20px;
  gap: 12px;
  background: rgba(255, 255, 255, 0.02);
  border: 2px dashed rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  text-align: center;

  & > svg {
    color: #6c757d;
  }

  & > span {
    /* Стандартный шрифт для текста */
    font-family: inherit;
    font-size: 14px;
    color: #adb5bd;
  }
`;

export const FoodSummary = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: rgba(255, 149, 0, 0.05);
  border: 1px solid rgba(255, 149, 0, 0.1);
  border-radius: 8px;
  margin-top: 16px;
`;

export const SummaryItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const SummaryLabel = styled.div`
  /* Стандартный шрифт для текста */
  font-family: inherit;
  font-size: 14px;
  color: #adb5bd;
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const SummaryValue = styled.div`
  /* Стандартный шрифт для текста */
  font-family: inherit;
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
`;
