import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { SubscriptionsController } from "./subscriptions.controller";
import { SubscriptionsService } from "./subscriptions.service";

@Module({
    controllers: [SubscriptionsController],
    providers: [SubscriptionsService],
    imports: [HttpModule],
})
export class SubscriptionsModule {}
