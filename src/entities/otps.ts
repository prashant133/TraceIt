import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

import { OTPType } from "../constants";
import { User } from "./users";

@Entity("otps")
export class Otp {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "otpCode", type: "varchar" })
  otpCode!: string;

  @Column({ name: "otpType", type: "enum", enum: OTPType })
  type!: OTPType;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  user!: User;

  @Column({ name: "shoeId", type: "varchar", nullable: true, default: null })
  shoeId!: string | null;

  @Column({ name: "expiresAt", type: "timestamp" })
  expiresAt!: Date;

  @Column({ name: "isUsed", default: false })
  isUsed!: boolean;

  @CreateDateColumn()
  createdAt!: Date;
}
