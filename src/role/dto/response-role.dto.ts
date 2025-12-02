import { Expose } from "class-transformer";

export class ResponseRoleDto {

    @Expose()
    name: string;

    @Expose()
    description: string
}