import { IsEmail, IsStrongPassword, IsString, MinLength, IsNotEmpty } from 'class-validator';


export class CreateUserDto {
    
    @IsString()
    firstname: string;
    
    @IsString()
    lastname: string;
    
    @IsEmail()
    @IsNotEmpty()
    email: string;
    
    @IsStrongPassword()
    @IsNotEmpty()
    password: string;

    @IsNotEmpty()
    @IsString()
    role: string

}