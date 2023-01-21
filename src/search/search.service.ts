import { HttpService } from "@nestjs/axios";
import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { map } from "rxjs";

import { extractDataFromResponse } from "src/helpers/functions/extractDataFromResponse";
import {
    CollectionSearchEntry,
    SearchEntry,
    VideoSearchEntry,
} from "./search.model";
import { MusicSearchResult, YoutubeSearchResult } from "./search.native";

@Injectable()
export class SearchService {
    constructor(private http: HttpService) {}

    searchYoutube(text: string) {
        return this.http
            .get<string>("https://www.youtube.com/results", {
                params: {
                    search_query: text,
                },
                headers: {
                    cookie: "PREF=hl=en",
                },
            })
            .pipe(
                extractDataFromResponse<YoutubeSearchResult>(),
                map((data) => {
                    const result: SearchEntry[] = [];

                    for (const item of data.contents
                        .twoColumnSearchResultsRenderer.primaryContents
                        .sectionListRenderer.contents[0].itemSectionRenderer
                        .contents) {
                        if ("channelRenderer" in item) {
                            result.push({
                                type: "CHANNEL",
                                id: item.channelRenderer.channelId,
                                tag: item.channelRenderer.subscriberCountText
                                    .simpleText,
                                title: item.channelRenderer.title.simpleText,
                                description:
                                    item.channelRenderer.descriptionSnippet
                                        .runs[0].text,
                                display:
                                    item.channelRenderer.thumbnail.thumbnails,
                            });
                        } else if ("videoRenderer" in item) {
                            if (
                                item.videoRenderer.badges?.find(
                                    (badge) =>
                                        "metadataBadgeRenderer" in badge &&
                                        badge.metadataBadgeRenderer.label ===
                                            "LIVE"
                                )
                            )
                                continue;
                            result.push({
                                type: "VIDEO",
                                code: item.videoRenderer.videoId,
                                title: item.videoRenderer.title.runs[0].text,
                                display:
                                    item.videoRenderer.thumbnail.thumbnails,
                            });
                        } else if ("shelfRenderer" in item) {
                            const items: VideoSearchEntry[] = [];

                            for (const vod of item.shelfRenderer.content
                                .verticalListRenderer.items) {
                                if (
                                    vod.videoRenderer.badges?.find(
                                        (badge) =>
                                            "metadataBadgeRenderer" in badge &&
                                            badge.metadataBadgeRenderer
                                                .label === "LIVE"
                                    )
                                )
                                    continue;
                                items.push({
                                    type: "VIDEO",
                                    code: vod.videoRenderer.videoId,
                                    display:
                                        vod.videoRenderer.thumbnail.thumbnails,
                                    title: vod.videoRenderer.title.runs[0].text,
                                });
                            }

                            result.push({
                                type: "COLLECTION",
                                title: item.shelfRenderer.title.simpleText,
                                items,
                            });
                        }
                    }

                    return result;
                })
            );
    }

    searchMusic(text: string) {
        return this.http
            .get<string>("https://music.youtube.com/search", {
                params: {
                    q: text,
                },
                headers: {
                    "User-Agent":
                        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36",
                    cookie: "PREF=hl=en",
                },
            })
            .pipe(
                map((res) => res.data),
                map((data) => {
                    const match = data.match(
                        /search', params: (.+), data: (.+);ytcfg/gm
                    );
                    if (!match || !match[0]) return null;
                    const [text] = match;
                    const json = "" + text.slice(text.indexOf("data:") + 7, -9);

                    return json
                        .replace(/\\x(\d|\w)(\d|\w)/gm, (entry) => {
                            return String.fromCharCode(
                                parseInt(entry.slice(2), 16)
                            );
                        })
                        .replace(/\\+/gm, () => "\\");
                }),
                map((json) => json && (JSON.parse(json) as MusicSearchResult)),
                map((data) => {
                    if (!data)
                        throw new InternalServerErrorException(
                            "CANNOT_PARSE_SEARCH"
                        );

                    const result: CollectionSearchEntry[] = [];

                    for (const item of data.contents.tabbedSearchResultsRenderer
                        .tabs[0].tabRenderer.content.sectionListRenderer
                        .contents) {
                        const items: VideoSearchEntry[] = [];

                        for (const vod of item.musicShelfRenderer.contents) {
                            // here we filter everything but videos
                            if (
                                !vod.musicResponsiveListItemRenderer
                                    .playlistItemData
                            )
                                continue;
                            items.push({
                                type: "VIDEO",
                                code: vod.musicResponsiveListItemRenderer
                                    .playlistItemData.videoId,
                                display:
                                    vod.musicResponsiveListItemRenderer
                                        .thumbnail.musicThumbnailRenderer
                                        .thumbnail.thumbnails,
                                title: vod.musicResponsiveListItemRenderer
                                    .flexColumns[0]
                                    .musicResponsiveListItemFlexColumnRenderer
                                    .text.runs[0].text,
                            });
                        }

                        if (items.length === 0) continue;

                        result.push({
                            type: "COLLECTION",
                            title: item.musicShelfRenderer.title.runs[0].text,
                            items,
                        });
                    }

                    return result;
                })
            );
    }
}
