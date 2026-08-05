import { IsInt, IsString } from "class-validator";


export class GetMedicineInput{
    @IsInt()
    page!: number;

    @IsInt()
    limit!: number;

    @IsString()
    search?: string;
}