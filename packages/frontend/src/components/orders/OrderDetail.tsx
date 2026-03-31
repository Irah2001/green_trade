import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { OrderRow, getOrderStatusMeta } from '@/services/order.service'

interface Props {
  order: OrderRow
}

export default function OrderDetail({ order }: Props) {
  const statusMeta = getOrderStatusMeta(order.status)

  return (
    <Card className="shadow-sm border-gray-200 overflow-hidden">
      <CardHeader className="flex flex-row items-start sm:items-center justify-between bg-gray-50/50 border-b pb-4 gap-4">
        <div>
          <CardTitle className="text-xl text-olive">
            Commande <span className="text-gray-500 text-base font-normal">#{order.id.slice(-8).toUpperCase()}</span>
          </CardTitle>
          <p className="text-sm text-gray-500 mt-1">
            Passée le {new Date(order.createdAt).toLocaleDateString('fr-FR', {
              day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
            })}
          </p>
        </div>

        <Badge variant="outline" className={`px-3 py-1 ${statusMeta.className}`}>
          {statusMeta.label}
        </Badge>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          <Detail label="Produit" value={order.productTitle} />
          <Detail label="Montant Total" value={`${order.amount.toFixed(2)} €`} />
          <Detail label="Quantité" value={`${order.quantity} unité(s)`} />
          
          <Detail label="Vendeur" value={order.sellerLabel} />
          <Detail label="Acheteur" value={order.buyerLabel} />

          {order.trackingNumber && (
            <Detail 
              label="Numéro de suivi" 
              value={order.trackingNumber} 
              subValue={order.carrier || 'Transporteur non précisé'}
            />
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function Detail({ label, value, subValue }: { label: string; value: string; subValue?: string }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">{label}</p>
      <p className="text-base font-medium text-gray-900">{value}</p>
      {subValue && <p className="text-sm text-gray-500">{subValue}</p>}
    </div>
  )
}
