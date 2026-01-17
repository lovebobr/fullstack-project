import { api } from "../shared/lib/axios";

export interface PaymentPayload {
  reservation_id: number;
  amount: number;
  currency?: string;
  card_number: string;
  card_exp_month: number;
  card_exp_year: number;
  card_cvc: string;
  save_card?: boolean;
}

export interface PaymentResponse {
  verification_token: string;
  payment_id: number;
  sms_code: string;
  message: string;
}

export interface VerifySmsPayload {
  verification_token: string;
  sms_code: string;
  payment_id: number;
}

export interface VerifySmsResponse {
  success: boolean;
  result_token: string;
  status: string;
  payment_id: number;
  message?: string;
  remaining_attempts?: number;
}

export interface PaymentResult {
  payment_id: number;
  status: string;
  amount_rubles: number;
  currency: string;
  card_brand: string;
  card_last4: string;
  provider_reference: string;
  created_at: string;
}

export class PaymentError extends Error {
  public code?: string;
  public remainingAttempts?: number;

  constructor(message: string, code?: string, remainingAttempts?: number) {
    super(message);
    this.name = "PaymentError";
    this.code = code;
    this.remainingAttempts = remainingAttempts;
  }
}

export const PaymentService = {
  // Создание платежа
  async createPayment(payload: PaymentPayload): Promise<PaymentResponse> {
    try {
      const { data } = await api.post<PaymentResponse>("/payments", payload);
      return data;
    } catch (error: any) {
      if (error.response?.status === 422) {
        if (error.response.data.errors) {
          const errors = error.response.data.errors;
          const errorMsg = Object.values(errors).flat().join(", ");
          throw new PaymentError(`Ошибка валидации: ${errorMsg}`);
        } else if (error.response.data.message) {
          throw new PaymentError(error.response.data.message);
        }
      }
      throw new PaymentError("Ошибка при создании платежа");
    }
  },

  // Подтверждение SMS
  async verifySms(payload: VerifySmsPayload): Promise<VerifySmsResponse> {
    try {
      const { data } = await api.post<VerifySmsResponse>(
        "/payments/verify-sms",
        payload
      );

      if (data.success) {
        return data;
      } else {
        throw new PaymentError(data.message || "Ошибка верификации");
      }
    } catch (error: any) {
      if (error.response?.status === 422) {
        const errorData = error.response.data;

        // Проверяем особые случаи ошибок
        if (errorData.message === "Too many attempts. Please start over.") {
          throw new PaymentError(
            "Слишком много попыток. Пожалуйста, начните оплату заново.",
            "TOO_MANY_ATTEMPTS"
          );
        }

        if (errorData.message === "Invalid SMS code") {
          throw new PaymentError(
            "Неверный код подтверждения",
            "INVALID_SMS_CODE",
            errorData.remaining_attempts
          );
        }

        if (errorData.message === "Invalid or expired verification token") {
          throw new PaymentError(
            "Время подтверждения истекло. Пожалуйста, начните оплату заново.",
            "EXPIRED_TOKEN"
          );
        }

        throw new PaymentError(errorData.message || "Ошибка верификации");
      }

      throw error;
    }
  },

  // Получение результата платежа
  async getPaymentResult(token: string): Promise<PaymentResult> {
    try {
      const { data } = await api.get<PaymentResult>(
        `/payments/result/${token}`
      );
      return data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new PaymentError(
          "Результат платежа не найден или истек",
          "RESULT_NOT_FOUND"
        );
      }
      throw new PaymentError("Ошибка при получении результата платежа");
    }
  },
};
