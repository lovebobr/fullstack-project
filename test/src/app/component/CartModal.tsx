import React from "react";
import styled from "styled-components";
import { X, Trash2, Plus, Minus, ShoppingBag, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "./Button";
import { useCart } from "../../CartProvider";

export const CartModal: React.FC = () => {
  const navigate = useNavigate();
  const {
    items,
    isOpen,
    totalItems,
    totalPrice,
    removeItem,
    increaseQuantity,
    decreaseQuantity,
    closeCart,
    getCartForApi,
  } = useCart();

  const handleClose = () => {
    closeCart();
  };

  const handleRemoveItem = (id: number) => {
    removeItem(id);
  };

  const handleBookTable = () => {
    // Получаем данные корзины для отправки на API
    const cartData = getCartForApi();
    console.log("📦 Данные корзины для API:", cartData);

    // Закрываем корзину и переходим к бронированию
    closeCart();
    navigate("/booking");
  };

  const handleContinueShopping = () => {
    closeCart();
    navigate("/menu");
  };

  const formatPrice = (price: number) => {
    return price.toFixed(2) + " ₽";
  };

  if (!isOpen) return null;

  console.log("🛒 Корзина открыта, товаров:", items.length);
  console.log("Товары в корзине:", items);

  return (
    <ModalOverlay onClick={handleClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <Title>
            <ShoppingBag size={24} />
            Корзина ({totalItems} товаров)
          </Title>
          <CloseButton onClick={handleClose}>
            <X size={24} />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          {items.length === 0 ? (
            <EmptyCart>
              <ShoppingBag size={64} color="#ccc" />
              <EmptyText>Корзина пуста</EmptyText>
              <Button onClick={handleContinueShopping} variant="primary">
                Перейти в меню
              </Button>
            </EmptyCart>
          ) : (
            <>
              <CartItems>
                {items.map((item) => (
                  <CartItem key={item.id}>
                    <ItemImage>
                      {item.image ? (
                        <img src={item.image} alt={item.name} />
                      ) : (
                        <div
                          style={{
                            width: "60px",
                            height: "60px",
                            backgroundColor: "#f5f5f5",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: "8px",
                          }}
                        >
                          <ShoppingBag size={24} color="#999" />
                        </div>
                      )}
                    </ItemImage>

                    <ItemDetails>
                      <ItemName>{item.name}</ItemName>
                      {item.description && (
                        <ItemDescription>{item.description}</ItemDescription>
                      )}
                      <ItemPrice>{formatPrice(item.price)}</ItemPrice>
                    </ItemDetails>

                    <ItemControls>
                      <QuantityControl>
                        <QuantityButton
                          onClick={() => decreaseQuantity(item.id)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={16} />
                        </QuantityButton>
                        <QuantityValue>{item.quantity}</QuantityValue>
                        <QuantityButton
                          onClick={() => increaseQuantity(item.id)}
                        >
                          <Plus size={16} />
                        </QuantityButton>
                      </QuantityControl>

                      <ItemTotal>
                        {formatPrice(item.price * item.quantity)}
                      </ItemTotal>

                      <RemoveButton onClick={() => handleRemoveItem(item.id)}>
                        <Trash2 size={18} />
                      </RemoveButton>
                    </ItemControls>
                  </CartItem>
                ))}
              </CartItems>

              <CartSummary>
                <SummaryRow>
                  <SummaryLabel>Товары:</SummaryLabel>
                  <SummaryValue>{formatPrice(totalPrice)}</SummaryValue>
                </SummaryRow>
                <SummaryRow>
                  <SummaryLabel>Доставка:</SummaryLabel>
                  <SummaryValue>Бесплатно</SummaryValue>
                </SummaryRow>
                <Divider />
                <SummaryRow>
                  <SummaryLabel>Итого:</SummaryLabel>
                  <TotalPrice>{formatPrice(totalPrice)}</TotalPrice>
                </SummaryRow>

                <ActionButtons>
                  <Button
                    onClick={handleContinueShopping}
                    variant="outline"
                    fullWidth
                  >
                    Продолжить покупки
                  </Button>
                  <Button onClick={handleBookTable} variant="primary" fullWidth>
                    <Calendar size={18} />
                    Забронировать стол
                  </Button>
                </ActionButtons>

                <BookingNote>
                  💡 Сумма заказа ({formatPrice(totalPrice)}) будет добавлена к
                  депозиту при бронировании стола
                </BookingNote>
              </CartSummary>
            </>
          )}
        </ModalBody>
      </ModalContent>
    </ModalOverlay>
  );
};

// Стили
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
  z-index: 1000;
  padding-top: 80px;
`;

const ModalContent = styled.div`
  background-color: white;
  width: 100%;
  max-width: 480px;
  height: calc(100vh - 80px);
  display: flex;
  flex-direction: column;
  border-radius: 12px 0 0 12px;
  box-shadow: -2px 0 20px rgba(0, 0, 0, 0.1);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #eaeaea;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 12px;
  color: #1a1a1a;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f5f5f5;
  }
`;

const ModalBody = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
`;

const EmptyCart = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  gap: 16px;
`;

const EmptyText = styled.p`
  font-size: 18px;
  color: #666;
  margin: 0;
`;

const CartItems = styled.div`
  flex: 1;
  overflow-y: auto;
  margin-bottom: 24px;
`;

const CartItem = styled.div`
  display: flex;
  gap: 16px;
  padding: 16px 0;
  border-bottom: 1px solid #eaeaea;

  &:last-child {
    border-bottom: none;
  }
`;

const ItemImage = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ItemDetails = styled.div`
  flex: 1;
`;

const ItemName = styled.h3`
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
`;

const ItemDescription = styled.p`
  margin: 0 0 8px 0;
  font-size: 14px;
  color: #666;
`;

const ItemPrice = styled.p`
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #ff9500;
`;

const ItemControls = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
`;

const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #f5f5f5;
  border-radius: 8px;
  padding: 4px;
`;

const QuantityButton = styled.button`
  background: none;
  border: none;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover:not(:disabled) {
    background-color: #e0e0e0;
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;

const QuantityValue = styled.span`
  font-size: 14px;
  font-weight: 600;
  min-width: 20px;
  text-align: center;
`;

const ItemTotal = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background-color 0.2s;
  color: #ff3b30;

  &:hover {
    background-color: rgba(255, 59, 48, 0.1);
  }
`;

const CartSummary = styled.div`
  border-top: 2px solid #eaeaea;
  padding-top: 24px;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const SummaryLabel = styled.span`
  font-size: 14px;
  color: #666;
`;

const SummaryValue = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
`;

const Divider = styled.div`
  height: 1px;
  background-color: #eaeaea;
  margin: 16px 0;
`;

const TotalPrice = styled.span`
  font-size: 20px;
  font-weight: 700;
  color: #1a1a1a;
`;

const ActionButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 24px;
`;

const BookingNote = styled.div`
  margin-top: 16px;
  padding: 12px;
  background-color: #f0f9ff;
  border-radius: 8px;
  border: 1px solid #b3e0ff;
  font-size: 14px;
  color: #0066cc;
`;

export default CartModal;
