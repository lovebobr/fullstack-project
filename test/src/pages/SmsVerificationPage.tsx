import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { PATHS } from "../paths";
import {
  Container,
  VerificationCard,
  Title,
  Subtitle,
  PaymentInfo,
  InfoRow,
  InfoLabel,
  InfoValue,
  CodeDisplay,
  CodeLabel,
  GeneratedCode,
  Instruction,
  InputContainer,
  InputLabel,
  SmsInput,
  Button,
  Timer,
  ResendLink,
} from "../styled/SmsVerification.styles";

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
  bookingData: BookingData;
  paymentData: PaymentData;
  generatedSmsCode: string;
}

const SmsVerificationPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [smsCode, setSmsCode] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(60);
  const [canResend, setCanResend] = useState<boolean>(false);
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [generatedSmsCode, setGeneratedSmsCode] = useState<string>("");

  useEffect(() => {
    if (location.state) {
      const state = location.state as LocationState;
      setBookingData(state.bookingData);
      setPaymentData(state.paymentData);
      setGeneratedSmsCode(state.generatedSmsCode);
    } else {
      navigate(PATHS.PAYMENT);
    }

    const countdown = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, [location.state, navigate]);

  const verifyCode = async (code: string) => {
    setLoading(true);

    // Валидация кода
    if (code.length !== 3 || !/^\d{3}$/.test(code)) {
      alert("Неверный формат кода. Введите 3 цифры");
      setLoading(false);
      return;
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (code === generatedSmsCode) {
        navigate(PATHS.PAYMENT_RESULT, {
          state: {
            success: true,
            paymentId:
              "PAY_" + Math.random().toString(36).substr(2, 9).toUpperCase(),
            bookingData: bookingData,
            paymentData: paymentData,
          },
        });
      } else {
        alert("Неверный код подтверждения");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(`Ошибка подтверждения: ${error.message}`);
      } else {
        alert("Произошла неизвестная ошибка");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await verifyCode(smsCode);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    const value = input.value.replace(/\D/g, "").slice(0, 3); 

    setSmsCode(value);

   
    if (value.length === 3) {
      
      setTimeout(() => {
        input.blur();
      }, 0);

      setTimeout(() => {
        verifyCode(value);
      }, 500);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
 
    if (smsCode.length >= 3 && e.key !== "Backspace" && e.key !== "Delete") {
      e.preventDefault();
    }
  };

  const handleResendCode = () => {
    setTimer(60);
    setCanResend(false);
    setSmsCode("");
    setGeneratedSmsCode(Math.floor(100 + Math.random() * 900).toString());
    alert("Новый код отправлен");
  };

  if (!bookingData || !paymentData) {
    return (
      <Container>
        <VerificationCard>
          <div>Загрузка...</div>
        </VerificationCard>
      </Container>
    );
  }

  return (
    <Container>
      <VerificationCard>
        <Title>Подтверждение платежа</Title>
        <Subtitle>
          Для завершения оплаты введите код подтверждения, отправленный в SMS
          сообщении
        </Subtitle>

        <PaymentInfo>
          <InfoRow>
            <InfoLabel>Ресторан:</InfoLabel>
            <InfoValue>{bookingData.restaurant}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>Бронирование:</InfoLabel>
            <InfoValue>#{bookingData.bookingId}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>Сумма:</InfoLabel>
            <InfoValue>
              {paymentData.amount} {paymentData.currency}
            </InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>Карта:</InfoLabel>
            <InfoValue>**** {paymentData.cardLastFour}</InfoValue>
          </InfoRow>
        </PaymentInfo>

        <CodeDisplay>
          <CodeLabel>Тестовый код подтверждения</CodeLabel>
          <GeneratedCode>{generatedSmsCode}</GeneratedCode>
          <Instruction>Используйте этот код для тестирования</Instruction>
        </CodeDisplay>

        <form onSubmit={handleSubmit}>
          <InputContainer>
            <InputLabel>Введите код из SMS</InputLabel>
            <SmsInput
              type="text"
              value={smsCode}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="000"
              maxLength={3}
              inputMode="numeric"
              pattern="[0-9]*"
              autoFocus
            />
          </InputContainer>

          <Button type="submit" disabled={loading || smsCode.length !== 3}>
            {loading ? "Проверка..." : "Подтвердить платеж"}
          </Button>
        </form>

        <Timer>
          {timer > 0
            ? `Запросить новый код можно через ${timer} сек.`
            : "Можно запросить новый код"}
        </Timer>

        <ResendLink onClick={handleResendCode} disabled={!canResend}>
          Отправить код повторно
        </ResendLink>
      </VerificationCard>
    </Container>
  );
};

export default SmsVerificationPage;
