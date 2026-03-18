import type { AdminOrderRow } from '@/services/admin/orders.service'
import type { AdminDataSource } from '@/services/admin/admin-capabilities'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import SourceBadge from '@/components/admin/shared/SourceBadge'

const STATUS_LABEL: Record<string, string> = {
  pending: 'En attente',
  paid: 'Payée',
  delivered: 'Livrée',
  cancelled: 'Annulée',
}

interface Props {
  order: AdminOrderRow
  source: AdminDataSource
}

export default function AdminOrderDetail({ order, source }: Props) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Commande #{order.id}</CardTitle>
        <SourceBadge source={source} />
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        <Detail label="Acheteur" value={order.buyerName} />
        <Detail label="Produit" value={order.productTitle} />
        <Detail label="Statut" value={STATUS_LABEL[order.status] ?? order.status} />
        <Detail label="Montant" value={`${order.amount.toFixed(2)} €`} />
        <Detail label="Quantité" value={String(order.quantity)} />
        <Detail label="Livraison" value={order.deliveryMethod === 'delivery' ? 'Livraison' : 'Retrait'} />
        <Detail label="Date" value={new Date(order.createdAt).toLocaleDateString('fr-FR')} />
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
