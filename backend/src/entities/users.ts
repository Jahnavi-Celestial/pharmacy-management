import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { Sale } from "./sales.ts";
import { Notification } from "./notification.ts";
import { MedicineBatch } from "./medicineBatch.ts";
import { Customer } from "./customer.ts";

export enum UserRole{
  ADMIN = "ADMIN",
  SALESPERSON = "SALESPERSON",
}

@Entity("users")
export class User{
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({type: 'text'})
  name!: string;

  @Column({ type: "text", unique: true })
  email!: string;

  @Column({type: "text"})
  password!: string;

  @Column({type: "enum", enum: UserRole, default: UserRole.SALESPERSON})
  role!: UserRole;

  @CreateDateColumn({type: 'date'})
  createdAt!: Date;

  @UpdateDateColumn({type: 'date'})
  updatedAt!: Date;

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications!: Notification[];

  @OneToMany(() => Sale, (sale) => sale.salesPerson)
  sales!: Sale[];

  @OneToMany(() => MedicineBatch, medicineBatch => medicineBatch.id)
  batch!: MedicineBatch[];

  @OneToMany(() => Customer, customer => customer.salesPerson)
  customers!: Customer[];
}