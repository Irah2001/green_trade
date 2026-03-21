import Link from 'next/link'
import { Plus } from 'lucide-react'

// UI Components
import { Button } from '@/components/ui/button'

// Services
import { listAdminProducts } from '@/services/admin/products.service'

// Components
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import AdminCapabilityBanner from '@/components/admin/AdminCapabilityBanner'
import AdminProductsTable from '@/components/admin/products/AdminProductsTable'


export default async function AdminProductsPage() {
  const result = await listAdminProducts()

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Produits"
        description="Catalogue des produits publiés."
        actions={
          <Button asChild size="sm" className="bg-[#4A7C59] hover:bg-[#3a6349] text-white">
            <Link href="/admin/products/new">
              <Plus className="mr-1 h-4 w-4" />
              Nouveau
            </Link>
          </Button>
        }
      />
      <AdminCapabilityBanner resource="products" action="list" source={result.source} />
      <AdminProductsTable products={result.data} source={result.source} />
    </div>
  )
}
