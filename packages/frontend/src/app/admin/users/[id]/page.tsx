import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getAdminUser } from '@/services/admin/users.service'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import AdminCapabilityBanner from '@/components/admin/AdminCapabilityBanner'
import AdminUserProfileCard from '@/components/admin/users/AdminUserProfileCard'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

interface Props {
  params: Promise<{ id: string }>
}

export default async function AdminUserDetailPage({ params }: Props) {
  const { id } = await params
  const result = await getAdminUser(id)

  if (!result.data) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={`${result.data.firstName} ${result.data.lastName}`}
        actions={
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/users">
              <ArrowLeft className="mr-1 h-4 w-4" />
              Retour
            </Link>
          </Button>
        }
      />
      <AdminCapabilityBanner resource="users" action="detail" source={result.source} />
      <AdminUserProfileCard user={result.data} source={result.source} />
    </div>
  )
}
