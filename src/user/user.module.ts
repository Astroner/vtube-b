import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { MongooseModule } from "@nestjs/mongoose";
import { env } from "src/env";
import { AuthGuard } from "./guards/auth.guard";
import { UserController } from "./user.controller";
import { User, UserSchema } from "./user.schema";
import { UserService } from "./user.service";

@Module({
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        JwtModule.register({
            secret: env.JWT.SECRET,
            signOptions: {
                expiresIn: env.JWT.EXPIRES_IN,
            },
        }),
    ],
    exports: [UserService, AuthGuard],
    providers: [UserService, AuthGuard],
    controllers: [UserController],
})
export class UserModule {}
