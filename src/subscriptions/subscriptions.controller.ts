import { Controller, Get } from "@nestjs/common";
import { Observable } from "rxjs";
import { ChannelPreview } from "src/Types";
import { Protected } from "src/user/decorators/protected.decorator";
import { UserData } from "src/user/decorators/user-data.decorator";
import { User } from "src/user/user.schema";
import { SubscriptionsService } from "./subscriptions.service";

@Controller("subscriptions")
export class SubscriptionsController {
    constructor(private subscriptions: SubscriptionsService) {}

    @Protected()
    @Get()
    getSubscriptions(@UserData() user: User): Observable<ChannelPreview[]> {
        return this.subscriptions.getSubscriptions(user.psid, user.psidts);
    }
}
