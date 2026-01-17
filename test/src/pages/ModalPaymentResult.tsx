import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { PATHS } from "../paths";
import {
  Container,
  SuccessModal,
  AnimatedCheckmark,
  Title,
  PaymentDetails,
  DetailRow,
  DetailLabel,
  DetailValue,
  AmountHighlight,
  ButtonGroup,
  PrimaryButton,
  SecondaryButton,
} from "../styled/ModalPayment.styles";

interface BookingData {
  restaurant: string;
  date: string;
  time: string;
  guests: number;
  tableNumber: string;
  bookingId: string;
  amount: number;
}

interface PaymentData {
  cardNumber: string;
  cardLastFour: string;
  amount: number;
  currency: string;
}

interface LocationState {
  success: boolean;
  paymentId: string;
  bookingData: BookingData;
  paymentData: PaymentData;
}

const ModalPaymentResult: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [paymentId, setPaymentId] = useState<string>("");

  useEffect(() => {
    if (location.state) {
      const state = location.state as LocationState;
      if (state.success) {
        setBookingData(state.bookingData);
        setPaymentData(state.paymentData);
        setPaymentId(state.paymentId);
      } else {
        navigate(PATHS.PAYMENT);
      }
    } else {
      navigate(PATHS.PAYMENT);
    }
  }, [location.state, navigate]);

  const handleNewBooking = () => {
    navigate(PATHS.HOME);
  };

  const handleViewBookings = () => {
    navigate(PATHS.PROFILE);
  };

  if (!bookingData || !paymentData) {
    return (
      <Container>
        <div>Загрузка...</div>
      </Container>
    );
  }

  return (
    <Container>
      <SuccessModal>
        <AnimatedCheckmark viewBox="0 0 52 52">
          <circle
            className="checkmark__circle"
            cx="26"
            cy="26"
            r="25"
            fill="none"
          />
          <path
            className="checkmark__check"
            fill="none"
            d="M14.1 27.2l7.1 7.2 16.7-16.8"
          />
        </AnimatedCheckmark>

        <Title>Оплата прошла успешно!</Title>

        <AmountHighlight>
          {paymentData.amount} {paymentData.currency}
        </AmountHighlight>

        <PaymentDetails>
          <DetailRow>
            <DetailLabel>Номер платежа:</DetailLabel>
            <DetailValue>{paymentId}</DetailValue>
          </DetailRow>
          <DetailRow>
            <DetailLabel>Ресторан:</DetailLabel>
            <DetailValue>{bookingData.restaurant}</DetailValue>
          </DetailRow>
          <DetailRow>
            <DetailLabel>Дата и время:</DetailLabel>
            <DetailValue>
              {bookingData.date} в {bookingData.time}
            </DetailValue>
          </DetailRow>
          <DetailRow>
            <DetailLabel>Стол:</DetailLabel>
            <DetailValue>№{bookingData.tableNumber}</DetailValue>
          </DetailRow>
          <DetailRow>
            <DetailLabel>Количество гостей:</DetailLabel>
            <DetailValue>{bookingData.guests} человека</DetailValue>
          </DetailRow>
          <DetailRow>
            <DetailLabel>Карта:</DetailLabel>
            <DetailValue>**** {paymentData.cardLastFour}</DetailValue>
          </DetailRow>
        </PaymentDetails>

        <ButtonGroup>
          <SecondaryButton onClick={handleNewBooking}>
            На главную
          </SecondaryButton>
          <PrimaryButton onClick={handleViewBookings}>Профиль</PrimaryButton>
        </ButtonGroup>
      </SuccessModal>
    </Container>
  );
};

export default ModalPaymentResult;
