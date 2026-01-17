import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { PATHS } from "../paths";
import { api } from "../shared/lib/axios";
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
} from "../styled/SmsVerification.styles";

interface BookingData {
  reservation_id: number;
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
  verificationToken: string;
  paymentId: string;
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
  const [verificationToken, setVerificationToken] = useState<string>("");
  const [paymentId, setPaymentId] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    if (location.state) {
      const state = location.state as LocationState;
      console.log("State received:", state);

      setBookingData(state.bookingData);
      setPaymentData(state.paymentData);
      setGeneratedSmsCode(state.generatedSmsCode || "");
      setVerificationToken(state.verificationToken || "");
      setPaymentId(state.paymentId || "");
    } else {
      console.error("No state in location!");
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
    setErrorMessage("");

    if (code.length !== 3 || !/^\d{3}$/.test(code)) {
      setErrorMessage("Неверный формат кода. Введите 3 цифры");
      setLoading(false);
      return;
    }

    if (!verificationToken) {
      setErrorMessage("Ошибка: отсутствует токен верификации");
      setLoading(false);
      return;
    }

    if (!paymentId) {
      setErrorMessage("Ошибка: отсутствует ID платежа");
      setLoading(false);
      return;
    }

    try {
      console.log("Sending verification request:", {
        verification_token: verificationToken,
        sms_code: code,
        payment_id: paymentId,
      });

      const response = await api.post("/payments/verify-sms", {
        verification_token: verificationToken,
        sms_code: code,
        payment_id: parseInt(paymentId),
      });

      console.log("Server response:", response.data);

      if (response.data.success) {
        navigate(PATHS.PAYMENT_RESULT, {
          state: {
            success: true,
            result_token: response.data.result_token,
            paymentId: paymentId,
            bookingData: bookingData,
            paymentData: paymentData,
            message: "Платеж успешно подтвержден!",
          },
        });
      } else {
        setErrorMessage(`Ошибка: ${response.data.message || "Неверный код"}`);
      }
    } catch (error: any) {
      console.error("Verification error:", error);

      if (error.response?.status === 422) {
        const errorData = error.response.data;
        if (errorData.errors) {
          const errors = Object.values(errorData.errors).flat().join(", ");
          setErrorMessage(`Ошибка валидации: ${errors}`);
        } else if (errorData.message) {
          setErrorMessage(`Ошибка: ${errorData.message}`);
        }
      } else if (error.response?.status === 401) {
        setErrorMessage("Ошибка аутентификации. Пожалуйста, войдите снова.");
        setTimeout(() => navigate(PATHS.LOGIN), 2000);
      } else if (error.response?.data?.message) {
        setErrorMessage(`Ошибка: ${error.response.data.message}`);
      } else {
        setErrorMessage(
          "Произошла ошибка при проверке кода. Проверьте соединение."
        );
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
    const value = input.value.replace(/\D/g, "").slice(0, 3); // 3 цифры!

    setSmsCode(value);
    setErrorMessage("");
    if (value.length === 3) {
      setTimeout(() => {
        input.blur();
        verifyCode(value);
      }, 100);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (smsCode.length >= 3 && e.key !== "Backspace" && e.key !== "Delete") {
      e.preventDefault();
    }
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
          Для завершения оплаты введите 3-значный код подтверждения,
          отправленный в SMS
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
          <GeneratedCode>{generatedSmsCode || "..."}</GeneratedCode>
          <Instruction>
            Используйте этот 3-значный код для тестирования
          </Instruction>
        </CodeDisplay>

        <form onSubmit={handleSubmit}>
          <InputContainer>
            <InputLabel>Введите 3-значный код из SMS</InputLabel>
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
              disabled={loading}
            />
            {errorMessage && (
              <div
                style={{ color: "#ff4444", marginTop: "8px", fontSize: "14px" }}
              >
                {errorMessage}
              </div>
            )}
          </InputContainer>

          <Button type="submit" disabled={loading || smsCode.length !== 3}>
            {loading ? "Проверка..." : "Подтвердить платеж"}
          </Button>
        </form>

        <div
          style={{
            marginTop: "20px",
            fontSize: "12px",
            color: "#666",
            textAlign: "center",
          }}
        ></div>
      </VerificationCard>
    </Container>
  );
};

export default SmsVerificationPage;
