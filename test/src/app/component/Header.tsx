import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { MapPin, Phone as PhoneIcon, User } from "lucide-react";
import { PATHS } from "../../paths";
import Button from "./Button";
import { useAuth } from "../../useAuth";

interface HeaderProps {
  restaurantName?: string;
  address?: string;
  phone?: string;
  showButtons?: boolean;
  onBookTable?: () => void;
  onViewMenu?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  restaurantName = "Сережка",
  address = "3000 Wymdolite Street East Lower Winbatch ON NW 3B2",
  phone = "+1 (326) 234-9932",
  showButtons = true,
  onBookTable,
  onViewMenu,
}) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleLogoClick = () => {
    navigate(PATHS.HOME);
  };

  const handleBookTable = () => {
    if (onBookTable) {
      onBookTable();
    } else {
      if (isAuthenticated) {
        navigate(PATHS.BOOKING);
      } else {
        navigate(PATHS.REGISTER);
      }
    }
  };

  const handleViewMenu = () => {
    if (onViewMenu) {
      onViewMenu();
    } else {
      navigate(PATHS.MENU);
    }
  };

  const handleProfileClick = () => {
    navigate(PATHS.PROFILE);
  };

  return (
    <StyledHeader>
      <HeaderContent>
        <Logo onClick={handleLogoClick}>
          <RestaurantName>{restaurantName}</RestaurantName>
        </Logo>
        <HeaderInfo>
          <AddressPhone>
            <Address>
              <MapPin size={16} />
              {address}
            </Address>
            <Phone>
              <PhoneIcon size={16} />
              {phone}
            </Phone>
          </AddressPhone>

          <RightSection>
            {showButtons && (
              <HeaderButtons>
                <Button onClick={handleBookTable}>Забронировать стол</Button>
                <Button onClick={handleViewMenu}>Посмотреть меню</Button>
              </HeaderButtons>
            )}

            {isAuthenticated && (
              <ProfileIcon onClick={handleProfileClick} title="Профиль">
                <User size={24} />
              </ProfileIcon>
            )}
          </RightSection>
        </HeaderInfo>
      </HeaderContent>
    </StyledHeader>
  );
};

const StyledHeader = styled.header`
  padding: 0.5rem 2rem;
  background-color: #1a1a1a;
  border-bottom: 1px solid #333;
`;

const HeaderContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  padding: 0 2rem;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;

const Logo = styled.div`
  cursor: pointer;
  margin-bottom: 1rem;

  @media (min-width: 768px) {
    margin-bottom: 0;
  }
`;

const RestaurantName = styled.h1`
  font-size: 2rem;
  margin: 0;
  font-weight: normal;
  letter-spacing: 1px;
  color: #ffffff;
  transition: color 0.3s ease;

  &:hover {
    color: #ff9500;
  }

  @media (min-width: 768px) {
    margin-bottom: 0;
  }
`;

const HeaderInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;

  @media (min-width: 1024px) {
    flex-direction: row;
    align-items: center;
    gap: 3rem;
  }
`;

const AddressPhone = styled.div`
  text-align: center;

  @media (min-width: 768px) {
    text-align: right;
  }
`;

const Address = styled.p`
  margin: 0;
  font-size: 0.95rem;
  color: #ffffff;
  line-height: 1.4;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: center;

  @media (min-width: 768px) {
    justify-content: flex-end;
  }
`;

const Phone = styled.p`
  margin: 0.25rem 0 0 0;
  font-size: 0.95rem;
  color: #ffffff;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: center;

  @media (min-width: 768px) {
    justify-content: flex-end;
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

const HeaderButtons = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
`;

const ProfileIcon = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #333;
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    background-color: #444;
    svg {
      color: #ff9500;
    }
  }

  svg {
    color: #ffffff;
  }
`;

export default Header;
