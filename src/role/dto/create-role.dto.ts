import { IsNotEmpty, IsString, Length } from "class-validator"

export class CreateRoleDto {

    @IsString()
    @IsNotEmpty()
    name: string

    @IsString()
    @IsNotEmpty()
    @Length(5, 100)
    description: string
}