import { m } from "@/shared/i18n"
import { Badge } from "@/shared/ui/badge"
import { Button } from "@/shared/ui/button"
import { Separator } from "@/shared/ui/separator"
import { Textarea } from "@/shared/ui/textarea"

const capabilityLabels = [
  () => m.dashboard_chat_capability_permissions(),
  () => m.dashboard_chat_capability_workflows(),
  () => m.dashboard_chat_capability_actions(),
] as const

export function DashboardPage() {
  return (
    <section className="flex min-h-[calc(100svh-5.5rem)] flex-col lg:min-h-[calc(100svh-9rem)]">
      <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col justify-between gap-5 lg:gap-8">
        <div className="flex flex-1 flex-col gap-5 py-2 lg:items-center lg:justify-center lg:gap-8 lg:py-8 lg:text-center">
          <div className="flex flex-col gap-4 lg:items-center">
            <Badge variant="outline" className="w-fit">
              {m.dashboard_chat_status_badge()}
            </Badge>
            <div className="flex max-w-2xl flex-col gap-3 md:gap-4">
              <span className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground sm:tracking-[0.22em]">
                {m.dashboard_eyebrow()}
              </span>
              <h1 className="text-3xl leading-tight font-semibold tracking-tight text-balance text-foreground sm:text-4xl lg:text-5xl">
                {m.dashboard_title()}
              </h1>
              <p className="text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">
                {m.dashboard_description()}
              </p>
            </div>
          </div>

          <div className="grid w-full gap-3 sm:grid-cols-3">
            {capabilityLabels.map((label) => (
              <div
                key={label()}
                className="min-w-0 rounded-2xl border border-border bg-background/70 px-4 py-3 text-left shadow-xs"
              >
                <p className="text-sm font-medium text-foreground">
                  {label()}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="sticky bottom-3 rounded-2xl border border-border bg-background shadow-sm lg:bottom-0 lg:rounded-3xl">
          <div className="flex flex-col gap-4 p-3 sm:p-4">
            <Textarea
              aria-label={m.dashboard_chat_input_label()}
              placeholder={m.dashboard_chat_input_placeholder()}
              className="max-h-36 min-h-24 border-0 bg-transparent px-1 py-1 shadow-none focus-visible:ring-0 sm:min-h-28"
            />
            <Separator />
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-left text-xs leading-5 text-muted-foreground">
                {m.dashboard_chat_footer_note()}
              </p>
              <Button type="button" disabled className="w-full sm:w-fit">
                {m.dashboard_chat_send_label()}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
