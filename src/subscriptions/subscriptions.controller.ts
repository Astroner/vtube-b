import { Controller, Get, Param } from "@nestjs/common";
import { SubscriptionsService } from "./subscriptions.service";

@Controller("subscriptions")
export class SubscriptionsController {
    constructor(private subscriptions: SubscriptionsService) {}

    @Get(":psid")
    getSubscriptions(@Param("psid") psid: string) {
        return this.subscriptions.getSubscriptions(psid);
    }
}
