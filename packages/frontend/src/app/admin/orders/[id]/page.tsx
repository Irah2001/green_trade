import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getAdminOrder } from '@/services/admin/orders.service'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import AdminCapabilityBanner from '@/components/admin/AdminCapabilityBanner'
import AdminOrderDetail from '@/components/admin/orders/AdminOrderDetail'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

interface Props {
  params: Promise<{ id: string }>
}

export default async function AdminOrderDetailPage({ params }: Props) {
  const { id } = await params
  const result = await getAdminOrder(id)

  if (!result.data) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={`Commande #${result.data.id}`}
        actions={
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/orders">
              <ArrowLeft className="mr-1 h-4 w-4" />
              Retour
            </Link>
          </Button>
        }
      />
      <AdminCapabilityBanner resource="orders" action="detail" source={result.source} />
      <AdminOrderDetail order={result.data} source={result.source} />
    </div>
  )
}
