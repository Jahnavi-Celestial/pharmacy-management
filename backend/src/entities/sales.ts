import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
} from "typeorm";
import { Customer } from "./customer.ts";
import { User } from "./users.ts";
import { SaleItem } from "./saleItem.ts";

@Entity("sales")
export class Sale{
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "text", unique: true })
  invoiceNumber!: string;

  @Column({type: 'numeric'})
  totalAmount!: number;

  @CreateDateColumn({type: 'date'})
  createdAt!: Date;

  @ManyToOne(() => Customer, (customer) => customer.sales, {nullable: true})
  @JoinColumn({ name: "customer_id" })
  customer?: Customer;

  @OneToMany(() => SaleItem, (item) => item.sale, {cascade: true})
  items!: SaleItem[];

  @ManyToOne(() => User, (user) => user.sales)
  @JoinColumn({ name: "sales_person_id" })
  salesPerson!: User;
}