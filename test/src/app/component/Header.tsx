import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { MapPin, Phone as PhoneIcon, User, ShoppingCart } from "lucide-react";
import { PATHS } from "../../paths";
import Button from "./Button";
import { useAuth } from "../../useAuth";
import { useCart } from "../../CartProvider";

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
  const { openCart, totalItems } = useCart();

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

  const handleCartClick = () => {
    if (isAuthenticated) {
      openCart();
    } else {
      navigate(PATHS.LOGIN);
    }
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

            <IconButtons>
              <CartIcon
                onClick={handleCartClick}
                title={
                  isAuthenticated ? "Корзина" : "Войдите, чтобы открыть корзину"
                }
                $isAuthenticated={isAuthenticated}
              >
                <ShoppingCart size={24} />
                {isAuthenticated && totalItems > 0 && (
                  <CartBadge>{totalItems}</CartBadge>
                )}
              </CartIcon>

              {isAuthenticated && (
                <ProfileIcon onClick={handleProfileClick} title="Профиль">
                  <User size={24} />
                </ProfileIcon>
              )}
            </IconButtons>
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
  position: sticky;
  top: 0;
  z-index: 100;
`;

const HeaderContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  padding: 0 1rem;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
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
  font-family: "Isadora Cyr", sans-serif;

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
  width: 100%;

  @media (min-width: 1024px) {
    flex-direction: row;
    align-items: center;
    gap: 3rem;
    width: auto;
  }
`;

const AddressPhone = styled.div`
  text-align: center;
  order: 3;
  width: 100%;

  @media (min-width: 768px) {
    order: 2;
    text-align: right;
    width: auto;
  }

  @media (min-width: 1024px) {
    order: 1;
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
  font-family: "Isadora Cyr", sans-serif;

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
  font-family: "Isadora Cyr", sans-serif;

  @media (min-width: 768px) {
    justify-content: flex-end;
  }
`;

const RightSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  width: 100%;
  order: 2;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    width: auto;
    order: 3;
  }

  @media (min-width: 1024px) {
    justify-content: flex-end;
    gap: 1.5rem;
  }
`;

const HeaderButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 400px;

  @media (min-width: 768px) {
    flex-direction: row;
    gap: 1rem;
    width: auto;
    max-width: none;
  }

  @media (min-width: 1024px) {
    gap: 1rem;
  }
`;

const IconButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  order: 1;

  @media (min-width: 768px) {
    order: 2;
  }
`;

const CartIcon = styled.button<{ $isAuthenticated: boolean }>`
  background: none;
  border: none;
  cursor: ${(props) => (props.$isAuthenticated ? "pointer" : "not-allowed")};
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => (props.$isAuthenticated ? "#333" : "#555")};
  transition: all 0.3s ease;
  position: relative;
  opacity: ${(props) => (props.$isAuthenticated ? 1 : 0.6)};

  &:hover {
    background-color: ${(props) => (props.$isAuthenticated ? "#444" : "#555")};
    svg {
      color: ${(props) => (props.$isAuthenticated ? "#ff9500" : "#ffffff")};
    }
  }

  svg {
    color: #ffffff;
  }
`;

const CartBadge = styled.span`
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: #ff9500;
  color: white;
  font-size: 12px;
  font-weight: bold;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Isadora Cyr", sans-serif;
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
