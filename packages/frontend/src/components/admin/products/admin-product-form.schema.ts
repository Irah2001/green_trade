import { z } from 'zod'

export const adminProductFormSchema = z.object({
  title: z.string().min(3, 'Le titre est requis (min. 3 caractères).'),
  description: z.string().min(10, 'La description est requise (min. 10 caractères).'),
  category: z.enum(['fruits', 'vegetables', 'baskets'], {
    errorMap: () => ({ message: 'Catégorie invalide.' }),
  }),
  price: z.coerce.number().positive('Le prix doit être positif.'),
  quantity: z.coerce.number().nonnegative('La quantité doit être positive ou nulle.'),
  unit: z.string().min(1, "L'unité est requise."),
})

export type AdminProductFormValues = z.infer<typeof adminProductFormSchema>

export const PRODUCT_CATEGORY_LABELS: Record<string, string> = {
  fruits: 'Fruits',
  vegetables: 'Légumes',
  baskets: 'Paniers',
}