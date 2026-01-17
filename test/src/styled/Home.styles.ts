import styled from "styled-components";

export const HomeContainer = styled.div`
  /* Убираем Isadora Cyr из контейнера, используем стандартный шрифт */
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #1a1a1a;
  color: #ffffff;
`;

export const ImageContent = styled.div`
  position: relative;
  background-image: url("../../image/main.jpg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  /* Градиент с цветом фона */
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: -1px;
    background: linear-gradient(
      to bottom,
      rgba(26, 26, 26, 0.7) 0%,
      rgba(26, 26, 26, 0.85) 40%,
      rgba(26, 26, 26, 0.95) 80%,
      rgba(26, 26, 26, 1) 100%
    );
    z-index: 1;
  }

  & > * {
    position: relative;
    z-index: 2;
  }
`;

export const OutlineButton = styled.button`
  background-color: transparent;
  color: #ff9500;
  border: 2px solid #ff9500;
  padding: 0.8rem 1.5rem;
  font-size: 0.95rem;
  font-weight: normal;
  cursor: pointer;
  transition: all 0.3s;
  /* Меняем на стандартный шрифт для кнопок */
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
  border-radius: 25px;
  min-width: 160px;

  &:hover {
    background-color: rgba(255, 149, 0, 0.1);
    border-color: #ffaa33;
    box-shadow: 0 0 15px rgba(255, 149, 0, 0.3);
  }
`;

export const HeroSection = styled.section`
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const HeroOverlay = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const HeroContent = styled.div`
  text-align: center;
  color: white;
  max-width: 900px;
  padding: 8rem;
`;

export const HeroTitle = styled.h2`
  /* Добавляем Isadora Cyr только для заголовков */
  font-family: "Isadora Cyr", Georgia, "Times New Roman", Times, serif;
  font-style: italic; /* Делаем курсивом */
  font-size: 3.5rem;
  margin-bottom: 1.5rem;
  font-weight: normal;
  letter-spacing: 1px;
  color: #ffffff;
  text-shadow: 0 0 150px rgba(0, 0, 0, 0.9), 0 0 300px rgba(0, 0, 0, 0.7),
    0 0 450px rgba(0, 0, 0, 0.5), 0 0 700px rgba(255, 149, 0, 0.4),
    0 0 1000px rgba(255, 149, 0, 0.3), 0 0 1500px rgba(255, 149, 0, 0.2);

  @media (max-width: 768px) {
    font-size: 2.5rem;
    text-shadow: 0 0 80px rgba(0, 0, 0, 0.9), 0 0 160px rgba(0, 0, 0, 0.7),
      0 0 240px rgba(0, 0, 0, 0.5), 0 0 400px rgba(255, 149, 0, 0.4),
      0 0 600px rgba(255, 149, 0, 0.3);
  }
`;

export const HeroDescription = styled.p`
  /* Стандартный системный шрифт для параграфов */
  font-family: inherit; /* Наследует от body/контейнера */
  font-size: 1.2rem;
  line-height: 1.6;
  color: #f0f0f0;
  max-width: 700px;
  margin: 0 auto;
  font-style: normal; /* Убираем курсив, если был */

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

export const MainContent = styled.main`
  flex: 1;
  margin: 0 auto;
  width: 100%;
`;

export const WorkingFacts = styled.section`
  padding: 3rem 0 0 0;
`;

export const SectionTitle = styled.h2`
  /* Isadora Cyr для заголовков */
  font-family: "Isadora Cyr", Georgia, "Times New Roman", Times, serif;
  font-style: italic; /* Курсив */
  font-size: 1.8rem;
  text-align: center;
  font-weight: normal;
  color: #ffffff;
`;

export const ScheduleContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 0 7rem;
  flex-wrap: wrap;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 768px) {
    gap: 1rem;
    padding: 0 1rem;
  }
`;

export const DayTimeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  min-width: 120px;
  padding: 1rem 0.5rem;

  @media (max-width: 768px) {
    min-width: 100px;
    flex: 0 0 calc(25% - 1rem);
  }

  @media (max-width: 480px) {
    min-width: 90px;
    flex: 0 0 calc(33.333% - 1rem);
  }
`;

