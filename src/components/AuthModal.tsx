import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const AuthModal = () => {
  const { isAuthModalOpen, closeAuthModal, login, signup, isLoading, error } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      await login(email, password);
    } else {
      await signup(firstName, lastName, email, password);
    }
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setFirstName("");
    setLastName("");
  };

  return (
    <AnimatePresence>
      {isAuthModalOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeAuthModal}
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50"
          >
            <div className="bg-background rounded-lg shadow-lg border border-border">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border">
                <h2 className="font-serif text-2xl text-foreground">
                  {isLogin ? "Iniciar Sesión" : "Registrarse"}
                </h2>
                <button
                  onClick={closeAuthModal}
                  className="p-1 hover:opacity-60 transition-opacity"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5 text-foreground" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                {error && (
                  <div className="mb-4 p-3 bg-red-100 text-red-700 text-sm rounded">
                    {error}
                  </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name fields - only for signup */}
                  {!isLogin && (
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <label className="block text-sm text-foreground mb-2">
                          Nombre
                        </label>
                        <input
                          type="text"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          placeholder="Tu nombre"
                          className="w-full px-4 py-2 bg-background border border-border rounded text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
                          required={!isLogin}
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm text-foreground mb-2">
                          Apellido
                        </label>
                        <input
                          type="text"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          placeholder="Tu apellido"
                          className="w-full px-4 py-2 bg-background border border-border rounded text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
                          required={!isLogin}
                        />
                      </div>
                    </div>
                  )}

                  {/* Email */}
                  <div>
                    <label className="block text-sm text-foreground mb-2">
                      Correo Electrónico
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="tu@email.com"
                      className="w-full px-4 py-2 bg-background border border-border rounded text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
                      required
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-sm text-foreground mb-2">
                      Contraseña
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-2 bg-background border border-border rounded text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
                      required
                    />
                  </div>

                  {/* Submit button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2 bg-foreground text-background rounded font-medium hover:opacity-80 transition-opacity disabled:opacity-60"
                  >
                    {isLoading
                      ? "Cargando..."
                      : isLogin
                        ? "Iniciar Sesión"
                        : "Registrarse"}
                  </button>
                </form>

                {/* Toggle auth mode */}
                <p className="text-center text-sm text-muted-foreground mt-4">
                  {isLogin ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}{" "}
                  <button
                    onClick={() => {
                      setIsLogin(!isLogin);
                      resetForm();
                    }}
                    className="text-foreground hover:opacity-60 transition-opacity font-medium"
                  >
                    {isLogin ? "Registrarse" : "Iniciar Sesión"}
                  </button>
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;
