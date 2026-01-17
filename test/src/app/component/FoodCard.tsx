import React, { useState } from "react";
import styled from "styled-components";
import { Plus, Minus, Image as ImageIcon } from "lucide-react";
import { useCart } from "../../CartProvider";

interface FoodCardProps {
  food: {
    id: number;
    name: string;
    image_url: string;
    calories?: number;
    ingredients?: string;
    price: number | string;
  };
  onAddToCart?: (food: any) => void;
}

export const FoodCard: React.FC<FoodCardProps> = ({ food, onAddToCart }) => {
  const { addItem, decreaseQuantity, increaseQuantity, items } = useCart();
  const [isAnimating, setIsAnimating] = useState(false);
  const [imageError, setImageError] = useState(false);

  const cartItem = items.find((item) => item.id === food.id);
  const itemCount = cartItem?.quantity || 0;

  const handleAddClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const price =
      typeof food.price === "string" ? parseFloat(food.price) : food.price;

    addItem({
      id: food.id,
      name: food.name,
      price: price,
      image: food.image_url,
      description: food.ingredients,
      food_id: food.id,
    });

    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);

    if (onAddToCart) {
      onAddToCart(food);
    }
  };

  const handleIncrease = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    increaseQuantity(food.id);
  };

  const handleDecrease = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (itemCount > 1) {
      decreaseQuantity(food.id);
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const price =
    typeof food.price === "string" ? parseFloat(food.price) : food.price;

  const hasImage = food.image_url && !imageError;

  return (
    <Card>
      <ImageContainer>
        {hasImage ? (
          <FoodImage
            src={food.image_url}
            alt={food.name}
            onError={handleImageError}
          />
        ) : (
          <ImagePlaceholder>
            <ImageIcon size={48} color="#666" />
            <PlaceholderText>Нет изображения</PlaceholderText>
          </ImagePlaceholder>
        )}
        {food.calories && <CaloriesBadge>{food.calories} ккал</CaloriesBadge>}
        {isAnimating && <AddAnimation>+1</AddAnimation>}
      </ImageContainer>

      <ContentWrapper>
        <CardContent>
          <FoodName>{food.name}</FoodName>
          {food.ingredients && <Ingredients>{food.ingredients}</Ingredients>}
        </CardContent>

        <StickyFooter>
          <Price>{price}₽</Price>

          {itemCount > 0 ? (
            <Stepper>
              <StepperButton onClick={handleDecrease} disabled={itemCount <= 1}>
                <Minus size={16} />
              </StepperButton>

              <CountContainer>
                <Count>{itemCount}</Count>
                <CountLabel>шт.</CountLabel>
              </CountContainer>

              <StepperButton onClick={handleIncrease}>
                <Plus size={16} />
              </StepperButton>
            </Stepper>
          ) : (
            <AddButton onClick={handleAddClick}>
              <Plus size={18} />В корзину
            </AddButton>
          )}
        </StickyFooter>
      </ContentWrapper>
    </Card>
  );
};

const Card = styled.div`
  background: rgba(40, 40, 40, 0.8);
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(255, 149, 0, 0.2);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 100%;

  &:hover {
    transform: translateY(-4px);
    border-color: rgba(255, 149, 0, 0.4);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
  }
`;

const ImageContainer = styled.div`
  position: relative;
  height: 200px;
  overflow: hidden;
  flex-shrink: 0;
`;

const FoodImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ImagePlaceholder = styled.div`
  width: 100%;
  height: 100%;
  background: rgba(60, 60, 60, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #888;
`;

const PlaceholderText = styled.div`
  margin-top: 8px;
  font-size: 0.9rem;
  color: #aaa;
`;

const CaloriesBadge = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.7);
  color: #ff9500;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  z-index: 2;
`;

const AddAnimation = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(255, 149, 0, 0.9);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 700;
  font-size: 1.2rem;
  animation: pulse 0.3s ease-out;
  z-index: 3;

  @keyframes pulse {
    0% {
      opacity: 0;
      transform: translate(-50%, -50%) scale(0.5);
    }
    70% {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1.2);
    }
    100% {
      opacity: 0;
      transform: translate(-50%, -50%) scale(1);
    }
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  min-height: 0;
`;

const CardContent = styled.div`
  padding: 1.5rem;
  flex-grow: 1;
  overflow: hidden;
`;

const FoodName = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0 0 0.75rem 0;
  color: #ffffff;
  line-height: 1.3;
`;

const Ingredients = styled.p`
  font-size: 0.9rem;
  color: #aaaaaa;
  margin: 0;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  max-height: 6rem;
`;

const StickyFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  padding-top: 0;
  margin-top: auto;
  position: sticky;
  bottom: 0;
  flex-shrink: 0;
`;

const Price = styled.div`
  font-size: 1.3rem;
  font-weight: 700;
  color: #ff9500;
`;

const Stepper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 149, 0, 0.1);
  border-radius: 8px;
  padding: 4px;
  min-width: 120px;
  justify-content: space-between;
`;

const StepperButton = styled.button`
  background: rgba(255, 149, 0, 0.2);
  color: white;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s;
  flex-shrink: 0;

  &:hover:not(:disabled) {
    background: rgba(255, 149, 0, 0.3);
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;

const CountContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 40px;
  flex-shrink: 0;
`;

const Count = styled.div`
  font-size: 1.1rem;
  font-weight: 700;
  color: #ff9500;
`;

const CountLabel = styled.div`
  font-size: 0.7rem;
  color: #aaaaaa;
  margin-top: -2px;
  letter-spacing: 0.5px;
`;

const AddButton = styled.button`
  background: linear-gradient(135deg, #ff9500 0%, #ff6b00 100%);
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.3s;
  min-width: 120px;
  justify-content: center;

  &:hover {
    background: linear-gradient(135deg, #ffa733 0%, #ff852e 100%);
    transform: translateY(-2px);
  }
`;
