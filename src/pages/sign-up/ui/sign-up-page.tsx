import { Link } from "@tanstack/react-router"

import { AuthPageShell } from "@/shared/auth/ui/auth-page-shell"
import { SignUpForm } from "@/shared/auth/ui/sign-up-form"
import { m } from "@/shared/i18n"

type SignUpPageProps = {
  redirectTo?: string
}

export function SignUpPage({ redirectTo }: SignUpPageProps) {
  return (
    <AuthPageShell
      eyebrow={m.sign_up_eyebrow()}
      title={m.sign_up_title()}
      description={m.sign_up_description()}
      footer={
        <div className="flex flex-col items-center gap-2 text-center text-sm text-muted-foreground">
          <p className="text-balance">
            {m.sign_up_switch_prompt()}{" "}
            <Link
              to="/sign-in"
              search={redirectTo ? { redirectTo } : undefined}
              className="font-medium text-foreground transition-colors hover:text-primary"
            >
              {m.sign_up_switch_action()}
            </Link>
          </p>
          <Link
            to="/"
            className="font-medium text-foreground/75 transition-colors hover:text-foreground"
          >
            {m.auth_back_home()}
          </Link>
        </div>
      }
    >
      <SignUpForm
        redirectTo={redirectTo}
        copy={{
          nameLabel: m.auth_name_label(),
          nameDescription: m.auth_name_description(),
          emailLabel: m.auth_email_label(),
          emailDescription: m.auth_email_description(),
          passwordLabel: m.auth_password_label(),
          passwordDescription: m.auth_password_description(),
          confirmPasswordLabel: m.auth_confirm_password_label(),
          confirmPasswordDescription: m.auth_confirm_password_description(),
          submitLabel: m.sign_up_submit(),
          submittingLabel: m.sign_up_submitting(),
          genericError: m.auth_generic_error(),
        }}
      />
    </AuthPageShell>
  )
}
