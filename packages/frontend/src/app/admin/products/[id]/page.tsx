import { notFound } from 'next/navigation'
// Services
import { getAdminProduct } from '@/services/admin/products.service'
// Components
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import AdminCapabilityBanner from '@/components/admin/AdminCapabilityBanner'
import AdminProductDetail from '@/components/admin/products/AdminProductDetail'
import AdminProductActions from '@/components/admin/products/AdminProductActions'


interface Props {
  params: Promise<{ id: string }>
}

export default async function AdminProductDetailPage({ params }: Readonly<Props>) {
  const { id } = await params
  const result = await getAdminProduct(id)

  if (!result.data) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={result.data.title}
        description={result.data.description}
        actions={<AdminProductActions productId={id} productTitle={result.data.title} />}
      />
      <AdminCapabilityBanner resource="products" action="detail" source={result.source} />
      <AdminProductDetail product={result.data} source={result.source} />
    </div>
  )
}
