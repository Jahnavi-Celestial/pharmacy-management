import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn} from "typeorm";
import { MedicineBatch } from "./medicineBatch.ts";

@Entity("medicines")
export class Medicine {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column('text', {nullable: false})
  medicineName!: string;

  @Column("text", { nullable: true })
  composition?: string;

  @Column("text", { nullable: true })
  medicineType?: string;

  @Column("text", { nullable: true })
  imageUrl?: string;

  @Column({ type: 'numeric' })
  price!: number;

  @Column("boolean", { default: false })
  prescriptionRequired!: boolean;

  @CreateDateColumn({type: "date"})
  createdAt!: Date;

  @UpdateDateColumn({type: "date"})
  updatedAt!: Date;

  @OneToMany(() => MedicineBatch, (batch) => batch.medicine)
  batches!: MedicineBatch[];
}