import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn, JoinColumn } from "typeorm";
import { Medicine } from "./medicine.ts";
import { SaleItem } from "./saleItem.ts";
import { User } from "./users.ts";

export enum BatchStatus{
  ACTIVE = "ACTIVE",
  EXPIRED = "EXPIRED",
}

@Entity("medicine_batches")
export class MedicineBatch{
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({type: 'numeric'})
  purchasePrice!: number;

  @Column({type: 'numeric'})
  sellingPrice!: number;

  @Column({type: 'numeric'})
  discountPercent!: number;

  @Column({type: "int"})
  quantity!: number;

  @Column({type: "int"})
  availableQuantity!: number;

  @Column({type: "date"})
  expiryDate!: Date;

  @Column({type: "enum", enum: BatchStatus, default: BatchStatus.ACTIVE})
  status!: BatchStatus;

  @CreateDateColumn({type: "date"})
  createdAt!: Date;

  @UpdateDateColumn({type: "date"})
  updatedAt!: Date;

  @ManyToOne(() => Medicine, (medicine) => medicine.batches)
  @JoinColumn({ name: "medicine_id" })
  medicine!: Medicine;

  @OneToMany(() => SaleItem, (item) => item.batch)
  saleItems!: SaleItem[];

  @ManyToOne(() => User, user => user.id)
  @JoinColumn({name: 'user_id'})
  users!: User;
}