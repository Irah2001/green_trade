"use client"

import { useEffect, useState, useCallback } from "react"
import { toast } from "sonner"

// Components
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { EditableField } from "@/components/ui/editable-field"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { AvatarUploadDialog } from "@/components/ui/avatar-upload-dialog"

import { useAppStore } from "@/store/useAppStore"
import {
  type BackendUser,
  getUserPhone,
  getUserCity,
  getUserPostalCode,
  getUserAvatar,
  getUserInitials,
  getUserDisplayName,
} from "@/types/user"

export default function ProfileSettingsPage() {
  const user = useAppStore((state) => state.user) as BackendUser | null
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  /** Persists a single field update to the API. */
  const handleSave = useCallback(async (field: string, newValue: string) => {
    try {
      // TODO: Replace with real API call via Server Action
      await new Promise<void>((resolve) => setTimeout(resolve, 500))
      toast.success(`Mise à jour de ${field} réussie`)
    } catch (error) {
      toast.error(`Erreur lors de l'enregistrement de ${field}`)
    }
  }, [])

  if (!isMounted) return null

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h3 className="text-lg font-medium">Profil</h3>
        <p className="text-sm text-muted-foreground">
          Consultez et modifiez les informations de votre profil personnel.
        </p>
      </div>
      <Separator />

      {/* Avatar Card */}
      <Card className="shadow-none border-muted">
        <CardHeader className="flex flex-row items-center gap-4 py-4">
          <Avatar className="h-16 w-16">
            <AvatarImage
              src={user ? getUserAvatar(user) : ""}
              alt="Avatar"
            />
            <AvatarFallback>
              {user ? getUserInitials(user) : "??"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <h4 className="text-sm font-medium leading-none">
              {user ? getUserDisplayName(user) : "Chargement..."}
            </h4>
            <p className="text-sm text-muted-foreground capitalize">
              {user?.role ?? ""}
            </p>
          </div>
          <AvatarUploadDialog 
            onUploadSuccess={async (file) => {
              // Simulated upload callback until backend hookup
              console.log("Avatar file requested for upload:", file.name)
            }}
          />
        </CardHeader>
      </Card>

      {/* Personal Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Informations personnelles</h3>
        <p className="text-sm text-muted-foreground">
          Gérez vos coordonnées et vos informations de base.
        </p>
        <Separator />
        <Card className="shadow-none border-muted">
          <CardContent className="grid gap-6 sm:grid-cols-2 p-6">
            <EditableField
              id="firstName"
              label="Prénom"
              initialValue={user?.firstName ?? ""}
              onSave={(v) => handleSave("firstName", v)}
            />
            <EditableField
              id="lastName"
              label="Nom"
              initialValue={user?.lastName ?? ""}
              onSave={(v) => handleSave("lastName", v)}
            />
            <EditableField
              id="phone"
              label="Numéro de téléphone"
              initialValue={user ? getUserPhone(user) : ""}
              onSave={(v) => handleSave("phone", v)}
            />
            <EditableField
              id="city"
              label="Ville"
              initialValue={user ? getUserCity(user) : ""}
              onSave={(v) => handleSave("city", v)}
            />
            <EditableField
              id="postalCode"
              label="Code postal"
              initialValue={user ? getUserPostalCode(user) : ""}
              onSave={(v) => handleSave("postalCode", v)}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
