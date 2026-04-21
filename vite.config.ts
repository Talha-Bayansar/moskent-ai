import { type CompilerOptions, paraglideVitePlugin } from "@inlang/paraglide-js"
import { devtools } from "@tanstack/devtools-vite"
import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import viteReact from "@vitejs/plugin-react"
import viteTsConfigPaths from "vite-tsconfig-paths"
import tailwindcss from "@tailwindcss/vite"
import { nitro } from "nitro/vite"
import { defineConfig } from "vite"

const paraglidePluginOptions: CompilerOptions = {
  project: "./project.inlang",
  outdir: "./src/paraglide",
  outputStructure: "message-modules",
  cookieName: "PARAGLIDE_LOCALE",
  strategy: ["url", "cookie", "preferredLanguage", "baseLocale"],
  routeStrategies: [
    {
      match: "/api/:path(.*)?",
      exclude: true,
    },
  ],
} as const

const config = defineConfig({
  plugins: [
    devtools(),
    nitro(),
    // this is the plugin that enables path aliases
    viteTsConfigPaths({
      projects: ["./tsconfig.json"],
    }),
    paraglideVitePlugin(paraglidePluginOptions),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
  ],
})

export default config
