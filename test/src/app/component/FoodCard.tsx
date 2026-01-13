import React from "react";
import styled from "styled-components";
import { Plus } from "lucide-react";

interface FoodCardProps {
  food: {
    id: number;
    name: string;
    image_url: string;
    calories?: number;
    ingredients?: string;
    price: number | string; 
  };
  onAddToCart: (food: any) => void;
}

export const FoodCard: React.FC<FoodCardProps> = ({ food, onAddToCart }) => {
  const handleAddClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart(food);
  };

  const price =
    typeof food.price === "string" ? parseFloat(food.price) : food.price;

  return (
    <Card>
      <ImageContainer>
        <FoodImage src={food.image_url} alt={food.name} />
        {food.calories && <CaloriesBadge>{food.calories} ккал</CaloriesBadge>}
      </ImageContainer>

      <CardContent>
        <FoodName>{food.name}</FoodName>

        {food.ingredients && <Ingredients>{food.ingredients}</Ingredients>}

        <CardFooter>
          <Price>${price.toFixed(2)}</Price> 
          <AddButton onClick={handleAddClick}>
            <Plus size={18} />В корзину
          </AddButton>
        </CardFooter>
      </CardContent>
    </Card>
  );
};

const Card = styled.div`
  background: rgba(40, 40, 40, 0.8);
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(255, 149, 0, 0.2);
  transition: all 0.3s ease;

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
`;

const FoodImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
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
`;

const CardContent = styled.div`
  padding: 1.5rem;
`;

const FoodName = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0 0 0.75rem 0;
  color: #ffffff;
`;

const Ingredients = styled.p`
  font-size: 0.9rem;
  color: #aaaaaa;
  margin: 0 0 1.25rem 0;
  line-height: 1.5;
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Price = styled.div`
  font-size: 1.3rem;
  font-weight: 700;
  color: #ff9500;
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

  &:hover {
    background: linear-gradient(135deg, #ffa733 0%, #ff852e 100%);
    transform: translateY(-2px);
  }
`;
