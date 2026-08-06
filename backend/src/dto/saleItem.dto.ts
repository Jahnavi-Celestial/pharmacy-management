import { IsNotEmpty, IsString, IsArray, IsNumber, IsPositive } from 'class-validator';
 
class SaleItemInput{
  @IsNotEmpty()
  @IsString()
  medicineId!: string;
 
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  quantity!: number;
}

export class CreateSaleInput{
  @IsNotEmpty()
  @IsString()
  customerId!: string;
 
  @IsNotEmpty()
  @IsString()
  salesPersonId!: string;
 
  @IsArray()
  items!: SaleItemInput[];
}
 