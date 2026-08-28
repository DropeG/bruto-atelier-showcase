import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigateBack } from "@/hooks/useNavigateBack";

const AuthPage = () => {
  const navigate = useNavigate();
  const { user, login, signup, isLoading, error } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      await login(email, password);
    } else {
      await signup(firstName, lastName, email, password);
    }
    // Only navigate away if we are successfully logged in? 
    // AuthContext sets user if successful. We can't immediately know here unless we check user.
    // We'll navigate in a useEffect if user exists.
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setFirstName("");
    setLastName("");
  };

  const goBack = useNavigateBack("/");

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header con botón back */}
      <div className="border-b border-border">
        <div className="section-padding py-4 flex items-center">
          <button
            onClick={goBack}
            type="button"
            aria-label="Volver"
            className="flex items-center gap-2 text-foreground hover:opacity-60 transition-opacity"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Volver</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          {/* Title */}
          <h1 className="font-serif text-3xl md:text-4xl text-center mb-2 text-foreground">
            {isLogin ? "Iniciar Sesión" : "Registrarse"}
          </h1>
          <p className="text-center text-muted-foreground mb-8">
            {isLogin
              ? "Accede a tu cuenta para continuar"
              : "Crea una cuenta para comenzar"}
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 text-sm rounded text-center">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 mb-6">
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
                    className="w-full px-4 py-3 bg-background border border-border rounded text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 transition"
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
                    className="w-full px-4 py-3 bg-background border border-border rounded text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 transition"
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
                className="w-full px-4 py-3 bg-background border border-border rounded text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 transition"
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
                className="w-full px-4 py-3 bg-background border border-border rounded text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 transition"
                required
              />
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-foreground text-background rounded font-medium hover:opacity-80 transition-opacity disabled:opacity-60 mt-6"
            >
              {isLoading
                ? "Cargando..."
                : isLogin
                  ? "Iniciar Sesión"
                  : "Registrarse"}
            </button>
          </form>

          {/* Toggle auth mode */}
          <p className="text-center text-sm text-muted-foreground mt-6">
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
        </motion.div>
      </div>
    </div>
  );
};

export default AuthPage;
