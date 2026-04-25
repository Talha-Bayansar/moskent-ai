"use client"

import { LocaleSwitcher } from "@/shared/i18n/locale-switcher"
import { m } from "@/shared/i18n"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card"

export function SettingsPage() {
  return (
    <section className="flex flex-col gap-5 md:gap-8">
      <div className="flex max-w-3xl flex-col gap-3">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          {m.settings_title()}
        </h1>
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">
          {m.settings_description()}
        </p>
      </div>

      <Card size="sm" className="max-w-2xl sm:py-6">
        <CardHeader>
          <CardTitle>{m.settings_preferences_title()}</CardTitle>
          <CardDescription>{m.settings_preferences_description()}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <LocaleSwitcher className="w-full max-w-xs" />
        </CardContent>
      </Card>
    </section>
  )
}
