import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from "class-validator";

export class AddInventoryInput{
    @IsNotEmpty()
    @IsString()
    medicineId!: string;

    @IsNotEmpty()
    @IsString()
    userId!: string;

    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    sellingPrice!: number;
    
    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(100)
    discountPercent: number = 0;

    @IsNotEmpty()
    @IsNumber()
    @Min(1, { message: "minimum quantity must be atleast 1" })
    quantity!: number;

    @IsNotEmpty()
    @IsDateString()
    expiryDate!: string;
}

export class EditInventoryInput{
    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    sellingPrice!: number;
    
    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(100)
    discountPercent: number = 0;
}