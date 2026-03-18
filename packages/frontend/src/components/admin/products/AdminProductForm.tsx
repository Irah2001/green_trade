'use client'

import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { adminProductFormSchema, type AdminProductFormValues, PRODUCT_CATEGORY_LABELS } from './admin-product-form.schema'
import { createAdminProduct, updateAdminProduct } from '@/services/admin/products.service'

type Props =
  | { mode: 'create'; initialValues?: undefined; productId?: undefined }
  | { mode: 'edit'; initialValues: AdminProductFormValues; productId: string }

export default function AdminProductForm(props: Props) {
  const [status, setStatus] = useState<'idle' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const form = useForm({
    defaultValues: props.mode === 'edit' ? props.initialValues : {
      title: '',
      description: '',
      category: 'fruits' as const,
      price: 0,
      quantity: 0,
      unit: 'kg',
    },
    onSubmit: async ({ value }) => {
      const parsed = adminProductFormSchema.safeParse(value)
      if (!parsed.success) return

      const result = props.mode === 'create'
        ? await createAdminProduct(parsed.data)
        : await updateAdminProduct(props.productId!, parsed.data)

      if (result.source === 'unsupported') {
        setStatus('error')
        setErrorMessage(result.capabilityMessage || 'Erreur lors de la sauvegarde.')
      }
    },
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          {props.mode === 'create' ? 'Nouveau produit' : 'Modifier le produit'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {status === 'error' && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {errorMessage}
          </div>
        )}

        <form.Field name="title">
          {(field) => (
            <div className="space-y-1">
              <Label htmlFor="title">Titre</Label>
              <Input
                id="title"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            </div>
          )}
        </form.Field>

        <form.Field name="description">
          {(field) => (
            <div className="space-y-1">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            </div>
          )}
        </form.Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <form.Field name="category">
            {(field) => (
              <div className="space-y-1">
                <Label htmlFor="category">Catégorie</Label>
                <select
                  id="category"
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value as AdminProductFormValues['category'])}
                >
                  {Object.entries(PRODUCT_CATEGORY_LABELS).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </div>
            )}
          </form.Field>

          <form.Field name="price">
            {(field) => (
              <div className="space-y-1">
                <Label htmlFor="price">Prix (€)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(Number(e.target.value))}
                />
              </div>
            )}
          </form.Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <form.Field name="quantity">
            {(field) => (
              <div className="space-y-1">
                <Label htmlFor="quantity">Quantité</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(Number(e.target.value))}
                />
              </div>
            )}
          </form.Field>

          <form.Field name="unit">
            {(field) => (
              <div className="space-y-1">
                <Label htmlFor="unit">Unité</Label>
                <Input
                  id="unit"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="kg, pièce, botte..."
                />
              </div>
            )}
          </form.Field>
        </div>
      </CardContent>
      <CardFooter>
        <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting]}>
          {([canSubmit, isSubmitting]) => (
            <Button
              type="button"
              disabled={!canSubmit}
              className="bg-[#4A7C59] hover:bg-[#3a6349] text-white"
              onClick={form.handleSubmit}
            >
              {isSubmitting ? 'Envoi...' : props.mode === 'create' ? 'Créer' : 'Enregistrer'}
            </Button>
          )}
        </form.Subscribe>
      </CardFooter>
    </Card>
  )
}
