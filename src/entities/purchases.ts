import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from "typeorm";
import { User } from "./users";
import { Shoe } from "./shoes";

@Entity("purchases")
export class Purchase {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  user!: User;

  @ManyToOne(() => Shoe, { onDelete: "CASCADE" })
  shoe!: Shoe;

  @Column({ name: "purchaseAt", type: "timestamp" })
  purchasedAt!: Date;

  @CreateDateColumn({ name: "createdAt", type: "timestamp" })
  createdAt!: Date;
}
