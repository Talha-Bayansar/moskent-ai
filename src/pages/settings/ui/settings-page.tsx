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
    <section className="flex flex-col gap-8">
      <div className="flex max-w-3xl flex-col gap-3">
        <span className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
          {m.settings_preferences_title()}
        </span>
        <h1 className="text-4xl font-semibold tracking-tight text-foreground">
          {m.settings_title()}
        </h1>
        <p className="max-w-2xl text-base leading-7 text-muted-foreground">
          {m.settings_description()}
        </p>
      </div>

      <Card className="max-w-2xl">
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
