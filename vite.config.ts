import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";
import wachiDraftOrderHandler from "./api/wachi-draft-order";

function wachiDraftOrderDevPlugin(mode: string): Plugin {
  return {
    name: "wachi-draft-order-dev-api",
    configureServer(server) {
      const env = loadEnv(mode, process.cwd(), "");
      for (const [key, value] of Object.entries(env)) {
        if (process.env[key] === undefined) {
          process.env[key] = value;
        }
      }

      server.middlewares.use("/api/wachi-draft-order", (req, res, next) => {
        if (req.url && req.url !== "/" && !req.url.startsWith("?")) {
          next();
          return;
        }
        void wachiDraftOrderHandler(req, res);
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    allowedHosts: true,
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    mode === "development" && wachiDraftOrderDevPlugin(mode),
    ViteImageOptimizer({
      png: { quality: 80 },
      jpeg: { quality: 80 },
      webp: { quality: 80, lossless: false },
      avif: { quality: 70, lossless: false },
    })
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-motion': ['framer-motion'],
          'vendor-ui': [
            '@radix-ui/react-aspect-ratio',
            '@radix-ui/react-dialog',
            '@radix-ui/react-popover',
            'lucide-react'
          ],
        }
      }
    }
  }
}));
