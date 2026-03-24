import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

import { getAdminProduct } from '@/services/admin/products.service'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import AdminProductForm from '@/components/admin/products/AdminProductForm'
import { Button } from '@/components/ui/button'

interface Props {
  params: Promise<{ id: string }>
}

export default async function AdminProductEditPage({ params }: Readonly<Props>) {
  const { id } = await params
  const result = await getAdminProduct(id)

  if (!result.data) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={`Modifier — ${result.data.title}`}
        actions={
          <Button asChild variant="outline" size="sm">
            <Link href={`/admin/products/${id}`}>
              <ArrowLeft className="mr-1 h-4 w-4" />
              Retour
            </Link>
          </Button>
        }
      />
      <AdminProductForm
        mode="edit"
        productId={id}
        initialValues={{
          title: result.data.title,
          description: result.data.description,
          category: result.data.category as any,
          price: result.data.price,
          quantity: result.data.quantity,
          unit: result.data.unit,
        }}
      />
    </div>
  )
}
