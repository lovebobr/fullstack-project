import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { Loader } from "lucide-react";
import { FoodCard } from "../app/component/FoodCard";
import { useFoodMenu } from "../useFoodMenu";
import { PATHS } from "../paths";
import Button from "../app/component/Button";
import Header from "../app/component/Header";

const MenuPage: React.FC = () => {
  const navigate = useNavigate();
  const { foods, loading, error, reload } = useFoodMenu();

  const handleViewMenu = () => {
    navigate(PATHS.MENU);
  };

  const handleBookTable = () => {
    navigate(PATHS.BOOKING);
  };

  const handleRetry = () => {
    reload();
  };

  return (
    <MenuPageContainer>
      <Header onBookTable={handleBookTable} onViewMenu={handleViewMenu} />
      <HeroSection>
        <HeroContent>
          <HeroTitle>Наше меню</HeroTitle>
          <HeroDescription>
            Откройте для себя уникальные вкусы от нашего шеф-повара. Каждое
            блюдо приготовлено с любовью из свежайших ингредиентов.
          </HeroDescription>
        </HeroContent>
      </HeroSection>

      <ContentContainer>
        {loading ? (
          <LoadingContainer>
            <Loader size={48} className="spinner" />
            <LoadingText>Загрузка меню...</LoadingText>
          </LoadingContainer>
        ) : error ? (
          <ErrorContainer>
            <ErrorText>{error}</ErrorText>
            <Button onClick={handleRetry}>Попробовать снова</Button>
          </ErrorContainer>
        ) : foods.length === 0 ? (
          <EmptyState>
            <EmptyStateText>
              <p>Нет доступных блюд</p>
            </EmptyStateText>
            <Button onClick={handleRetry}>Обновить</Button>
          </EmptyState>
        ) : (
          <>
            <FoodGrid>
              {foods.map((food) => (
                <FoodCard key={food.id} food={food} />
              ))}
            </FoodGrid>

            <CallToAction>
              <CallToActionContent>
                <CallToActionTitle>
                  Хотите забронировать столик?
                </CallToActionTitle>
                <CallToActionText>
                  Насладитесь нашими блюдами в уютной атмосфере ресторана
                </CallToActionText>
                <Button onClick={handleBookTable} variant="primary">
                  Забронировать стол
                </Button>
              </CallToActionContent>
            </CallToAction>
          </>
        )}
      </ContentContainer>
    </MenuPageContainer>
  );
};

const MenuPageContainer = styled.div`
  /* Стандартный системный шрифт для всего контейнера */
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #1a1a1a;
  color: #ffffff;
`;

const HeroSection = styled.section`
  padding: 2rem 0 0 0;
  background: linear-gradient(rgba(26, 26, 26, 0.9), rgba(26, 26, 26, 0.7)),
    url("/images/menu-banner.jpg");
  background-size: cover;
  background-position: center;
  text-align: center;
`;

const HeroContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const HeroTitle = styled.h1`
  /* Isadora Cyr только для заголовков */
  font-family: "Isadora Cyr", Georgia, "Times New Roman", Times, serif;
  font-style: italic; /* Курсив */
  font-size: 3rem;
  margin-bottom: 1.5rem;
  font-weight: normal;
  color: #ffffff;
  letter-spacing: 2px;
  text-transform: uppercase;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const HeroDescription = styled.p`
  /* Стандартный шрифт для текста */
  font-family: inherit; /* Наследует от родителя */
  font-size: 1.3rem;
  line-height: 1.6;
  color: #f0f0f0;
  max-width: 700px;
  margin: 0 auto;

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const ContentContainer = styled.main`
  flex: 1;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  padding: 2rem;
`;

const FoodGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  gap: 1.5rem;

  .spinner {
    animation: spin 1s linear infinite;
    color: #ff9500;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.p`
  /* Стандартный шрифт для текста */
  font-family: inherit;
  font-size: 1.2rem;
  color: #cccccc;
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  gap: 1.5rem;
`;

const ErrorText = styled.p`
  /* Стандартный шрифт для текста */
  font-family: inherit;
  font-size: 1.2rem;
  color: #ff6b6b;
  text-align: center;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  gap: 1.5rem;
`;

const EmptyStateText = styled.div`
  /* Стандартный шрифт для текста */
  font-family: inherit;
  font-size: 1.2rem;
  color: #cccccc;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;

  svg {
    color: #ff9500;
  }
`;

const CallToAction = styled.div`
  margin-top: 4rem;
  padding: 3rem;
  background: linear-gradient(
    90deg,
    rgba(26, 26, 26, 0.8) 0%,
    rgba(26, 26, 26, 0.9) 100%
  );
  border-radius: 15px;
  border: 1px solid rgba(255, 149, 0, 0.3);
  text-align: center;
`;

const CallToActionContent = styled.div`
  max-width: 600px;
  margin: 0 auto;
`;

const CallToActionTitle = styled.h3`
  /* Isadora Cyr только для заголовков */
  font-family: "Isadora Cyr", Georgia, "Times New Roman", Times, serif;
  font-style: italic; /* Курсив */
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #ffffff;
`;

const CallToActionText = styled.p`
  /* Стандартный шрифт для текста */
  font-family: inherit;
  font-size: 1.1rem;
  color: #cccccc;
  margin-bottom: 2rem;
  line-height: 1.6;
`;

export default MenuPage;
