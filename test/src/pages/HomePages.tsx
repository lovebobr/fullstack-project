import React from "react";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../paths";
import { MapPin, Phone as PhoneIcon } from "lucide-react";
import Header from "../app/component/Header";
import Button from "../app/component/Button";
import { useAuth } from "../useAuth";
import {
  AddressLine,
  ContactContent,
  ContactGradient,
  ContactInfo,
  ContactSection,
  ContactTitle,
  Day,
  DayTimeContainer,
  Footer,
  FooterText,
  HeroContent,
  HeroDescription,
  HeroOverlay,
  HeroSection,
  HeroTitle,
  HomeContainer,
  ImageContent,
  MainContent,
  MenuActions,
  MenuDescription,
  MenuGrid,
  MenuImage,
  MenuSection,
  MenuTextContent,
  MenuTitle,
  Mood,
  NoteText,
  Notes,
  OutlineButton,
  PhoneLine,
  ScheduleContainer,
  SectionTitle,
  Time,
  WorkingFacts,
} from "../styled/Home.styles";

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleBookTable = () => {
    if (isAuthenticated) {
      navigate(PATHS.BOOKING);
    } else {
      navigate(PATHS.REGISTER);
    }
  };

  const handleViewMenu = () => {
    navigate(PATHS.MENU);
  };

  const workingHours = [
    { day: "Воскресенье", time: "14:00 - 22:00" },
    { day: "Понедельник", time: "14:00 - 22:00" },
    { day: "Вторник", time: "14:00 - 22:00" },
    { day: "Среда", time: "14:00 - 22:00" },
    { day: "Четверг", time: "14:00 - 22:00" },
    { day: "Пятница", time: "14:00 - 02:00" },
    { day: "Суббота", time: "14:00 - 02:00" },
  ];

  return (
    <HomeContainer>
      <ImageContent>
        <Header onBookTable={handleBookTable} onViewMenu={handleViewMenu} />
        <HeroSection>
          <HeroOverlay>
            <HeroContent>
              <HeroTitle>Сережка</HeroTitle>
              <HeroDescription>
                Ресторан F&B предлагает блюда для общего стола, крафтовые
                коктейли, тщательно подобранную винную карту и безупречный
                сервис!
              </HeroDescription>
            </HeroContent>
          </HeroOverlay>
        </HeroSection>

        <WorkingFacts>
          <SectionTitle>Часы работы</SectionTitle>
          <ScheduleContainer>
            {workingHours.map((item, index) => (
              <DayTimeContainer key={index}>
                <Day>{item.day}</Day>
                <Time>{item.time}</Time>
              </DayTimeContainer>
            ))}
          </ScheduleContainer>
        </WorkingFacts>

        <Notes>
          <NoteText>
            <strong>Бронирование осуществляется на 2 часа.</strong>
          </NoteText>
          <NoteText>
            Обратите внимание: мы не принимаем бронирование для больших
            компаний.
          </NoteText>
        </Notes>
      </ImageContent>
      <MainContent>
        <MenuSection>
          <MenuGrid>
            <MenuTextContent>
              <Mood>Для хорошего настроения</Mood>
              <MenuTitle>Наше меню</MenuTitle>
              <MenuDescription>
                Ресторан F&B известен своими блюдами для общего стола,
                крафтовыми коктейлями, тщательно подобранной виннoй картой и
                безупречным сервисом!
              </MenuDescription>
              <MenuActions>
                <Button onClick={handleBookTable}>Забронировать стол</Button>
                <Button onClick={handleViewMenu}>Посмотреть меню</Button>
              </MenuActions>
            </MenuTextContent>
            <MenuImage>
              <img src="../../image/menu.jpg" alt="Блюда из меню" />
            </MenuImage>
          </MenuGrid>
        </MenuSection>
        <ContactSection>
          <ContactGradient>
            <ContactContent>
              <ContactTitle>Ждем вас в нашем ресторане</ContactTitle>
              <ContactInfo>
                <AddressLine>
                  <MapPin size={18} />
                  3000 Wymdolite Street East Lower Winbatch ON NW 3B2
                </AddressLine>
                <PhoneLine>
                  <PhoneIcon size={18} />
                  +1 (326) 234-9932
                </PhoneLine>
              </ContactInfo>
              <Button onClick={handleBookTable}>Забронировать стол</Button>
            </ContactContent>
          </ContactGradient>
        </ContactSection>
      </MainContent>

      <Footer>
        <FooterText>Сережка 2025</FooterText>
      </Footer>
    </HomeContainer>
  );
};
export default HomePage;
