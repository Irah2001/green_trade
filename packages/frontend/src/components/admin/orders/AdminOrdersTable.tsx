import Link from 'next/link'
import type { AdminOrderRow } from '@/services/admin/orders.service'
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

const STATUS_LABEL: Record<string, string> = {
  pending: 'En attente',
  confirmed: 'Confirmée',
  cancelled: 'Annulée',
  paid: 'Confirmée',
}

const STATUS_CLASS: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700',
  confirmed: 'bg-blue-100 text-blue-700',
  cancelled: 'bg-red-100 text-red-700',
  paid: 'bg-blue-100 text-blue-700',
}

interface Props {
  orders: AdminOrderRow[]
  source: AdminDataSource
}

export default function AdminOrdersTable({ orders, source }: Readonly<Props>) {
  if (orders.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-8 text-center text-sm text-muted-foreground">
        Aucune commande à afficher.
      </div>
    )
  }

  return (
    <div className="rounded-lg border bg-card">
      <div className="flex items-center justify-between px-4 py-3">
        <p className="text-sm text-muted-foreground">{orders.length} commande{orders.length > 1 ? 's' : ''}</p>
        <SourceBadge source={source} />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Acheteur</TableHead>
            <TableHead>Produit</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="text-right">Montant</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="w-20" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">{order.buyerName}</TableCell>
              <TableCell>{order.productTitle}</TableCell>
              <TableCell>
                <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_CLASS[order.status] ?? 'bg-gray-100 text-gray-700'}`}>
                  {STATUS_LABEL[order.status] ?? order.status}
                </span>
              </TableCell>
              <TableCell className="text-right">{order.amount.toFixed(2)} €</TableCell>
              <TableCell>{new Date(order.createdAt).toLocaleDateString('fr-FR')}</TableCell>
              <TableCell>
                <Button asChild variant="ghost" size="sm">
                  <Link href={`/admin/orders/${order.id}`}>Voir</Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
