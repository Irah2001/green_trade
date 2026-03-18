import Link from 'next/link'
import type { AdminProductRow } from '@/services/admin/products.service'
import type { AdminDataSource } from '@/services/admin/admin-capabilities'
import { Button } from '@/components/ui/button'
import SourceBadge from '@/components/admin/shared/SourceBadge'
import { PRODUCT_CATEGORY_LABELS } from './admin-product-form.schema'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface Props {
  products: AdminProductRow[]
  source: AdminDataSource
}

export default function AdminProductsTable({ products, source }: Props) {
  if (products.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-8 text-center text-sm text-muted-foreground">
        Aucun produit à afficher.
      </div>
    )
  }

  return (
    <div className="rounded-lg border bg-card">
      <div className="flex items-center justify-between px-4 py-3">
        <p className="text-sm text-muted-foreground">{products.length} produit{products.length > 1 ? 's' : ''}</p>
        <SourceBadge source={source} />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Titre</TableHead>
            <TableHead>Catégorie</TableHead>
            <TableHead className="text-right">Prix</TableHead>
            <TableHead className="text-right">Stock</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="w-[80px]" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="font-medium">{product.title}</TableCell>
              <TableCell>{PRODUCT_CATEGORY_LABELS[product.category] ?? product.category}</TableCell>
              <TableCell className="text-right">{product.price.toFixed(2)} €</TableCell>
              <TableCell className="text-right">{product.quantity} {product.unit}</TableCell>
              <TableCell>
                <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                  product.status === 'active' ? 'bg-green-100 text-green-700' :
                  product.status === 'sold' ? 'bg-gray-100 text-gray-700' :
                  'bg-amber-100 text-amber-700'
                }`}>
                  {product.status === 'active' ? 'Actif' : product.status === 'sold' ? 'Vendu' : 'Réservé'}
                </span>
              </TableCell>
              <TableCell>
                <Button asChild variant="ghost" size="sm">
                  <Link href={`/admin/products/${product.id}`}>Voir</Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
