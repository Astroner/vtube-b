import {
    Body,
    Controller,
    Get,
    Post,
    UnauthorizedException,
} from "@nestjs/common";
import { Protected } from "src/user/decorators/protected.decorator";
import { UserData } from "./decorators/user-data.decorator";
import { CreateUserDTO, AuthDTO } from "./user.dto";
import { User } from "./user.schema";
import { UserService } from "./user.service";

@Controller("user")
export class UserController {
    constructor(private userService: UserService) {}

    @Post("sign-up")
    async createUser(@Body() dto: CreateUserDTO) {
        await this.userService.createUser(dto);
        return;
    }

    @Post("sign-in")
    async auth(@Body() dto: AuthDTO) {
        const token = await this.userService.authenticate(dto);

        return { token };
    }

    @Protected()
    @Get("info")
    async getInfo(@UserData() user: User) {
        return {
            username: user.username,
        };
    }
}
