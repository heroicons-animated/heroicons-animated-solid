import { defineConfig } from "@solidjs/start/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  ssr: true,
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      exclude: ["solid-motionone", "@heroicons-animated/solid"],
    },
  },
  server: {
    preset: "vercel",
  },
});
