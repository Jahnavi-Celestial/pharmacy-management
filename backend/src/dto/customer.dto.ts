import { IsAlpha, IsEmail, IsMobilePhone, IsNotEmpty, IsString } from "class-validator";

export class CreateCustomerInput{
    @IsNotEmpty()
    @IsAlpha()
    fullName!: string;

    @IsNotEmpty()
    @IsEmail({}, {message: 'Invalid email format'})
    email!: string;

    @IsMobilePhone()
    phone?: string;

    @IsNotEmpty()
    @IsString()
    address!: string;
}

export class EditCustomerInput{
    @IsNotEmpty()
    @IsString()
    id!: string | string[] | undefined;

    @IsNotEmpty()
    @IsAlpha()
    fullName!: string;

    @IsNotEmpty()
    @IsEmail({}, {message: 'Invalid email format'})
    email!: string;

    @IsMobilePhone()
    phone?: string;

    @IsNotEmpty()
    @IsString()
    address!: string;
}