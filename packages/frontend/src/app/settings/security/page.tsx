"use client"

import { useIsClient } from "@/hooks/use-is-client"
import { z } from "zod"
import { useForm } from "@tanstack/react-form"
import { ShieldAlert, Mail, Lock } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { useAppStore } from "@/store/useAppStore"
import { useToast } from "@/hooks/use-toast"
import type { BackendUser } from "@/types/user"
import { getErrorMessage } from "@/lib/utils"

/* ── Zod Schemas ─────────────────────────────────────────────── */

const emailUpdateSchema = z.object({
  currentPassword: z.string().min(1, "Le mot de passe actuel est requis."),
  newEmail: z.string().email("Adresse e-mail invalide."),
})

const passwordUpdateSchema = z
  .object({
    currentPassword: z.string().min(1, "Le mot de passe actuel est requis."),
    newPassword: z
      .string()
      .min(8, "Le mot de passe doit comporter au moins 8 caractères.")
      .regex(/\d/, "Le mot de passe doit contenir au moins un chiffre.")
      .regex(/[^a-zA-Z0-9]/, "Le mot de passe doit contenir au moins un symbole."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas.",
    path: ["confirmPassword"],
  })

/* ── Component ───────────────────────────────────────────────── */

export default function SecuritySettingsPage() {
  const user = useAppStore((state) => state.user) as BackendUser | null
  const { toast } = useToast()
  const isMounted = useIsClient()

  /* ── TanStack Forms ────────────────────────────────────────── */

  const emailForm = useForm({
    defaultValues: {
      currentPassword: "",
      newEmail: user?.email || "",
    },
    validators: {
      onChange({ value }) {
        const result = emailUpdateSchema.safeParse(value)
        return result.success ? undefined : result.error.issues.map(i => i.message).join(", ")
      },
    },
    onSubmit: async ({ value: _value }) => {
      try {
        // TODO: Replace with real API call
        await new Promise((resolve) => setTimeout(resolve, 800))
        toast({
          title: "E-mail mis à jour",
          description: "Un lien de vérification vous a été envoyé.",
        })
      } catch {
        toast({
          title: "Erreur",
          description: "Impossible de mettre à jour l'e-mail.",
          variant: "destructive",
        })
      }
    },
  })

  const passwordForm = useForm({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validators: {
      onChange({ value }) {
        const result = passwordUpdateSchema.safeParse(value)
        return result.success ? undefined : result.error.issues.map(i => i.message).join(", ")
      },
    },
    onSubmit: async ({ value: _value }) => {
      try {
        // TODO: Replace with real API call
        await new Promise((resolve) => setTimeout(resolve, 800))
        toast({
          title: "Mot de passe modifié",
          description: "Votre mot de passe a bien été mis à jour.",
        })
        passwordForm.reset()
      } catch {
        toast({
          title: "Erreur",
          description: "Impossible de modifier le mot de passe.",
          variant: "destructive",
        })
      }
    },
  })

  if (!isMounted) return null

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h3 className="text-lg font-medium flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-primary" />
          Sécurité et Authentification
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Gérez votre adresse e-mail et votre mot de passe. Ces données sont
          critiques et nécessitent une confirmation.
        </p>
      </div>
      <Separator />

      <div className="grid gap-6">
        {/* ── Email Card ── */}
        <Card className="border-muted shadow-none">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Mail className="h-4 w-4" />
              Adresse e-mail
            </CardTitle>
            <CardDescription>
              Nous enverrons un lien de vérification à votre nouvelle adresse
              e-mail.
            </CardDescription>
          </CardHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              emailForm.handleSubmit()
            }}
          >
            <CardContent className="space-y-6 pb-6">
              <emailForm.Field name="currentPassword">
                {(field) => (
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="w-full md:max-w-[250px] pl-4 transition-all duration-300 rounded-lg shadow-sm focus-visible:ring-1 focus-visible:border-primary focus-visible:ring-primary"
                    />
                    {field.state.meta.errors.length > 0 && (
                      <p className="text-sm text-destructive">
                        {field.state.meta.errors.map(getErrorMessage).join(", ")}
                      </p>
                    )}
                  </div>
                )}
              </emailForm.Field>

              <emailForm.Field name="newEmail">
                {(field) => (
                  <div className="space-y-2">
                    <Label htmlFor="newEmail">Nouvelle adresse e-mail</Label>
                    <Input
                      id="newEmail"
                      type="email"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="w-full md:max-w-[250px] pl-4 transition-all duration-300 rounded-lg shadow-sm focus-visible:ring-1 focus-visible:border-primary focus-visible:ring-primary"
                    />
                    {field.state.meta.errors.length > 0 && (
                      <p className="text-sm text-destructive">
                        {field.state.meta.errors.map(getErrorMessage).join(", ")}
                      </p>
                    )}
                  </div>
                )}
              </emailForm.Field>
              
              <emailForm.Subscribe selector={(state) => [state.errorMap]}>
                {([errorMap]) => {
                  const error = errorMap.onSubmit || errorMap.onChange
                  return error ? (
                    <p className="text-sm text-destructive">
                      {getErrorMessage(error)}
                    </p>
                  ) : null
                }}
              </emailForm.Subscribe>
            </CardContent>
            <CardFooter className="pt-2">
              <emailForm.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
                {([canSubmit, isSubmitting]) => (
                  <Button
                    type="submit"
                    disabled={!canSubmit || isSubmitting}
                    className="bg-[#4A7C59] hover:bg-[#3a6349] text-white"
                  >
                    {isSubmitting ? "Envoi..." : "Mettre à jour l'e-mail"}
                  </Button>
                )}
              </emailForm.Subscribe>
            </CardFooter>
          </form>
        </Card>

        {/* ── Password Card ── */}
        <Card className="border-muted shadow-none border-destructive/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-destructive">
              <Lock className="h-4 w-4" />
              Changer le mot de passe
            </CardTitle>
            <CardDescription>
              Assurez-vous que votre compte utilise un mot de passe long et
              aléatoire pour rester en sécurité.
            </CardDescription>
          </CardHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              passwordForm.handleSubmit()
            }}
          >
            <CardContent className="space-y-6 pb-6">
              <passwordForm.Field name="currentPassword">
                {(field) => (
                  <div className="space-y-2">
                    <Label htmlFor="pwd-currentPassword">Mot de passe actuel</Label>
                    <Input
                      id="pwd-currentPassword"
                      type="password"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="w-full md:max-w-[250px] pl-4 transition-all duration-300 rounded-lg shadow-sm focus-visible:ring-1 focus-visible:border-primary focus-visible:ring-primary"
                    />
                    {field.state.meta.errors.length > 0 && (
                      <p className="text-sm text-destructive">
                        {field.state.meta.errors.map(getErrorMessage).join(", ")}
                      </p>
                    )}
                  </div>
                )}
              </passwordForm.Field>

              <passwordForm.Field name="newPassword">
                {(field) => (
                  <div className="space-y-2">
                    <Label htmlFor="pwd-newPassword">Nouveau mot de passe</Label>
                    <Input
                      id="pwd-newPassword"
                      type="password"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="w-full md:max-w-[250px] pl-4 transition-all duration-300 rounded-lg shadow-sm focus-visible:ring-1 focus-visible:border-primary focus-visible:ring-primary"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Doit comporter au moins 8 caractères, dont un chiffre et un
                      symbole.
                    </p>
                    {field.state.meta.errors.length > 0 && (
                      <p className="text-sm text-destructive">
                        {field.state.meta.errors.map(getErrorMessage).join(", ")}
                      </p>
                    )}
                  </div>
                )}
              </passwordForm.Field>

              <passwordForm.Field name="confirmPassword">
                {(field) => (
                  <div className="space-y-2">
                    <Label htmlFor="pwd-confirmPassword">
                      Confirmer le nouveau mot de passe
                    </Label>
                    <Input
                      id="pwd-confirmPassword"
                      type="password"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="w-full md:max-w-[250px] pl-4 transition-all duration-300 rounded-lg shadow-sm focus-visible:ring-1 focus-visible:border-primary focus-visible:ring-primary"
                    />
                    {field.state.meta.errors.length > 0 && (
                      <p className="text-sm text-destructive">
                        {field.state.meta.errors.map(getErrorMessage).join(", ")}
                      </p>
                    )}
                  </div>
                )}
              </passwordForm.Field>
              
              <passwordForm.Subscribe selector={(state) => [state.errorMap]}>
                {([errorMap]) => {
                  const error = errorMap.onSubmit || errorMap.onChange
                  return error ? (
                    <p className="text-sm text-destructive">
                      {getErrorMessage(error)}
                    </p>
                  ) : null
                }}
              </passwordForm.Subscribe>
            </CardContent>
            <CardFooter className="pt-2">
              <passwordForm.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
                {([canSubmit, isSubmitting]) => (
                  <Button
                    type="submit"
                    variant="destructive"
                    disabled={!canSubmit || isSubmitting}
                    className="bg-red-500 hover:bg-red-600"
                  >
                    {isSubmitting ? "Mise à jour..." : "Modifier le mot de passe"}
                  </Button>
                )}
              </passwordForm.Subscribe>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}

