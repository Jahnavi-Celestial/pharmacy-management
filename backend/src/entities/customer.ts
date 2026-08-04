import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from "typeorm";
import { Sale } from "./sales.ts";

@Entity("customers")
export class Customer{
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({type: "text"})
  fullName!: string;

  @Column({type: "text", nullable: true})
  phone?: string;

  @Column({ type: "text", nullable: false })
  email!: string;

  @Column({ type: "text" })
  address!: string;

  @CreateDateColumn({type: "date"})
  createdAt!: Date;

  @OneToMany(() => Sale, (sale) => sale.customer)
  sales!: Sale[];
}