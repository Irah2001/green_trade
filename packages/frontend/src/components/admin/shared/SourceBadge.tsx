import type { AdminDataSource } from '@/services/admin/admin-capabilities'

interface SourceBadgeProps {
  source: AdminDataSource
}

export default function SourceBadge({ source }: Readonly<SourceBadgeProps>) {
  if (source === 'api') return null

  const label = source === 'mock' ? 'Données de démonstration' : 'Non supporté'
  const cls =
    source === 'mock'
      ? 'bg-blue-100 text-blue-700 border-blue-200'
      : 'bg-amber-100 text-amber-700 border-amber-200'

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${cls}`}>
      {label}
    </span>
  )
}
