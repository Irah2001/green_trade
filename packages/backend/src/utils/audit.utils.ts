

export interface AuditLogEntry {
  adminId: string;
  action: 'USER_ROLE_CHANGED' | 'USER_DELETED' | 'USER_UPDATED';
  targetUserId: string;
  details: Record<string, unknown>;
}

/**
 * Record an audit action to the database.
 * Useful for GDPR compliance and tracking administrative actions.
 */
export async function auditLog(entry: AuditLogEntry): Promise<void> {
  try {
    // Store audit log - you might want to create an AuditLog model in Prisma
    // For now, we log to console and could extend to a dedicated collection
    console.log(`[AUDIT] ${new Date().toISOString()} - ${entry.action} by ${entry.adminId} on ${entry.targetUserId}:`, entry.details);
    
    // Optionally store in database (uncomment if you create an AuditLog model)
    // await prisma.auditLog.create({
    //   data: {
    //     adminId: entry.adminId,
    //     action: entry.action,
    //     targetUserId: entry.targetUserId,
    //     details: entry.details,
    //     createdAt: new Date(),
    //   }
    // });
  } catch (error) {
    // Never fail the main operation if audit logging fails
    console.error('[AUDIT] Failed to write audit log:', error);
  }
}
