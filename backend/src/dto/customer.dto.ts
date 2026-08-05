import { IsEmail, IsMobilePhone, IsNotEmpty, IsString } from "class-validator";

export class CreateCustomerInput{
    @IsNotEmpty()
    @IsString()
    fullName!: string;

    @IsNotEmpty()
    @IsEmail({}, {message: 'Invalid email format'})
    email!: string;

    @IsMobilePhone()
    phone?: string;

    @IsNotEmpty()
    @IsString()
    address!: string;

    @IsNotEmpty()
    @IsString()
    userId!: string;
}

export class EditCustomerInput{
    @IsNotEmpty()
    @IsString()
    id!: string | string[] | undefined

    @IsNotEmpty()
    @IsString()
    fullName!: string;

    @IsNotEmpty()
    @IsEmail({}, {message: 'Invalid email format'})
    email!: string;

    @IsMobilePhone()
    phone?: string;

    @IsNotEmpty()
    @IsString()
    address!: string;

    @IsNotEmpty()
    @IsString()
    userId!: string;
}