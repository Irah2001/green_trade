import { listAdminUsers } from '@/services/admin/users.service'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import AdminCapabilityBanner from '@/components/admin/AdminCapabilityBanner'
import AdminUsersTable from '@/components/admin/users/AdminUsersTable'

export default async function AdminUsersPage() {
  const result = await listAdminUsers()

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Utilisateurs" description="Gestion des comptes utilisateurs." />
      <AdminCapabilityBanner resource="users" action="list" source={result.source} />
      <AdminUsersTable users={result.data} source={result.source} />
    </div>
  )
}
