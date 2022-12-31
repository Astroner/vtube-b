import { IsNotEmpty, IsString } from "class-validator";

export class CreateUserDTO {
    @IsString()
    @IsNotEmpty()
    username!: string;

    @IsString()
    @IsNotEmpty()
    password!: string;

    @IsNotEmpty()
    @IsString()
    ytID!: string;
}

export class AuthDTO {
    @IsNotEmpty()
    @IsString()
    username!: string;

    @IsNotEmpty()
    @IsString()
    password!: string;
}
