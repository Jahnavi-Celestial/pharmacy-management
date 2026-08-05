import { IsAlpha, IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { UserRole } from '../entities/users.ts';

export class RegisterInput{
  @IsNotEmpty()
  @IsAlpha()
  name!: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'Invalid email address format' })
  email!: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password!: string;

  @IsNotEmpty()
  @IsAlpha()
  role!: UserRole
}

export class LoginInput{
  @IsNotEmpty()
  @IsEmail({}, { message: 'Invalid email address format' })
  email!: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password!: string;
}