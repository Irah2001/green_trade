import { listAdminOrders } from '@/services/admin/orders.service'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import AdminCapabilityBanner from '@/components/admin/AdminCapabilityBanner'
import AdminOrdersTable from '@/components/admin/orders/AdminOrdersTable'

export const dynamic = 'force-dynamic';

export default async function AdminOrdersPage() {
  const result = await listAdminOrders()

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Commandes" description="Suivi centralisé des transactions." />
      <AdminCapabilityBanner resource="orders" action="list" source={result.source} />
      <AdminOrdersTable orders={result.data} source={result.source} />
    </div>
  )
}
