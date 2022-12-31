import { Controller, Get } from "@nestjs/common";
import { Protected } from "src/user/decorators/protected.decorator";
import { UserData } from "src/user/decorators/user-data.decorator";
import { User } from "src/user/user.schema";
import { SubscriptionsService } from "./subscriptions.service";

@Controller("subscriptions")
export class SubscriptionsController {
    constructor(private subscriptions: SubscriptionsService) {}

    @Protected()
    @Get()
    getSubscriptions(@UserData() user: User) {
        return this.subscriptions.getSubscriptions(user.ytID);
    }
}
