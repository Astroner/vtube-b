import {
    createParamDecorator,
    ExecutionContext,
    InternalServerErrorException,
} from "@nestjs/common";
import { validateSync } from "class-validator";
import { plainToInstance } from "class-transformer";
import { IncomingMessage } from "http";

import { User } from "../user.schema";

export const UserData = createParamDecorator(
    (_: unknown, ctx: ExecutionContext): User => {
        const request: IncomingMessage = ctx.switchToHttp().getRequest();
        const user: User = request["guarded_auth_user"];

        const toCheck = plainToInstance(User, user);

        const errors = validateSync(toCheck);

        if (errors.length > 0) {
            throw new InternalServerErrorException("CODE_FKN_RED");
        }

        return user;
    }
);
