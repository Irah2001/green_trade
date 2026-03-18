import { AlertTriangle, Info } from 'lucide-react'
import { getAdminCapabilityLabel, type AdminAction, type AdminDataSource } from '@/services/admin/admin-capabilities'
import type { AdminResourceKey } from '@/features/admin/config/admin-resources'

interface AdminCapabilityBannerProps {
  resource: AdminResourceKey
  action: AdminAction
  source: AdminDataSource
}

export default function AdminCapabilityBanner({ resource, action, source }: AdminCapabilityBannerProps) {
  const label = getAdminCapabilityLabel(resource, action)
  const isUnsupported = source === 'unsupported'

  if (source === 'api') return null

  return (
    <div
      className={
        isUnsupported
          ? 'flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800'
          : 'flex items-start gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800'
      }
    >
      {isUnsupported ? (
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
      ) : (
        <Info className="mt-0.5 h-4 w-4 shrink-0" />
      )}
      <span>{label}</span>
    </div>
  )
}
