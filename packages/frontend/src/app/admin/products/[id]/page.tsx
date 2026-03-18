import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getAdminProduct } from '@/services/admin/products.service'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import AdminCapabilityBanner from '@/components/admin/AdminCapabilityBanner'
import AdminProductDetail from '@/components/admin/products/AdminProductDetail'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Pencil } from 'lucide-react'

interface Props {
  params: Promise<{ id: string }>
}

export default async function AdminProductDetailPage({ params }: Props) {
  const { id } = await params
  const result = await getAdminProduct(id)

  if (!result.data) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={result.data.title}
        actions={
          <div className="flex gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href="/admin/products">
                <ArrowLeft className="mr-1 h-4 w-4" />
                Retour
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href={`/admin/products/${id}/edit`}>
                <Pencil className="mr-1 h-4 w-4" />
                Modifier
              </Link>
            </Button>
          </div>
        }
      />
      <AdminCapabilityBanner resource="products" action="detail" source={result.source} />
      <AdminProductDetail product={result.data} source={result.source} />
    </div>
  )
}
