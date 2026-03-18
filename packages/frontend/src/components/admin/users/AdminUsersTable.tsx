import Link from 'next/link'
import type { AdminUserRow } from '@/services/admin/users.service'
import type { AdminDataSource } from '@/services/admin/admin-capabilities'
import { Button } from '@/components/ui/button'
import SourceBadge from '@/components/admin/shared/SourceBadge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const ROLE_LABEL: Record<string, string> = {
  user: 'Utilisateur',
  admin: 'Admin',
  producer: 'Producteur',
}

interface Props {
  users: AdminUserRow[]
  source: AdminDataSource
}

export default function AdminUsersTable({ users, source }: Props) {
  if (users.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-8 text-center text-sm text-muted-foreground">
        Aucun utilisateur à afficher.
      </div>
    )
  }

  return (
    <div className="rounded-lg border bg-card">
      <div className="flex items-center justify-between px-4 py-3">
        <p className="text-sm text-muted-foreground">{users.length} utilisateur{users.length > 1 ? 's' : ''}</p>
        <SourceBadge source={source} />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Rôle</TableHead>
            <TableHead>Ville</TableHead>
            <TableHead className="text-right">Note</TableHead>
            <TableHead>Inscription</TableHead>
            <TableHead className="w-[80px]" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.firstName} {user.lastName}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <span className="inline-flex rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
                  {ROLE_LABEL[user.role] ?? user.role}
                </span>
              </TableCell>
              <TableCell>{user.city || '—'}</TableCell>
              <TableCell className="text-right">{user.rating.toFixed(1)}</TableCell>
              <TableCell>{new Date(user.createdAt).toLocaleDateString('fr-FR')}</TableCell>
              <TableCell>
                <Button asChild variant="ghost" size="sm">
                  <Link href={`/admin/users/${user.id}`}>Voir</Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