export const Day = styled.div`
  text-align: center;
  padding: 0.5rem 0;
  font-weight: normal;
  color: #ffffff;
  font-size: 1rem;
  margin-bottom: 0.5rem;
  /* Стандартный шрифт для текста */
  font-family: inherit;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

export const Time = styled.div`
  text-align: center;
  padding: 0.5rem 0;
  color: #ff9500;
  font-size: 1rem;
  font-weight: 500;
  /* Стандартный шрифт для текста */
  font-family: inherit;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

export const Notes = styled.div`
  margin-bottom: 2rem;
`;

export const NoteText = styled.p`
  margin: 0.5rem 0;
  font-size: 1rem;
  color: #cccccc;
  text-align: center;
  line-height: 1.4;
  /* Стандартный шрифт для текста */
  font-family: inherit;
`;

export const MenuSection = styled.section`
  padding: 4rem 0;
`;

export const MenuGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  padding: 0 7rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 3rem;
    padding: 0 3rem;
  }
`;

export const MenuTextContent = styled.div`
  text-align: left;
`;

export const MenuTitle = styled.h3`
  /* Isadora Cyr для заголовков */
  font-family: "Isadora Cyr", Georgia, "Times New Roman", Times, serif;
  font-style: italic; /* Курсив */
  font-size: 1.5rem;
  margin-bottom: 2rem;
  font-weight: normal;
  color: #ffffff;
  letter-spacing: 2px;
  text-transform: uppercase;
`;

export const Mood = styled.div`
  font-size: 1rem;
  color: #cccccc;
  margin-bottom: 0.5rem;
  /* Стандартный шрифт для текста */
  font-family: inherit;
`;

export const MenuDescription = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: #abababff;
  margin-bottom: 3rem;
  font-style: italic;
  /* Стандартный шрифт для текста, но с курсивом */
  font-family: inherit;
`;

export const MenuActions = styled.div`
  display: flex;
  gap: 1.5rem;
  max-width: 400px;
`;

export const MenuImage = styled.div`
  img {
    width: 100%;
    object-fit: cover;
    border-radius: 8px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  }
`;

export const ContactSection = styled.section`
  min-height: 400px;
  background-image: url("../../image/stol.jpg");
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

export const ContactGradient = styled.div`
  position: relative;
  width: 100%;
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  background-size: cover;
  background-position: center;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: -1px;
    background: linear-gradient(
        to bottom,
        rgba(26, 26, 26, 1) 0%,
        transparent 40%
      ),
      linear-gradient(to top, rgba(26, 26, 26, 1) 0%, transparent 40%),
      linear-gradient(90deg, transparent 0%, rgba(26, 26, 26, 1) 70%);
    z-index: 1;
  }

  & > * {
    position: relative;
    z-index: 2;
  }

  @media (max-width: 768px) {
    justify-content: center;
  }
`;

export const ContactContent = styled.div`
  padding: 0 6rem;
  text-align: left;

  @media (max-width: 768px) {
    text-align: center;
    padding: 2rem;
  }
`;

export const ContactTitle = styled.h4`
  /* Isadora Cyr для заголовков */
  font-family: "Isadora Cyr", Georgia, "Times New Roman", Times, serif;
  font-style: italic; /* Курсив */
  font-size: 2rem;
  margin-bottom: 1.5rem;
  font-weight: normal;
  color: #ffffff;
`;

export const ContactInfo = styled.div`
  margin-bottom: 2rem;
`;

export const AddressLine = styled.p`
  font-size: 1rem;
  margin-bottom: 1rem;
  color: #ffffff;
  line-height: 1.5;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  /* Стандартный шрифт для текста */
  font-family: inherit;

  @media (max-width: 768px) {
    justify-content: center;
  }
`;

export const PhoneLine = styled.p`
  font-size: 1rem;
  color: #ffffff;
  margin-bottom: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  /* Стандартный шрифт для текста */
  font-family: inherit;

  @media (max-width: 768px) {
    justify-content: center;
  }
`;
