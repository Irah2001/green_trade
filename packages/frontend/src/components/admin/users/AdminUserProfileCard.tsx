import type { AdminUserRow } from '@/services/admin/users.service'
import type { AdminDataSource } from '@/services/admin/admin-capabilities'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import SourceBadge from '@/components/admin/shared/SourceBadge'

const ROLE_LABEL: Record<string, string> = {
  user: 'Utilisateur',
  admin: 'Admin',
  producer: 'Producteur',
}

interface Props {
  user: AdminUserRow
  source: AdminDataSource
}

export default function AdminUserProfileCard({ user, source }: Props) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">{user.firstName} {user.lastName}</CardTitle>
        <SourceBadge source={source} />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Detail label="Email" value={user.email} />
          <Detail label="Rôle" value={ROLE_LABEL[user.role] ?? user.role} />
          <Detail label="Ville" value={user.city || '—'} />
          <Detail label="Note" value={user.rating.toFixed(1)} />
          <Detail label="Inscription" value={new Date(user.createdAt).toLocaleDateString('fr-FR')} />
        </div>

        <div className="flex gap-2 border-t pt-4">
          <Button variant="outline" size="sm" disabled title="Endpoint backend non disponible">
            Modifier
          </Button>
          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700" disabled title="Endpoint backend non disponible">
            Supprimer
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase text-muted-foreground">{label}</p>
      <p className="text-sm">{value}</p>
    </div>
  )
}
