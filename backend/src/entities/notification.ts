import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from "typeorm";
import { User } from "./users.ts";

@Entity("notifications")
export class Notification{
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({type: 'text'})
  title!: string;

  @Column({type: 'text'})
  message!: string;

  @Column({ type: "boolean", default: false })
  isRead!: boolean;

  @CreateDateColumn({type: "date"})
  createdAt!: Date;

  @ManyToOne(() => User, (user) => user.notifications)
  @JoinColumn({ name: "user_id" })
  user!: User;
}