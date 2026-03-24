'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from '@tanstack/react-form'
// UI components
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { getErrorMessage } from '@/lib/utils'

import { adminProductFormSchema, type AdminProductFormValues, PRODUCT_CATEGORY_LABELS } from './admin-product-form.schema'
import { createAdminProduct, updateAdminProduct } from '@/services/admin/products.service'

type Props =
  | { mode: 'create'; initialValues?: never; productId?: never }
  | { mode: 'edit'; initialValues: AdminProductFormValues; productId: string }

export default function AdminProductForm(props: Props) {
  const router = useRouter()
  const { toast } = useToast()
  const [status, setStatus] = useState<'idle' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const submitLabel = props.mode === 'create' ? 'Créer' : 'Enregistrer'

  const form = useForm({
    defaultValues: props.mode === 'edit' ? props.initialValues : {
      title: '',
      description: '',
      category: 'fruits' as const,
      price: 0,
      quantity: 0,
      unit: 'kg',
    },
    validators: {
      onChange: ({ value }) => {
        const parsed = adminProductFormSchema.safeParse(value)
        if (parsed.success) return undefined
        return parsed.error.issues.map((issue) => issue.message).join(', ')
      },
    },
    onSubmit: async ({ value }) => {
      const parsed = adminProductFormSchema.safeParse(value)
      if (!parsed.success) {
        const validationMessage = parsed.error.issues.map((issue) => issue.message).join(', ')
        setStatus('error')
        setErrorMessage(validationMessage)
        toast({
          title: 'Formulaire invalide',
          description: 'Corrigez les champs signalés avant de sauvegarder.',
          variant: 'destructive',
        })
        return
      }

      const result = props.mode === 'create'
        ? await createAdminProduct(parsed.data)
        : await updateAdminProduct(props.productId, parsed.data)

      if (result.source === 'unsupported' || !result.data) {
        setStatus('error')
        setErrorMessage(result.capabilityMessage || 'Erreur lors de la sauvegarde.')
        toast({
          title: 'Sauvegarde impossible',
          description: result.capabilityMessage || 'Erreur lors de la sauvegarde.',
          variant: 'destructive',
        })
        return
      }

      setStatus('idle')
      setErrorMessage('')
      toast({
        title: props.mode === 'create' ? 'Produit créé' : 'Produit enregistré',
        description: props.mode === 'create'
          ? 'Le produit a bien été ajouté.'
          : 'Les modifications ont bien été sauvegardées.',
      })
      router.push(`/admin/products/${result.data.id}`)
      router.refresh()
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

        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
        >
          <form.Field name="title">
            {(field) => (
              <div className="space-y-1">
                <Label htmlFor="title">Titre</Label>
                <Input
                  id="title"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-red-600">{field.state.meta.errors.map(getErrorMessage).join(', ')}</p>
                )}
              </div>
            )}
          </form.Field>

          <form.Field name="description">
            {(field) => (
              <div className="space-y-1">
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  className="flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-red-600">{field.state.meta.errors.map(getErrorMessage).join(', ')}</p>
                )}
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
                    onBlur={field.handleBlur}
                    onChange={(e) => {
                      const category = e.target.value
                      if (category === 'fruits' || category === 'vegetables' || category === 'baskets') {
                        field.handleChange(category)
                      }
                    }}
                  >
                    {Object.entries(PRODUCT_CATEGORY_LABELS).map(([k, v]) => (
                      <option key={k} value={k}>{v}</option>
                    ))}
                  </select>
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-sm text-red-600">{field.state.meta.errors.map(getErrorMessage).join(', ')}</p>
                  )}
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
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(Number(e.target.value))}
                  />
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-sm text-red-600">{field.state.meta.errors.map(getErrorMessage).join(', ')}</p>
                  )}
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
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(Number(e.target.value))}
                  />
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-sm text-red-600">{field.state.meta.errors.map(getErrorMessage).join(', ')}</p>
                  )}
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
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="kg, pièce, botte..."
                  />
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-sm text-red-600">{field.state.meta.errors.map(getErrorMessage).join(', ')}</p>
                  )}
                </div>
              )}
            </form.Field>
          </div>

          <form.Subscribe selector={(s) => [s.errorMap]}>
            {([errorMap]) => {
              const error = errorMap.onSubmit || errorMap.onChange
              return error ? <p className="text-sm text-red-600">{getErrorMessage(error)}</p> : null
            }}
          </form.Subscribe>

          <CardFooter className="px-0 pb-0">
            <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting]}>
              {([canSubmit, isSubmitting]) => (
                <Button
                  type="submit"
                  disabled={!canSubmit || isSubmitting}
                  className="bg-olive hover:bg-olive-dark text-white"
                >
                  {isSubmitting ? 'Envoi...' : submitLabel}
                </Button>
              )}
            </form.Subscribe>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  )
}
