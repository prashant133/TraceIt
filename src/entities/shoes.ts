import {
  PrimaryGeneratedColumn,
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from "typeorm";
import { User } from "./users";

@Entity("shoes")
export class Shoe {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "modelNumber", type: "varchar", unique: true })
  modelNumber!: string;

  @Column({ name: "brand", type: "varchar" })
  brand!: string;

  @Column({ name: "name", type: "varchar" })
  name!: string;

  @Column({ name: "description", type: "text" })
  description!: string;

  @Column({ name: "manufactureAt", type: "timestamp" })
  manufactureAt!: Date;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  createdBy!: User;

  @CreateDateColumn({
    name: "createdAt",
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
  })
  createdAt!: Date;

  @UpdateDateColumn({
    name: "updatedAt",
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
    onUpdate: "CURRENT_TIMESTAMP(6)",
  })
  updatedAt!: Date;
}
