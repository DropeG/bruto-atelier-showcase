import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { CurrencyProvider } from "./contexts/CurrencyContext";
import { AuthProvider } from "./contexts/AuthContext";

// Global listener to force reload when dynamic imports or chunk loading fails due to a new deployment
window.addEventListener("error", (e) => {
  const isChunkError = /Loading chunk \d+ failed|Failed to fetch dynamically imported module/i.test(
    e.message || ""
  );
  if (isChunkError) {
    console.warn("Stale chunk detected after deployment. Reloading page...");
    window.location.reload();
  }
}, true);

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <CurrencyProvider>
      <App />
    </CurrencyProvider>
  </AuthProvider>
);
