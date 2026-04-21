export const paraglideOptions = {
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
}
