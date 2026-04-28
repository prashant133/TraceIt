import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./users";
import { AuditAction } from "../constants";

@Entity("audit_logs")
export class AuditLog {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "action", type: "enum", enum: AuditAction })
  action!: AuditAction;

  @Column({ name: "entity", type: "varchar" })
  entity!: string;

  @Column({ name: "entityId", type: "varchar", nullable: true, default: null })
  entityId!: string | null;

  @Column({ name: "metadata", type: "json", nullable: true, default: null })
  metadata!: Record<string, any> | null;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  performedBy!: User;

  @CreateDateColumn({ name: "createdAt", type: "timestamp" })
  createdAt!: Date;
}
