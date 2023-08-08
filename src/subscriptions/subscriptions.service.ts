import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { map, Observable } from "rxjs";
import { extractDataFromResponse } from "src/helpers/functions/extractDataFromResponse";
import { ChannelPreview } from "src/Types";
import { Subscriptions } from "./subscriptions.native";

@Injectable()
export class SubscriptionsService {
    constructor(private http: HttpService) {}

    getSubscriptions(psid: string): Observable<ChannelPreview[]> {
        return this.http
            .get("https://www.youtube.com/feed/channels", {
                headers: {
                    cookie: `__Secure-3PSID=${psid};PREF=hl=en;`,
                    "Accept-Language": "en",
                },
            })
            .pipe(
                extractDataFromResponse<Subscriptions>(),
                map((data) => {
                    return data.contents.twoColumnBrowseResultsRenderer.tabs[0].tabRenderer.content.sectionListRenderer.contents[0].itemSectionRenderer.contents[0].shelfRenderer.content.expandedShelfContentsRenderer.items.map(
                        (item) => {
                            return {
                                title: item.channelRenderer.title.simpleText,
                                display:
                                    item.channelRenderer.thumbnail.thumbnails,
                                id: item.channelRenderer.channelId,
                                description: null,
                                tag: null,
                            };
                        }
                    );
                })
            );
    }
}
