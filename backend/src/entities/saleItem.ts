import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { MedicineBatch } from "./medicineBatch.ts";
import { Sale } from "./sales.ts";


@Entity("sale_items")
export class SaleItem{
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({type: 'int'})
  quantity!: number;

  @Column({type: 'numeric'})
  unitPrice!: number;

  @ManyToOne(() => Sale, (sale) => sale.items)
  @JoinColumn({ name: "sale_id" })
  sale!: Sale;

  @ManyToOne(() => MedicineBatch, (batch) => batch.saleItems, {onDelete: 'SET NULL'})
  @JoinColumn({ name: "batch_id" })
  batch!: MedicineBatch | null;
}