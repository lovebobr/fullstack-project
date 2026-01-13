import React, { useState, useRef, useMemo, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../shared/lib/axios";
import {
  Container,
  Header,
  MainTitle,
  Subtitle,
  TwoColumnLayout,
  OrderSummary,
  OrderHeader,
  OrderIcon,
  OrderTitle,
  OrderGrid,
  OrderItem,
  OrderLabel,
  OrderValue,
  OrderTotal,
  TotalLabel,
  TotalAmount,
  CardColumn,
  InteractivePaymentCard,
  CardBackground,
  CardContent,
  CardHeader,
  CardTitle,
  CardChip,
  CardNumberSection,
  CardNumberInput,
  CardDetailsSection,
  CardDetailGroup,
  CardDetailLabel,
  ExpiryInput,
  CvcInput,
  CheckboxGroup,
  Checkbox,
  CheckboxLabel,
  Button,
  ButtonContainer,
} from "../styled/Payment.styles";
import { PATHS } from "../paths";
import {
  ReservationService,
  type Reservation,
} from "../api/reservation.service";
import { restaurantStore } from "../app/store/restaurant.store";

interface PaymentData {
  cardNumber: string;
  cardExpMonth: string;
  cardExpYear: string;
  cardCvc: string;
  saveCard: boolean;
}

const PaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const reservationId = searchParams.get("reservation_id");

  const [bookingData, setBookingData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [pageLoading, setPageLoading] = useState<boolean>(true);

  // Функция для правильного отображения количества гостей
  const getGuestsText = (count: number): string => {
    if (count === 1) return "1 человек";
    if (count >= 2 && count <= 4) return `${count} человека`;
    return `${count} человек`;
  };

  useEffect(() => {
    const loadBookingData = async () => {
      if (!reservationId) {
        setPageLoading(false);
        return;
      }

      try {
        const reservation: Reservation = await ReservationService.getById(
          parseInt(reservationId)
        );

        // Получаем название ресторана
        let restaurantName = "Ресторан";
        let guestsCount = 2;
        let tableNumber = "1";

        // Вариант 1: Если в резервации есть объект ресторана
        if (reservation.restaurant?.name) {
          restaurantName = reservation.restaurant.name;
        }
        // Вариант 2: Если есть restaurant_id в резервации
        else if (reservation.restaurant_id) {
          try {
            await restaurantStore.loadRestaurant(reservation.restaurant_id);
            const restaurant = restaurantStore.currentRestaurant;
            if (restaurant?.name) {
              restaurantName = restaurant.name;
            }
          } catch (error) {
            console.error("Ошибка загрузки ресторана:", error);
          }
        }
        // Вариант 3: Если есть restaurant_id в таблице
        else if (reservation.table?.restaurant_id) {
          try {
            await restaurantStore.loadRestaurant(
              reservation.table.restaurant_id
            );
            const restaurant = restaurantStore.currentRestaurant;
            if (restaurant?.name) {
              restaurantName = restaurant.name;
            }
          } catch (error) {
            console.error("Ошибка загрузки ресторана:", error);
          }
        }

        // Получаем количество гостей
        if (reservation.guests_count) {
          guestsCount = reservation.guests_count;
        }

        // Получаем номер стола
        if (reservation.table?.number) {
          tableNumber = reservation.table.number.toString();
        }

        setBookingData({
          reservation_id: parseInt(reservationId),
          restaurant: restaurantName,
          date: new Date(reservation.date_time).toLocaleDateString("ru-RU"),
          time: new Date(reservation.date_time).toLocaleTimeString("ru-RU", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          guests: guestsCount,
          tableNumber: tableNumber,
          bookingId: `RES_${reservationId}`,
          amount: 1500,
          guests_text: getGuestsText(guestsCount),
        });
      } catch (error) {
        console.error("Ошибка загрузки данных бронирования:", error);

        // Fallback если API не отвечает
        setBookingData({
          reservation_id: parseInt(reservationId),
          restaurant: "Ресторан",
          date: new Date().toLocaleDateString("ru-RU"),
          time: "19:00",
          guests: 2,
          tableNumber: "1",
          bookingId: `RES_${reservationId}`,
          amount: 1500,
          guests_text: "2 человека",
        });
      } finally {
        setPageLoading(false);
      }
    };

    loadBookingData();
  }, [reservationId]);

  const [formData, setFormData] = useState<PaymentData>({
    cardNumber: "",
    cardExpMonth: "",
    cardExpYear: "",
    cardCvc: "",
    saveCard: false,
  });

  const cardNumberRef = useRef<HTMLInputElement>(null);
  const expMonthRef = useRef<HTMLInputElement>(null);
  const expYearRef = useRef<HTMLInputElement>(null);
  const cvcRef = useRef<HTMLInputElement>(null);

  const detectCardBrand = (cardNumber: string): string => {
    const cleanNumber = cardNumber.replace(/\s/g, "");

    if (cleanNumber.startsWith("4")) return "visa";
    if (
      cleanNumber.startsWith("5") &&
      cleanNumber[1] >= "1" &&
      cleanNumber[1] <= "5"
    )
      return "mastercard";
    if (
      cleanNumber.startsWith("2200") ||
      cleanNumber.startsWith("2201") ||
      cleanNumber.startsWith("2202") ||
      cleanNumber.startsWith("2203") ||
      cleanNumber.startsWith("2204")
    )
      return "mir";
    if (cleanNumber.startsWith("34") || cleanNumber.startsWith("37"))
      return "amex";
    if (
      cleanNumber.startsWith("6011") ||
      cleanNumber.startsWith("65") ||
      (cleanNumber.startsWith("64") &&
        cleanNumber[2] >= "4" &&
        cleanNumber[2] <= "9")
    )
      return "discover";

    return "unknown";
  };

  const cardType = useMemo(() => {
    const cleanNumber = formData.cardNumber.replace(/\s/g, "");
    if (cleanNumber.length < 2) return "unknown";
    return detectCardBrand(cleanNumber);
  }, [formData.cardNumber]);

  const getCardDisplayName = (type: string): string => {
    switch (type) {
      case "visa":
        return "VISA";
      case "mastercard":
        return "MasterCard";
      case "mir":
        return "МИР";
      case "amex":
        return "AMEX";
      case "discover":
        return "Discover";
      default:
        return "VISA";
    }
  };

  const formatCardNumber = (value: string): string => {
    const cleanValue = value.replace(/\D/g, "");
    const formatted = cleanValue.replace(/(.{4})/g, "$1 ").trim();
    return formatted.slice(0, 19);
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const cursorPosition = e.target.selectionStart || 0;

    const formatted = formatCardNumber(input);
    setFormData((prev) => ({
      ...prev,
      cardNumber: formatted,
    }));

    setTimeout(() => {
      if (cardNumberRef.current) {
        let newCursorPosition = cursorPosition;

        if (formatted.length > input.length && cursorPosition > 0) {
          const addedSpaces = formatted.length - input.length;
          newCursorPosition = cursorPosition + addedSpaces;
        }

        cardNumberRef.current.setSelectionRange(
          newCursorPosition,
          newCursorPosition
        );
      }
    }, 0);

    if (formatted.replace(/\s/g, "").length === 16) {
      expMonthRef.current?.focus();
    }
  };

  const handleExpMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 2);
    setFormData((prev) => ({
      ...prev,
      cardExpMonth: value,
    }));

    if (value.length === 2) {
      expYearRef.current?.focus();
    }
  };

  const handleExpYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 2);
    setFormData((prev) => ({
      ...prev,
      cardExpYear: value,
    }));

    if (value.length === 2) {
      cvcRef.current?.focus();
    }
  };

  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 3);
    setFormData((prev) => ({
      ...prev,
      cardCvc: value,
    }));
  };

  const validateCardNumber = (cardNumber: string): boolean => {
    const cleanNumber = cardNumber.replace(/\s/g, "");

    let sum = 0;
    let isEven = false;

    for (let i = cleanNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cleanNumber[i]);

      if (isEven) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }

      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0;
  };

  const validateExpiry = (month: string, year: string): boolean => {
    if (!month || !year || month.length !== 2 || year.length !== 2) {
      return false;
    }

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    const expMonth = parseInt(month);
    const expYear = parseInt(year);

    const fullExpYear = 2000 + expYear;

    if (expMonth < 1 || expMonth > 12) return false;
    if (fullExpYear < currentYear) return false;
    if (fullExpYear === currentYear && expMonth < currentMonth) return false;

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!bookingData?.reservation_id) {
      alert("Ошибка: данные бронирования не загружены");
      return;
    }

    setLoading(true);

    try {
      const cleanCardNumber = formData.cardNumber.replace(/\s/g, "");

      if (!cleanCardNumber || cleanCardNumber.length < 13) {
        alert("Неверный номер карты");
        setLoading(false);
        return;
      }

      if (!validateCardNumber(cleanCardNumber)) {
        alert("Неверный номер карты");
        setLoading(false);
        return;
      }

      if (!validateExpiry(formData.cardExpMonth, formData.cardExpYear)) {
        alert("Неверный срок действия карты");
        setLoading(false);
        return;
      }

      if (!formData.cardCvc || formData.cardCvc.length !== 3) {
        alert("Введите корректный CVC код (3 цифры)");
        setLoading(false);
        return;
      }

      const fullYear = 2000 + parseInt(formData.cardExpYear);

      const paymentPayload = {
        reservation_id: bookingData.reservation_id,
        amount: bookingData.amount,
        currency: "RUB",
        card_number: cleanCardNumber,
        card_exp_month: parseInt(formData.cardExpMonth),
        card_exp_year: fullYear,
        card_cvc: formData.cardCvc,
        save_card: formData.saveCard,
      };

      const response = await api.post("/payments", paymentPayload);

      navigate(PATHS.SMS_VERIFICATION, {
        state: {
          bookingData: bookingData,
          paymentData: {
            cardNumber: cleanCardNumber,
            cardLastFour: cleanCardNumber.slice(-4),
            amount: bookingData.amount,
            currency: "RUB",
          },
          verificationToken: response.data.verification_token,
          paymentId: response.data.payment_id,
          generatedSmsCode: response.data.sms_code,
        },
      });
    } catch (error: any) {
      console.error("Ошибка при выполнении платежа:", error);

      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        if (errors.reservation_id) {
          alert(`Ошибка бронирования: ${errors.reservation_id[0]}`);
        } else {
          alert(`Ошибка оплаты: ${JSON.stringify(errors)}`);
        }
      } else if (error.response?.data?.message) {
        alert(`Ошибка оплаты: ${error.response.data.message}`);
      } else {
        alert("Произошла неизвестная ошибка при обработке платежа");
      }
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <Container>
        <Header>
          <MainTitle>Загрузка...</MainTitle>
          <Subtitle>Получаем данные бронирования</Subtitle>
        </Header>
      </Container>
    );
  }

  if (!reservationId) {
    return (
      <Container>
        <Header>
          <MainTitle>Ошибка</MainTitle>
          <Subtitle>ID бронирования не указан</Subtitle>
        </Header>
        <p>Вернитесь на страницу бронирования и попробуйте снова.</p>
      </Container>
    );
  }

  if (!bookingData) {
    return (
      <Container>
        <Header>
          <MainTitle>Ошибка</MainTitle>
          <Subtitle>Не удалось загрузить данные бронирования</Subtitle>
        </Header>
        <p>Бронирование с ID {reservationId} не найдено.</p>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <MainTitle>Оплата бронирования #{bookingData.bookingId}</MainTitle>
        <Subtitle>Введите данные карты для завершения оплаты</Subtitle>
      </Header>

      <TwoColumnLayout>
        <OrderSummary>
          <OrderHeader>
            <OrderTitle>Детали бронирования</OrderTitle>
          </OrderHeader>
          <OrderGrid>
            <OrderItem>
              <OrderLabel>Ресторан</OrderLabel>
              <OrderValue>{bookingData.restaurant}</OrderValue>
            </OrderItem>
            <OrderItem>
              <OrderLabel>Дата</OrderLabel>
              <OrderValue>{bookingData.date}</OrderValue>
            </OrderItem>
            <OrderItem>
              <OrderLabel>Время</OrderLabel>
              <OrderValue>{bookingData.time}</OrderValue>
            </OrderItem>
            <OrderItem>
              <OrderLabel>Гости</OrderLabel>
              <OrderValue>{bookingData.guests_text}</OrderValue>
            </OrderItem>
            <OrderItem>
              <OrderLabel>Стол</OrderLabel>
              <OrderValue>№{bookingData.tableNumber}</OrderValue>
            </OrderItem>
            <OrderItem>
              <OrderLabel>Бронь №</OrderLabel>
              <OrderValue>{bookingData.bookingId}</OrderValue>
            </OrderItem>
            <OrderTotal>
              <TotalLabel>Итого к оплате</TotalLabel>
              <TotalAmount>{bookingData.amount} ₽</TotalAmount>
            </OrderTotal>
          </OrderGrid>
        </OrderSummary>

        <CardColumn>
          <InteractivePaymentCard>
            <CardBackground />
            <CardContent>
              <CardHeader>
                <CardTitle>{getCardDisplayName(cardType)}</CardTitle>
                <CardChip />
              </CardHeader>

              <CardNumberSection>
                <CardNumberInput
                  ref={cardNumberRef}
                  type="text"
                  value={formData.cardNumber}
                  onChange={handleCardNumberChange}
                  placeholder="0000 0000 0000 0000"
                  maxLength={19}
                  required
                />
              </CardNumberSection>

              <CardDetailsSection>
                <CardDetailGroup>
                  <CardDetailLabel>Срок действия</CardDetailLabel>
                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      alignItems: "center",
                    }}
                  >
                    <ExpiryInput
                      ref={expMonthRef}
                      type="text"
                      value={formData.cardExpMonth}
                      onChange={handleExpMonthChange}
                      placeholder="ММ"
                      maxLength={2}
                      required
                    />
                    <span style={{ opacity: 0.7 }}>/</span>
                    <ExpiryInput
                      ref={expYearRef}
                      type="text"
                      value={formData.cardExpYear}
                      onChange={handleExpYearChange}
                      placeholder="ГГ"
                      maxLength={2}
                      required
                    />
                  </div>
                </CardDetailGroup>

                <CardDetailGroup>
                  <CardDetailLabel>CVC</CardDetailLabel>
                  <CvcInput
                    ref={cvcRef}
                    type="text"
                    value={formData.cardCvc}
                    onChange={handleCvcChange}
                    placeholder="000"
                    maxLength={3}
                    required
                  />
                </CardDetailGroup>
              </CardDetailsSection>
            </CardContent>
          </InteractivePaymentCard>

          <CheckboxGroup>
            <Checkbox
              type="checkbox"
              checked={formData.saveCard}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData((prev) => ({
                  ...prev,
                  saveCard: e.target.checked,
                }))
              }
              id="saveCard"
            />
            <CheckboxLabel htmlFor="saveCard">
              Сохранить карту для будущих платежей
            </CheckboxLabel>
          </CheckboxGroup>
        </CardColumn>
      </TwoColumnLayout>

      <ButtonContainer>
        <Button type="submit" onClick={handleSubmit} disabled={loading}>
          {loading ? "Обработка..." : `Оплатить ${bookingData.amount} ₽`}
        </Button>
      </ButtonContainer>
    </Container>
  );
};

export default PaymentPage;
