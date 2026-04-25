"use client"

import { useNavigate } from "@tanstack/react-router"
import { useState } from "react"
import type { ComponentProps, ReactNode } from "react"

import { authClient } from "@/shared/auth/auth-client"
import { m } from "@/shared/i18n"
import { cn } from "@/shared/lib/utils"
import { Button } from "@/shared/ui/button"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/ui/alert-dialog"

type ButtonProps = ComponentProps<typeof Button>

type SignOutButtonProps = {
  children?: ReactNode
  className?: string
  redirectTo?: string
  triggerVariant?: ButtonProps["variant"]
  triggerSize?: ButtonProps["size"]
}

export function SignOutButton({
  children,
  className,
  redirectTo = "/sign-in",
  triggerVariant = "ghost",
  triggerSize = "default",
}: SignOutButtonProps) {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [isSigningOut, setIsSigningOut] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const triggerContent = children ?? m.auth_sign_out_label()

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger
        render={
          <Button
            variant={triggerVariant}
            size={triggerSize}
            className={cn(className)}
          />
        }
      >
        {triggerContent}
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{m.auth_sign_out_title()}</AlertDialogTitle>
          <AlertDialogDescription>
            {m.auth_sign_out_description()}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {error ? (
          <p className="text-sm text-destructive">{error}</p>
        ) : null}

        <AlertDialogFooter>
          <AlertDialogCancel variant="outline">
            {m.auth_sign_out_cancel()}
          </AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={async () => {
              setError(null)
              setIsSigningOut(true)

              try {
                const { error: signOutError } = await authClient.signOut()

                if (signOutError) {
                  setError(signOutError.message ?? m.auth_sign_out_error())
                  return
                }

                setOpen(false)
                await navigate({
                  to: redirectTo,
                  replace: true,
                })
              } catch {
                setError(
                  m.auth_sign_out_error()
                )
              } finally {
                setIsSigningOut(false)
              }
            }}
            disabled={isSigningOut}
          >
            {isSigningOut
              ? m.auth_sign_out_submitting()
              : m.auth_sign_out_confirm()}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
