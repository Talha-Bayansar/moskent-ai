import { useLocation } from "@tanstack/react-router"

import {
  deLocalizeHref,
  locales,
  localizeHref,
  m,
  setLocale,
  type Locale,
} from "@/shared/i18n"
import { Button } from "@/shared/ui/button"

const localeLabelByLocale: Record<Locale, () => string> = {
  en: () => m.locale_en(),
  nl: () => m.locale_nl(),
  tr: () => m.locale_tr(),
}

export function LocaleSwitcher() {
  const location = useLocation()
  const canonicalHref = deLocalizeHref(
    `${location.pathname}${location.searchStr}${location.hash}`
  )

  return (
    <nav
      aria-label={m.locale_switcher_label()}
      className="flex flex-wrap items-center gap-2"
    >
      {locales.map((locale) => {
        const href = localizeHref(canonicalHref, { locale }) || "/"

        return (
          <Button
            key={locale}
            nativeButton={false}
            variant="outline"
            size="sm"
            render={
              <a
                href={href}
                hrefLang={locale}
                lang={locale}
                onClick={() => {
                  void setLocale(locale, { reload: false })
                }}
              />
            }
          >
            {localeLabelByLocale[locale]()}
          </Button>
        )
      })}
    </nav>
  )
}
