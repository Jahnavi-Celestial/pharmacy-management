import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Sale } from "./sales.ts";
import { User } from "./users.ts";

@Entity("customers")
export class Customer{
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({type: "text"})
  fullName!: string;

  @Column({type: "text", nullable: true, unique: true})
  phone?: string;

  @Column({ type: "text", nullable: false, unique: true })
  email!: string;

  @Column({ type: "text" })
  address!: string;

  @CreateDateColumn({type: "date"})
  createdAt!: Date;

  @OneToMany(() => Sale, (sale) => sale.customer)
  sales!: Sale[];

  @ManyToOne(() => User, (user) => user.customers)
  @JoinColumn({ name: "sales_person_id" })
  salesPerson!: User;
}