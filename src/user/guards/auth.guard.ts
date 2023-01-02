import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from "@nestjs/common";
import { IncomingMessage } from "http";
import { UserService } from "src/user/user.service";
import { User } from "../user.schema";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private users: UserService) {}

    async canActivate(context: ExecutionContext) {
        const request: IncomingMessage = context.switchToHttp().getRequest();
        if (!request.headers.authorization) throw new UnauthorizedException();

        const data = await this.users.verify(request.headers.authorization);

        if (!data) throw new UnauthorizedException();

        const user = await this.users.getUserById(data.id);

        if (!user) throw new UnauthorizedException();

        const dto: User = {
            password: user.password,
            username: user.username,
            ytID: user.ytID,
        };

        request["guarded_auth_user"] = dto;

        return true;
    }
}
