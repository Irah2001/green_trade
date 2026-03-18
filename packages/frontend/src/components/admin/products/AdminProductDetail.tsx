import type { AdminProductRow } from '@/services/admin/products.service'
import type { AdminDataSource } from '@/services/admin/admin-capabilities'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PRODUCT_CATEGORY_LABELS } from './admin-product-form.schema'
import SourceBadge from '@/components/admin/shared/SourceBadge'

interface Props {
  product: AdminProductRow
  source: AdminDataSource
}

export default function AdminProductDetail({ product, source }: Props) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">{product.title}</CardTitle>
        <SourceBadge source={source} />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Detail label="Catégorie" value={PRODUCT_CATEGORY_LABELS[product.category] ?? product.category} />
          <Detail label="Prix" value={`${product.price.toFixed(2)} € / ${product.unit}`} />
          <Detail label="Stock" value={`${product.quantity} ${product.unit}`} />
          <Detail label="Statut" value={product.status === 'active' ? 'Actif' : product.status === 'sold' ? 'Vendu' : 'Réservé'} />
          <Detail label="Bio" value={product.organic ? 'Oui' : 'Non'} />
          <Detail label="Ville" value={product.city || '—'} />
          <Detail label="Créé le" value={new Date(product.createdAt).toLocaleDateString('fr-FR')} />
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
