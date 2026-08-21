import { jsxLocPlugin } from "@builder.io/vite-plugin-jsx-loc";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig, type Plugin, type ViteDevServer } from "vite";
import { handler as demoApiHandler } from "./netlify/functions/demo-api";

function vitePluginCommercialDemoApi(): Plugin {
  return {
    name: "commercial-demo-api",
    configureServer(server: ViteDevServer) {
      server.middlewares.use("/.netlify/functions/demo-api", async (req, res) => {
        let payload = "";
        for await (const chunk of req) payload += chunk.toString();
        const headers = Object.fromEntries(Object.entries(req.headers).map(([key, value]) => [key, Array.isArray(value) ? value.join(",") : value ?? ""]));
        const response = await demoApiHandler({ httpMethod: req.method ?? "GET", headers, body: payload || null, path: "/.netlify/functions/demo-api", rawUrl: req.url ?? "", rawQuery: "", queryStringParameters: null, multiValueQueryStringParameters: null, multiValueHeaders: {}, isBase64Encoded: false } as never, {} as never);
        res.writeHead(response.statusCode, response.headers);
        res.end(response.body);
      });
    },
  };
}

const plugins = [react(), tailwindcss(), jsxLocPlugin(), vitePluginCommercialDemoApi()];

export default defineConfig({
  plugins,
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  envDir: path.resolve(import.meta.dirname),
  root: path.resolve(import.meta.dirname, "client"),
  publicDir: path.resolve(import.meta.dirname, "client", "public"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
        },
      },
    },
  },
  server: {
    host: true,
    allowedHosts: ["localhost", "127.0.0.1"],
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
