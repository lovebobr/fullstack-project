import { makeAutoObservable, runInAction } from "mobx";
import { AuthService } from "../../api/api.auth";
import type { User } from "../../interfaces/aurh.interfaces";

class AuthStore {
  isAuthenticated = false;
  user: User | null = null;
  loading = false;
  error: string | null = null;
  token: string | null = null;
  initialCheckCompleted = false;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
    this.checkAuth();
  }

  async register(email: string, password: string, name: string): Promise<void> {
    runInAction(() => {
      this.loading = true;
      this.error = null;
    });
    try {
      const { user, token } = await AuthService.register(email, password, name);

      runInAction(() => {
        this.user = user;
        this.token = token;
        this.isAuthenticated = true;
      });

      localStorage.setItem("accessToken", token);
    } catch (err: any) {
      runInAction(() => {
        if (err.response?.status === 422) {
          const errors = err.response.data.errors;
          if (errors.email) {
            this.error = "Пользователь с таким email уже существует";
          } else if (errors.password) {
            this.error = "Пароль должен быть не менее 8 символов";
          } else {
            this.error = "Ошибка валидации данных";
          }
        } else {
          this.error =
            err.response?.data?.message || err.message || "Ошибка регистрации";
        }
        this.isAuthenticated = false;
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async login(email: string, password: string): Promise<void> {
    runInAction(() => {
      this.loading = true;
      this.error = null;
      this.user = null;
      this.isAuthenticated = false;
      this.token = null;
    });

    try {
      const { user, token } = await AuthService.login(email, password);

      runInAction(() => {
        this.user = user;
        this.token = token;
        this.isAuthenticated = true;
        this.loading = false;
      });
      console.log("здесь!!", user, token);
      localStorage.setItem("accessToken", token);
    } catch (err: any) {
      runInAction(() => {
        this.error =
          err.response?.status === 401 || err.response?.status === 422
            ? "Неверный email или пароль"
            : err.response?.data?.message || err.message || "Ошибка входа";
        this.isAuthenticated = false;
        this.loading = false;
        this.user = null; 
        this.token = null;
      });
    }
  }
  async checkAuth(): Promise<void> {
    runInAction(() => {
      this.loading = true;
    });

    const token = localStorage.getItem("accessToken");
    console.log(
      "🔐 checkAuth token:",
      token?.substring(0, 20) + "...",
      this.user
    );

    // Сбрасываем состояние перед проверкой
    runInAction(() => {
      this.isAuthenticated = false; // ⚠️ ВАЖНО: сбрасываем!
      this.user = null;
      this.token = null;
      this.loading = true;
    });

    if (!token || token === "undefined" || token === "null") {
      console.log("❌ No valid token found");
      runInAction(() => {
        this.isAuthenticated = false;
        this.loading = false;
      });
      return;
    }

    try {
      console.log("🔄 Fetching user data...");
      const user = await AuthService.getMe();

      runInAction(() => {
        this.user = user;
        this.token = token;
        this.isAuthenticated = true; // ✅ ТОЛЬКО ПОСЛЕ УСПЕШНОЙ ЗАГРУЗКИ
        this.loading = false;
        console.log("✅ AuthStore updated:", {
          user: this.user,
          role: this.user?.role,
        });
      });
    } catch (err: any) {
      console.log("❌ checkAuth error:", err.message);

      runInAction(() => {
        this.isAuthenticated = false; // ⚠️ ОБЯЗАТЕЛЬНО false при ошибке
        this.user = null;
        this.token = null;
        this.loading = false;
      });

      localStorage.removeItem("accessToken");
    }
  }
  logout(): void {
    AuthService.logout();
    localStorage.removeItem("accessToken");
    runInAction(() => {
      this.isAuthenticated = false;
      this.user = null;
      this.token = null;
      this.error = null;
      this.loading = false;
    });
  }
}

export const authStore = new AuthStore();
