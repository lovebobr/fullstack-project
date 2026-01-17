import styled from "styled-components";

// Основной лейаут админ панели
export const AdminLayout = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #f8f9fa;
  position: relative;
`;

export const Sidebar = styled.div`
  width: 280px;
  min-width: 280px;
  background: linear-gradient(135deg, #f4616c 0%, #9c46ae 100%);
  color: white;
  display: flex;
  flex-direction: column;
  position: fixed; /* ФИКСИРУЕМ */
  top: 0;
  left: 0;
  bottom: 0; /* Растягиваем до низа */
  height: 100vh; /* Всегда 100% высоты viewport */
  overflow-y: auto; /* Скролл внутри сайдбара */
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  z-index: 10000;

  /* Кастомный скроллбар для сайдбара */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.5);
  }

  /* Для Firefox */
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.3) rgba(255, 255, 255, 0.1);

  @media (max-width: 992px) {
    position: fixed;
    left: -280px;
    transition: left 0.3s ease;
    z-index: 1000;

    &.open {
      left: 0;
    }
  }
`;

export const SidebarHeader = styled.div`
  padding: 25px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  margin-bottom: 10px;
  flex-shrink: 0; /* Важно для фиксированного заголовка */

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
  flex-shrink: 0; /* Предотвращаем сжатие */

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
  flex-shrink: 0;
`;

export const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-left: 280px; /* Отступ под сайдбар */
  min-width: 0;
  min-height: 100vh;
  width: calc(100% - 280px); /* Вычитаем ширину сайдбара */

  @media (max-width: 992px) {
    margin-left: 0;
    width: 100%;
  }
`;

export const ContentHeader = styled.div`
  background: white;
  padding: 20px 30px;
  border-bottom: 1px solid #eaeaea;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 900;

  h1 {
    margin: 0;
    font-size: 24px;
    font-weight: 700;
    color: #2c3e50;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  @media (max-width: 768px) {
    padding: 15px 20px;
  }
`;

export const ContentBody = styled.div`
  flex: 1;
  padding: 30px;
  background-color: #f8f9fa;
  overflow-y: auto;
  overflow-x: hidden;
  min-height: 0;

  /* Кастомный скроллбар для основного контента */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }

  @media (max-width: 768px) {
    padding: 20px;
  }

  @media (max-width: 576px) {
    padding: 15px;
  }
`;

// Остальные стили остаются без изменений...

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 30px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

export const StatCard = styled.div`
  background: white;
  padding: 25px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #eaeaea;
  transition: all 0.3s ease;
  overflow: hidden;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  }

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

export const StatValue = styled.div`
  font-size: 36px;
  font-weight: 800;
  color: #2c3e50;
  margin-bottom: 8px;
  line-height: 1;

  @media (max-width: 768px) {
    font-size: 28px;
  }
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

  @media (max-width: 768px) {
    width: 50px;
    height: 50px;
    font-size: 20px;
  }
`;

export const UserProfile = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  border-radius: 8px;
  background: #f8f9fa;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
  max-width: 300px;

  &:hover {
    background: #e9ecef;
  }

  @media (max-width: 768px) {
    padding: 8px 12px;
    gap: 8px;
  }
`;

export const SectionTitle = styled.h2`
  font-size: 22px;
  font-weight: 700;
  color: #2c3e50;
  margin: 0 0 20px 0;
  display: flex;
  align-items: center;
  gap: 12px;

  @media (max-width: 768px) {
    font-size: 18px;
    gap: 8px;
  }
`;

export const LoadingState = styled.div`
  padding: 60px 20px;
  text-align: center;
  color: #666;
  font-size: 16px;
  background: white;
  border-radius: 8px;
  border: 1px solid #eaeaea;
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
  background: white;
  border-radius: 8px;
  border: 1px solid #eaeaea;

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

// Стили для карточек ресторанов
export const RestaurantGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

export const RestaurantCard = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #eaeaea;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    border-color: #f4616c;
  }
`;

export const RestaurantImage = styled.div`
  width: 100%;
  height: 180px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(244, 97, 108, 0.05);
  border-bottom: 1px solid #eaeaea;
`;

export const RestaurantIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 2;

  svg {
    width: 70px;
    height: 70px;
    color: rgba(244, 97, 108, 0.3);
  }
`;

export const RestaurantContent = styled.div`
  padding: 1.25rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
`;

export const RestaurantName = styled.h3`
  margin: 0 0 0.75rem 0;
  color: #2c3e50;
  font-size: 1.2rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const RestaurantInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex: 1;
  overflow: hidden;
`;

export const InfoRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  color: #6c757d;
  font-size: 0.9rem;
  line-height: 1.4;
  overflow: hidden;

  svg {
    color: #f4616c;
    flex-shrink: 0;
    margin-top: 2px;
  }

  span {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    line-clamp: 2;
  }
`;

export const RestaurantFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding-top: 1rem;
  border-top: 1px solid #eaeaea;
  flex-shrink: 0;
`;

export const TablesCount = styled.div`
  display: inline-block;
  background: rgba(244, 97, 108, 0.1);
  color: #f4616c;
  padding: 0.35rem 0.85rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  border: 1px solid rgba(244, 97, 108, 0.3);
  white-space: nowrap;
`;

// Стили для страницы бронирования в админ-панели
export const AdminBookingContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: transparent;
`;

export const AdminBookingContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: transparent;
`;

export const AdminBookingGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 0;
  flex: 1;
  min-height: 0;
  overflow: hidden;
`;

export const AdminMapContainer = styled.div`
  background: white;
  border-radius: 8px;
  border: 1px solid #eaeaea;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  overflow: hidden;
`;

// Мобильная версия
export const MobileSidebarToggle = styled.button`
  display: none;
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 1100;
  background: #f4616c;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 15px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(244, 97, 108, 0.3);

  @media (max-width: 992px) {
    display: block;
  }
`;

// Для закрытия сайдбара на мобильных
export const Overlay = styled.div`
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 99;

  @media (max-width: 992px) {
    &.show {
      display: block;
    }
  }
`;
