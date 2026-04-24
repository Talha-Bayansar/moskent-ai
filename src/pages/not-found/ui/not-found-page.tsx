import { Link } from "@tanstack/react-router"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowLeft02Icon, Home01Icon, Search01Icon } from "@hugeicons/core-free-icons"

import { LocaleSwitcher } from "@/shared/i18n/locale-switcher"
import { m } from "@/shared/i18n"
import { buttonVariants } from "@/shared/ui/button"
import { Card, CardContent } from "@/shared/ui/card"

export function NotFoundPage() {
  return (
    <main className="relative min-h-svh overflow-hidden bg-background px-6 py-4 sm:px-8 lg:px-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(20,184,166,0.16),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(15,23,42,0.08),_transparent_28%)] dark:bg-[radial-gradient(circle_at_top_left,_rgba(20,184,166,0.13),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(255,255,255,0.08),_transparent_28%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.03)_1px,transparent_1px)] bg-[size:88px_88px] opacity-45 [mask-image:linear-gradient(to_bottom,black,transparent_86%)]" />

      <div className="relative mx-auto flex min-h-[calc(100svh-2rem)] w-full max-w-6xl flex-col">
        <div className="flex items-center justify-between gap-4 py-2">
          <Link
            to="/"
            className="text-sm font-medium tracking-[0.18em] text-foreground/70 transition-colors hover:text-foreground"
          >
            Moskent AI
          </Link>
          <LocaleSwitcher />
        </div>

        <div className="flex flex-1 items-center justify-center py-10 sm:py-12">
          <Card className="relative w-full max-w-4xl overflow-hidden border-border/70 bg-background/80 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.45)] backdrop-blur">
            <CardContent className="grid gap-10 p-6 sm:p-8 lg:grid-cols-[1.2fr_0.8fr] lg:gap-0 lg:p-12">
              <div className="relative flex flex-col justify-between gap-10">
                <div className="space-y-5">
                  <p className="inline-flex w-fit items-center gap-2 rounded-full border border-border/70 bg-muted/70 px-3 py-1 text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground shadow-sm">
                    <HugeiconsIcon icon={Search01Icon} strokeWidth={2} className="size-3.5" />
                    {m.not_found_eyebrow()}
                  </p>

                  <div className="space-y-4">
                    <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                      {m.not_found_title()}
                    </h1>
                    <p className="max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
                      {m.not_found_description()}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Link
                    to="/"
                    className={`${buttonVariants({ size: "lg" })} gap-2`}
                  >
                    <HugeiconsIcon
                      icon={Home01Icon}
                      strokeWidth={2}
                      className="size-4"
                    />
                    {m.not_found_primary_action()}
                  </Link>
                  <Link
                    to="/sign-in"
                    className={`${buttonVariants({ variant: "outline", size: "lg" })} gap-2`}
                  >
                    <HugeiconsIcon
                      icon={ArrowLeft02Icon}
                      strokeWidth={2}
                      className="size-4"
                    />
                    {m.not_found_secondary_action()}
                  </Link>
                </div>
              </div>

              <div className="relative flex items-stretch justify-center">
                <div className="absolute inset-y-8 left-1/2 w-px bg-gradient-to-b from-transparent via-border to-transparent lg:block" />
                <div className="flex w-full items-center justify-center">
                  <div className="relative flex aspect-square w-full max-w-[18rem] items-center justify-center">
                    <div className="absolute inset-0 rounded-[2rem] bg-[radial-gradient(circle_at_center,_rgba(20,184,166,0.26),_transparent_58%)] blur-2xl" />
                    <div className="absolute inset-8 rounded-[2rem] border border-border/70 bg-muted/35 shadow-inner" />
                    <div className="relative flex h-full w-full items-center justify-center">
                      <span className="text-[7rem] font-semibold leading-none tracking-[-0.08em] text-foreground/12 sm:text-[8.5rem]">
                        404
                      </span>
                      <div className="absolute bottom-7 left-1/2 -translate-x-1/2 rounded-full border border-border/70 bg-background/90 px-4 py-2 text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground shadow-sm">
                        {m.not_found_badge()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
