"use client"

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { deleteAdminProduct } from '@/services/admin/products.service'

interface Props {
  productId: string
  productTitle: string
  canModify?: boolean
}

export default function AdminProductActions({ productId, productTitle, canModify = true }: Readonly<Props>) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!globalThis.confirm(`Supprimer le produit ${productTitle} ? Cette action est irréversible.`)) {
      return
    }

    setIsDeleting(true)
    const result = await deleteAdminProduct(productId)

    if (result.source === 'api') {
      router.push('/admin/products')
      router.refresh()
    } else {
      alert(result.capabilityMessage ?? 'Impossible de supprimer ce produit.')
    }

    setIsDeleting(false)
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button asChild variant="outline" size="sm" className="text-white bg-black hover:bg-white hover:text-black hover:border-black">
        <Link href="/admin/products">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Retour
        </Link>
      </Button>

      {canModify ? (
        <Button asChild variant="outline" size="sm">
          <Link href={`/admin/products/${productId}/edit`}>
            <Pencil className="mr-1 h-4 w-4" />
            Modifier
          </Link>
        </Button>
      ) : (
        <Button variant="outline" size="sm" disabled title="Modification indisponible pour cette source de données">
          <Pencil className="mr-1 h-4 w-4" />
          Modifier
        </Button>
      )}

      <Button
        variant="outline"
        size="sm"
        className="border-red-200 text-red-600 hover:text-red-700 hover:bg-red-50"
        disabled={!canModify || isDeleting}
        onClick={handleDelete}
        title={canModify ? 'Supprimer ce produit' : 'Suppression indisponible pour cette source de données'}
      >
        <Trash2 className="mr-1 h-4 w-4" />
        {isDeleting ? 'Suppression…' : 'Supprimer'}
      </Button>
    </div>
  )
}
