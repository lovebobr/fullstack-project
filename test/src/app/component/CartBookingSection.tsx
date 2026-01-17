import React, { useState } from "react";
import styled from "styled-components";
import {
  ShoppingBag,
  ChevronDown,
  ChevronUp,
  Plus,
  Minus,
  Trash2,
} from "lucide-react";
import { useCart } from "../../CartProvider";

export const CartBookingSection: React.FC = () => {
  const { items, totalPrice, removeItem, increaseQuantity, decreaseQuantity } =
    useCart();
  const [isExpanded, setIsExpanded] = useState(true);

  const depositAmount = 2000;
  const finalAmount = Math.max(totalPrice, depositAmount);
  const isAdditionalPayment = totalPrice > depositAmount;
  const additionalPayment = isAdditionalPayment
    ? totalPrice - depositAmount
    : 0;

  const formatPrice = (price: number) => price + " ₽";

  if (items.length === 0) {
    return (
      <EmptyCartSection>
        <ShoppingBag size={48} color="#666" />
        <EmptyText>Ваша корзина пуста</EmptyText>
        <EmptySubtext>Выберите блюда в меню</EmptySubtext>
      </EmptyCartSection>
    );
  }

  return (
    <CartSection>
      <SectionHeader onClick={() => setIsExpanded(!isExpanded)}>
        <HeaderLeft>
          <ShoppingBag size={20} />
          <HeaderTitle>Ваш заказ ({items.length})</HeaderTitle>
        </HeaderLeft>
        <HeaderRight>
          <HeaderTotal>{formatPrice(finalAmount)}</HeaderTotal>
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </HeaderRight>
      </SectionHeader>

      {isExpanded && (
        <>
          <CartItems>
            {items.map((item) => (
              <CartItem key={item.id}>
                <ItemLeft>
                  <ItemName>{item.name}</ItemName>
                </ItemLeft>

                <ItemRight>
                  <QuantitySection>
                    <QuantityControl>
                      <QuantityButton
                        onClick={(e) => {
                          e.stopPropagation();
                          decreaseQuantity(item.id);
                        }}
                      >
                        <Minus size={12} />
                      </QuantityButton>
                      <QuantityValue>{item.quantity}</QuantityValue>
                      <QuantityButton
                        onClick={(e) => {
                          e.stopPropagation();
                          increaseQuantity(item.id);
                        }}
                      >
                        <Plus size={12} />
                      </QuantityButton>
                    </QuantityControl>

                    <ItemPrice>
                      {formatPrice(item.price * item.quantity)}
                    </ItemPrice>
                  </QuantitySection>

                  <RemoveButton
                    onClick={(e) => {
                      e.stopPropagation();
                      removeItem(item.id);
                    }}
                  >
                    <Trash2 size={14} />
                  </RemoveButton>
                </ItemRight>
              </CartItem>
            ))}
          </CartItems>

          <Summary>
            <SummaryRow>
              <span>Сумма заказа</span>
              <span>{formatPrice(totalPrice)}</span>
            </SummaryRow>

            <SummaryRow>
              <span>Депозит за стол</span>
              <span>{formatPrice(depositAmount)}</span>
            </SummaryRow>

            <Divider />

            <TotalRow>
              <span>Итого к оплате</span>
              <TotalAmount>{formatPrice(finalAmount)}</TotalAmount>
            </TotalRow>

            {!isAdditionalPayment && totalPrice < depositAmount && (
              <RemainingNote>
                Остаток {formatPrice(depositAmount - totalPrice)} будет доступен
                для заказа в ресторане
              </RemainingNote>
            )}
          </Summary>
        </>
      )}
    </CartSection>
  );
};

// Стили компонента
const EmptyCartSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  background: rgba(40, 40, 40, 0.8);
  border-radius: 12px;
  border: 1px solid rgba(255, 149, 0, 0.2);
  text-align: center;
  margin-top: 24px;
`;

const EmptyText = styled.div`
  margin-top: 16px;
  font-size: 18px;
  font-weight: 600;
  color: #ffffff;
`;

const EmptySubtext = styled.div`
  margin-top: 8px;
  font-size: 14px;
  color: #aaaaaa;
`;

const CartSection = styled.div`
  margin-top: 24px;
  background: rgba(40, 40, 40, 0.8);
  border-radius: 12px;
  border: 1px solid rgba(255, 149, 0, 0.2);
  overflow: hidden;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: rgba(60, 60, 60, 0.8);
  }
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const HeaderTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #ffffff;
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const HeaderTotal = styled.span`
  font-size: 20px;
  font-weight: 700;
  color: #ff9500;
`;

const CartItems = styled.div`
  padding: 0 20px 20px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const CartItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 16px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);

  &:last-child {
    border-bottom: none;
  }
`;

const ItemLeft = styled.div`
  flex: 1;
  min-width: 0;
`;

const ItemName = styled.div`
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 4px;
`;

const ItemRight = styled.div`
  display: flex;
  align-content: stretch;
  flex-direction: row;
  gap: 16px;
`;

const QuantitySection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
`;

const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  padding: 4px;
`;

const QuantityButton = styled.button`
  width: 24px;
  height: 24px;
  border: none;
  border-radius: 4px;
  background: rgba(255, 149, 0, 0.2);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: rgba(255, 149, 0, 0.3);
  }

  svg {
    width: 12px;
    height: 12px;
  }
`;

const QuantityValue = styled.span`
  width: 24px;
  text-align: center;
  font-weight: 600;
  color: #ffffff;
  font-size: 14px;
`;

const ItemPrice = styled.div`
  font-weight: 600;
  color: #ff9500;
  font-size: 16px;
`;

const RemoveButton = styled.button`
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 6px;
  background: rgba(255, 59, 48, 0.1);
  color: #ff3b30;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: rgba(255, 59, 48, 0.2);
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;

const Summary = styled.div`
  padding: 20px;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  font-size: 14px;
  color: #cccccc;

  span:last-child {
    font-weight: 600;
    color: #ffffff;
  }
`;

const AdditionalPayment = styled.span`
  color: #ff9500 !important;
  font-weight: 600;
`;

const Divider = styled.div`
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  margin: 16px 0;
`;

const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
  font-weight: 600;
  color: #ffffff;
`;

const TotalAmount = styled.span`
  font-size: 24px;
  font-weight: 700;
  color: #ff9500;
`;

const RemainingNote = styled.div`
  margin-top: 12px;
  padding: 10px;
  background: rgba(255, 149, 0, 0.1);
  border-radius: 6px;
  font-size: 13px;
  color: #ff9500;
  text-align: center;
  border: 1px solid rgba(255, 149, 0, 0.2);
`;
