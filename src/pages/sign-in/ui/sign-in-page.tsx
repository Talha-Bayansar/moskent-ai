import { Link } from "@tanstack/react-router"

import { AuthPageShell } from "@/shared/auth/ui/auth-page-shell"
import { SignInForm } from "@/shared/auth/ui/sign-in-form"
import { m } from "@/shared/i18n"

type SignInPageProps = {
  redirectTo?: string
}

export function SignInPage({ redirectTo }: SignInPageProps) {
  return (
    <AuthPageShell
      title={m.sign_in_title()}
      description={m.sign_in_description()}
      footer={
        <div className="flex flex-col items-center gap-2 text-center text-sm text-muted-foreground">
          <p className="text-balance">
            {m.sign_in_switch_prompt()}{" "}
            <Link
              to="/sign-up"
              search={redirectTo ? { redirectTo } : undefined}
              className="font-medium text-foreground transition-colors hover:text-primary"
            >
              {m.sign_in_switch_action()}
            </Link>
          </p>
        </div>
      }
    >
      <SignInForm
        redirectTo={redirectTo}
        copy={{
          emailLabel: m.auth_email_label(),
          emailDescription: m.auth_email_description(),
          passwordLabel: m.auth_password_label(),
          passwordDescription: m.auth_password_description(),
          submitLabel: m.sign_in_submit(),
          submittingLabel: m.sign_in_submitting(),
          genericError: m.auth_generic_error(),
        }}
      />
    </AuthPageShell>
  )
}
