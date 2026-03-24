import Link from 'next/link'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import AdminProductForm from '@/components/admin/products/AdminProductForm'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export default function AdminProductNewPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Nouveau produit"
        actions={
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/products">
              <ArrowLeft className="mr-1 h-4 w-4" />
              Retour
            </Link>
          </Button>
        }
      />
      <AdminProductForm mode="create" />
    </div>
  )
}
