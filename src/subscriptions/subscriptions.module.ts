import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { UserModule } from "src/user/user.module";
import { SubscriptionsController } from "./subscriptions.controller";
import { SubscriptionsService } from "./subscriptions.service";

@Module({
    controllers: [SubscriptionsController],
    providers: [SubscriptionsService],
    imports: [HttpModule, UserModule],
})
export class SubscriptionsModule {}
