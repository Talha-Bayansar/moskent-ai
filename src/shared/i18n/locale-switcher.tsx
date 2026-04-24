"use client"

import type { ComponentPropsWithoutRef } from "react"

import type { Locale } from "@/shared/i18n"
import { getLocale, locales, m, setLocale } from "@/shared/i18n"
import { NativeSelect, NativeSelectOption } from "@/shared/ui/native-select"

const localeLabelByLocale: Record<Locale, () => string> = {
  en: () => m.locale_en(),
  nl: () => m.locale_nl(),
  tr: () => m.locale_tr(),
}

type LocaleSwitcherProps = Omit<
  ComponentPropsWithoutRef<typeof NativeSelect>,
  "value" | "defaultValue" | "onChange" | "children" | "aria-label"
>

export function LocaleSwitcher({
  className,
  size = "default",
  ...props
}: LocaleSwitcherProps) {
  const currentLocale = getLocale()

  return (
    <NativeSelect
      aria-label={m.locale_switcher_label()}
      className={className}
      size={size}
      value={currentLocale}
      onChange={(event) => {
        void setLocale(event.currentTarget.value as Locale)
      }}
      {...props}
    >
      {locales.map((locale) => (
        <NativeSelectOption key={locale} value={locale}>
          {localeLabelByLocale[locale]()}
        </NativeSelectOption>
      ))}
    </NativeSelect>
  )
}
