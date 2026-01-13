import React, { useState, useEffect, useCallback } from "react";
import { observer } from "mobx-react-lite";
import { useNavigate, useSearchParams } from "react-router-dom";
import styled from "styled-components";
import { MapPin, Clock, Utensils } from "lucide-react";
import { BookingPage } from "./BookingPage";
import { restaurantStore } from "../app/store/restaurant.store";
import { authStore } from "../app/store/auth.store";
import { PATHS } from "../paths";
import { useAuth } from "../useAuth";
import Header from "../app/component/Header";

const Container = styled.div`
  font-family: "Isadora Cyr", system-ui, Avenir, Helvetica, Arial, sans-serif;
  min-height: 100vh;
  background-color: #1a1a1a;
  color: #ffffff;
  position: relative;
`;

const ContentWrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  position: relative;
`;

const Title = styled.h1`
  text-align: center;
  margin: 0 0 1rem 0;
  font-weight: normal;
  letter-spacing: 1px;
  color: #ffffff;
  font-size: 1.7rem;

  @media (max-width: 768px) {
    font-size: 1.5rem;
    margin-top: 1rem;
  }
`;

const RestaurantGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const RestaurantCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  height: 100%;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-4px);
    background: rgba(255, 255, 255, 0.08);
  }
`;

const RestaurantImage = styled.div`
  width: 100%;
  height: 200px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 149, 0, 0.05);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const RestaurantIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 2;

  svg {
    width: 80px;
    height: 80px;
    color: rgba(255, 149, 0, 0.3);
  }
`;

const RestaurantContent = styled.div`
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const RestaurantName = styled.h3`
  margin: 0 0 1rem 0;
  color: #ffffff;
  font-size: 1.3rem;
  font-weight: normal;
  letter-spacing: 1px;
  text-align: center;
`;

const RestaurantInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
  flex: 1;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  color: #cccccc;
  font-size: 0.95rem;
  line-height: 1.4;

  svg {
    color: #ff9500;
    flex-shrink: 0;
    margin-top: 2px;
  }
`;

const RestaurantFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const TablesCount = styled.div`
  display: inline-block;
  background: rgba(255, 149, 0, 0.1);
  color: #ff9500;
  padding: 0.4rem 1rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: normal;
  border: 1px solid rgba(255, 149, 0, 0.3);
`;

const WorkingHours = styled.div`
  color: #cccccc;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 4rem;
  color: #cccccc;
  font-size: 1.1rem;
`;

const ErrorState = styled.div`
  text-align: center;
  padding: 2rem;
  color: #ff6666;
  background: rgba(255, 102, 102, 0.1);
  border-radius: 8px;
  margin: 2rem 0;
  border: 1px solid rgba(255, 102, 102, 0.3);
`;

const ErrorButton = styled.button`
  padding: 0.5rem 1.5rem;
  background: transparent;
  color: #ff6666;
  border: 1px solid #ff6666;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: "Isadora Cyr", sans-serif;
  font-size: 0.9rem;
  margin-top: 1rem;

  &:hover {
    background: rgba(255, 102, 102, 0.1);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem;
  color: #cccccc;

  h3 {
    margin: 0 0 1rem 0;
    color: #ffffff;
    font-weight: normal;
    font-size: 1.5rem;
  }

  p {
    font-size: 1rem;
    color: #ababab;
  }
`;

export const RestaurantPage = observer(() => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [userInitials, setUserInitials] = useState<string>("");
  const { isAuthenticated, loading: authLoading } = useAuth();

  const restaurantId = searchParams.get("restaurant");

  useEffect(() => {
    if (authStore.user?.name) {
      const names = authStore.user.name.split(" ");
      const initials = names
        .map((name) => name.charAt(0))
        .join("")
        .toUpperCase()
        .slice(0, 2);
      setUserInitials(initials);
    }
  }, [authStore.user]);

  useEffect(() => {
    if (!isAuthenticated && !authLoading) {
      navigate(PATHS.LOGIN, { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate]);

  useEffect(() => {
    restaurantStore.loadRestaurants();
  }, []);

  const handleRestaurantClick = useCallback(
    (restaurantId: number) => {
      setSearchParams({ restaurant: restaurantId.toString() });
    },
    [setSearchParams]
  );

  const handleCloseBooking = useCallback(() => {
    setSearchParams({});
  }, [setSearchParams]);

  const handleBookTable = useCallback(() => {
    // Можно оставить пустым, так как у Header есть свои обработчики
  }, []);

  const handleViewMenu = useCallback(() => {
    navigate(PATHS.MENU);
  }, [navigate]);

  if (authLoading) {
    return (
      <Container>
        <Header />
        <LoadingState>Загрузка...</LoadingState>
      </Container>
    );
  }

  if (restaurantId) {
    return (
      <BookingPage
        restaurantId={parseInt(restaurantId)}
        onClose={handleCloseBooking}
      />
    );
  }

  return (
    <Container>
      <Header
        showButtons={true}
        onBookTable={handleBookTable}
        onViewMenu={handleViewMenu}
      />

      <ContentWrapper>
        <Title>Выберите ресторан для бронирования</Title>

        {restaurantStore.loading && (
          <LoadingState>Загрузка ресторанов...</LoadingState>
        )}

        {restaurantStore.error && (
          <ErrorState>
            Ошибка загрузки ресторанов: {restaurantStore.error}
            <div style={{ marginTop: "1rem" }}>
              <ErrorButton onClick={() => restaurantStore.loadRestaurants()}>
                Попробовать снова
              </ErrorButton>
            </div>
          </ErrorState>
        )}

        {!restaurantStore.loading && restaurantStore.restaurants.length > 0 && (
          <RestaurantGrid>
            {restaurantStore.restaurants.map((restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                onClick={() => handleRestaurantClick(restaurant.id)}
              >
                <RestaurantImage>
                  <RestaurantIcon>
                    <Utensils size={80} />
                  </RestaurantIcon>
                </RestaurantImage>

                <RestaurantContent>
                  <RestaurantName>{restaurant.name}</RestaurantName>

                  <RestaurantInfo>
                    <InfoRow>
                      <MapPin size={16} />
                      <span>{restaurant.address}</span>
                    </InfoRow>

                    {restaurant.description && (
                      <InfoRow>
                        <span>{restaurant.description}</span>
                      </InfoRow>
                    )}
                  </RestaurantInfo>

                  <RestaurantFooter>
                    <TablesCount>
                      {restaurant.tables?.length || 0} доступных столов
                    </TablesCount>

                    <WorkingHours>
                      <Clock size={14} />
                      <span>14:00 - 22:00</span>
                    </WorkingHours>
                  </RestaurantFooter>
                </RestaurantContent>
              </RestaurantCard>
            ))}
          </RestaurantGrid>
        )}

        {!restaurantStore.loading &&
          restaurantStore.restaurants.length === 0 && (
            <EmptyState>
              <h3>Нет доступных ресторанов</h3>
              <p>В данный момент нет ресторанов для бронирования</p>
            </EmptyState>
          )}
      </ContentWrapper>
    </Container>
  );
});

export default RestaurantPage;
