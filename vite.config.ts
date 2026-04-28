import { paraglideVitePlugin } from "@inlang/paraglide-js"
import { devtools } from "@tanstack/devtools-vite"
import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import viteReact from "@vitejs/plugin-react"
import viteTsConfigPaths from "vite-tsconfig-paths"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "vite"

const config = defineConfig({
  plugins: [
    devtools(),
    // this is the plugin that enables path aliases
    viteTsConfigPaths({
      projects: ["./tsconfig.json"],
    }),
    paraglideVitePlugin({
      project: "./project.inlang",
      outdir: "./src/paraglide",
      cookieName: "PARAGLIDE_LOCALE",
      strategy: ["cookie", "url", "preferredLanguage", "baseLocale"],
      routeStrategies: [
        { match: "/api/:path(.*)?", exclude: true },
        { match: "/_serverFn/:path(.*)?", exclude: true },
      ],
    }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
  ],
})

export default config
