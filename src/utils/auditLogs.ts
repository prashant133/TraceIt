import { AppDataSource } from "../config/db/db";
import { AuditAction } from "../constants";
import { AuditLog } from "../entities/audiit-log";

export function createAuditLogs(
  action: AuditAction,
  entity: string,
  entityId: string,
  performedBy: string,
  metadata: Record<string, any>,
) {
  try {
    const auditRepository = AppDataSource.getRepository(AuditLog);

    const log = auditRepository.create({
      action,
      entity,
      entityId: entityId || null,
      performedBy: { id: performedBy },
      metadata: metadata || null,
    });

    auditRepository.save(log);
  } catch (error) {
    console.log("Audit log error", error);
  }
}
