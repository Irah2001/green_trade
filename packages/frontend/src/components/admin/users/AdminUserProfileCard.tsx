'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import type { PublicUser } from '@/types/user'
import { getUserDisplayName } from '@/types/user'
import { deleteAdminUser } from '@/services/admin/users.service'
import type { AdminDataSource } from '@/services/admin/admin-capabilities'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import SourceBadge from '@/components/admin/shared/SourceBadge'

const ROLE_LABEL: Record<string, string> = {
  buyer: 'Acheteur',
  seller: 'Vendeur',
  admin: 'Admin',
};

interface Props {
  user: PublicUser
  source: AdminDataSource
  onDelete?: () => void
}

export default function AdminUserProfileCard({ user, source, onDelete }: Readonly<Props>) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const canModify = source === 'api'
  const userName = getUserDisplayName(user) || 'Cet utilisateur'

  const handleDelete = async () => {
    if (!globalThis.confirm(`Supprimer le compte de ${userName} ? Cette action est irréversible.`)) {
      return
    }

    setIsDeleting(true)
    const result = await deleteAdminUser(user.id)

    if (result.source === 'api') {
      onDelete?.()
      router.push('/admin/users')
      router.refresh()
    } else {
      alert(result.capabilityMessage ?? 'Impossible de supprimer cet utilisateur.')
    }
    setIsDeleting(false)
  }

  const handleEdit = () => {
    // TODO: Implement edit page at /admin/users/${user.id}/edit
    alert("La page d'édition n'est pas encore implémentée.")
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">{userName}</CardTitle>
        <SourceBadge source={source} />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Detail label="Email" value="—" />
          <Detail label="Rôle" value={ROLE_LABEL[user.role ?? ''] ?? user.role ?? '—'} />
          <Detail label="Ville" value={user.city || '—'} />
          <Detail label="Note" value={typeof user.rating === 'number' ? user.rating.toFixed(1) : '—'} />
          <Detail label="Inscription" value={user.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR') : '—'} />
        </div>

        <div className="flex gap-2 border-t pt-4">
          <Button
            variant="outline"
            size="sm"
            disabled={!canModify || isDeleting}
            onClick={handleEdit}
            title={canModify ? 'Modifier cet utilisateur' : 'Modification indisponible pour les données de démonstration'}
          >
            Modifier
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-red-600 hover:text-red-700"
            disabled={!canModify || isDeleting}
            onClick={handleDelete}
            title={canModify ? 'Supprimer cet utilisateur' : 'Suppression indisponible pour les données de démonstration'}
          >
            {isDeleting ? 'Suppression…' : 'Supprimer'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function Detail({ label, value }: Readonly<{ label: string; value: string }>) {
  return (
    <div>
      <p className="text-xs font-medium uppercase text-muted-foreground">{label}</p>
      <p className="text-sm">{value}</p>
    </div>
  )
}
