import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Role } from "../constants";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "fullName" })
  fullName!: string;

  @Column({ name: "email", unique: true })
  email!: string;

  @Column({ name: "password" })
  password!: string;

  @Column({ enumName: "role", type: "enum", enum: Role, default: Role.USER })
  role!: Role;

  @Column({ name: "isEmailVerified", default: false })
  isEmailVerified!: boolean;

  @Column({ name: "loginAttempts", default: 0 })
  loginAttempts!: number;

  @Column({
    name: "refreshToken",
    type: "varchar",
    nullable: true,
    default: null,
  })
  refreshToken!: string | null;

  @CreateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
  })
  createdAt!: Date;

  @UpdateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
    onUpdate: "CURRENT_TIMESTAMP(6)",
  })
  updatedAt!: Date;
}
