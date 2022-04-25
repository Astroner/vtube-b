import { HttpService } from "@nestjs/axios";
import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { map } from "rxjs";
import { Subscriptions } from "./subscriptions.native";

@Injectable()
export class SubscriptionsService {
    constructor(private http: HttpService) {}

    getSubscriptions(psid: string) {
        return this.http
            .get("https://www.youtube.com/feed/channels", {
                headers: {
                    cookie: `__Secure-3PSID=${psid};`,
                },
            })
            .pipe(
                map((res) => res.data.match(/var ytInitialData = (.+);</m)[1]),
                map((json) => json && JSON.parse(json)),
                map((data: Subscriptions | null) => {
                    if (!data)
                        throw new InternalServerErrorException(
                            "CANNOT_PARSE_SUBSCRIPTIONS"
                        );

                    return data.contents.twoColumnBrowseResultsRenderer.tabs[0].tabRenderer.content.sectionListRenderer.contents[0].itemSectionRenderer.contents[0].shelfRenderer.content.expandedShelfContentsRenderer.items.map(
                        (item) => {
                            return {
                                title: item.channelRenderer.title.simpleText,
                                display:
                                    item.channelRenderer.thumbnail.thumbnails,
                                id: item.channelRenderer.channelId,
                            };
                        }
                    );
                })
            );
    }
}
