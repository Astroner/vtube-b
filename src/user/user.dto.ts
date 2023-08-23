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
    psid!: string;

    @IsNotEmpty()
    @IsString()
    psidts!: string;
}

export class AuthDTO {
    @IsNotEmpty()
    @IsString()
    username!: string;

    @IsNotEmpty()
    @IsString()
    password!: string;
}
