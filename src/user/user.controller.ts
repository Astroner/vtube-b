import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { env } from "src/env";
import { Protected } from "src/user/decorators/protected.decorator";
import { UserData } from "./decorators/user-data.decorator";
import { CreateUserDTO, AuthDTO } from "./user.dto";
import { User } from "./user.schema";
import { UserService } from "./user.service";

@Controller("user")
export class UserController {
    constructor(private userService: UserService) {}

    @Post("sign-up") 
    async createUser(@Body() dto: CreateUserDTO): Promise<void> {
        await this.userService.createUser(dto);
        return;
    }

    @Post("sign-in")
    async auth(@Body() dto: AuthDTO): Promise<{ token: string }> {
        const token = await this.userService.authenticate(dto);

        return { token };
    }

    @Protected()
    @Get("info")
    async getInfo(@UserData() user: User): Promise<{ username: string }> {
        return {
            username: user.username,
        };
    }

    @Get("dev-token/:name")
    async getDevToken(@Param("name") name: string): Promise<string> {
        if (env.NODE_ENV !== "development") return "FUCK YOU :)";

        return this.userService.getUserToken(name);
    }
}
