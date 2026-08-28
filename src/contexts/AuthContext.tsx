import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { createCustomerAccessToken, getCustomer, createCustomer } from "@/lib/shopify/client";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthModalOpen: boolean;
  isLoading: boolean;
  error: string | null;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (firstName: string, lastName: string, email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("customerAccessToken");
      if (token) {
        try {
          const customerData = await getCustomer(token);
          if (customerData) {
            setUser({
              id: customerData.id,
              email: customerData.email,
              firstName: customerData.firstName || "",
              lastName: customerData.lastName || "",
            });
          } else {
            localStorage.removeItem("customerAccessToken");
          }
        } catch {
          localStorage.removeItem("customerAccessToken");
        }
      }
      setIsLoading(false);
    };
    initAuth();
  }, []);

  const openAuthModal = useCallback(() => {
    setError(null);
    setIsAuthModalOpen(true);
  }, []);
  
  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
    setError(null);
  }, []);

  const login = async (email: string, password: string) => {
    setError(null);
    setIsLoading(true);
    try {
      const res = await createCustomerAccessToken({ email, password });
      if (res.token) {
        localStorage.setItem("customerAccessToken", res.token);
        const customerData = await getCustomer(res.token);
        if (customerData) {
          setUser({
            id: customerData.id,
            email: customerData.email,
            firstName: customerData.firstName || "",
            lastName: customerData.lastName || "",
          });
          closeAuthModal();
        } else {
          const msg = "No se pudo obtener la información del cliente.";
          setError(msg);
          throw new Error(msg);
        }
      } else {
        const errorMsg = res.errors?.[0]?.message || "Credenciales inválidas.";
        setError(errorMsg);
        throw new Error(errorMsg);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error al iniciar sesión.";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = useCallback(() => {
    localStorage.removeItem("customerAccessToken");
    setUser(null);
  }, []);

  const signup = async (firstName: string, lastName: string, email: string, password: string) => {
    setError(null);
    setIsLoading(true);
    try {
      const data = await createCustomer({ firstName, lastName, email, password });
      if (data && !data.customerUserErrors?.length) {
        // Automatically login after successful signup
        await login(email, password);
      } else {
        const message = data?.customerUserErrors?.[0]?.message || "No se pudo registrar la cuenta.";
        setError(message);
        throw new Error(message);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error al registrarse.";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthModalOpen,
        isLoading,
        error,
        openAuthModal,
        closeAuthModal,
        login,
        logout,
        signup,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
