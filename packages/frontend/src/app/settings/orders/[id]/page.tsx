import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'

import OrderDetail from '@/components/orders/OrderDetail'

import { orderService } from '@/services/order.service'

interface Props {
  params: Promise<{ id: string }>
}

export default async function OrderDetailPage({ params }: Readonly<Props>) {
  const { id } = await params

  let orderData = null;
  
  try {
    orderData = await orderService.getOrderById(id);
  } catch (error) {
    console.error("Erreur lors de la récupération de la commande:", error);
  }

  if (!orderData) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-light-green/30 flex items-center justify-center">
            <Package className="h-5 w-5 text-olive" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Détails de la commande</h1>
        </div>
        
        <Button asChild variant="outline" size="sm" className="border-gray-300">
          <Link href="/settings/orders">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Link>
        </Button>
      </div>

      <OrderDetail order={orderData} />
    </div>
  )
}
