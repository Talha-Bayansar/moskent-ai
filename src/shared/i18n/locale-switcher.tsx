import { locales, m, setLocale, type Locale } from "@/shared/i18n"
import { Button } from "@/shared/ui/button"

const localeLabelByLocale: Record<Locale, () => string> = {
  en: () => m.locale_en(),
  nl: () => m.locale_nl(),
  tr: () => m.locale_tr(),
}

export function LocaleSwitcher() {
  return (
    <nav
      aria-label={m.locale_switcher_label()}
      className="flex flex-wrap items-center gap-2"
    >
      {locales.map((locale) => {
        return (
          <Button
            key={locale}
            nativeButton={false}
            variant="outline"
            size="sm"
            onClick={() => {
              void setLocale(locale)
            }}
          >
            {localeLabelByLocale[locale]()}
          </Button>
        )
      })}
    </nav>
  )
}
