import { HttpService } from "@nestjs/axios";
import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { map } from "rxjs";
import { cutYTImageLink } from "src/helpers/functions/cutYTImageLink";

import { extractDataFromResponse } from "src/helpers/functions/extractDataFromResponse";
import {
    CollectionSearchEntry,
    SearchEntry,
    VideoSearchEntry,
} from "./search.model";
import {
    isArtistTemplate,
    isAudioTemplate,
    MusicSearchResult,
    YoutubeSearchResult,
} from "./search.native";

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
                                        ?.runs[0].text ?? null,
                                display:
                                    item.channelRenderer.thumbnail.thumbnails.map(
                                        cutYTImageLink
                                    ),
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
                                    item.videoRenderer.thumbnail.thumbnails.map(
                                        cutYTImageLink
                                    ),
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
                                        vod.videoRenderer.thumbnail.thumbnails.map(
                                            cutYTImageLink
                                        ),
                                    title: vod.videoRenderer.title.runs[0].text,
                                });
                            }

                            result.push({
                                type: "COLLECTION",
                                title: item.shelfRenderer.title.simpleText,
                                items,
                            });
                        } else if ("playlistRenderer" in item) {
                            result.push({
                                type: "PLAYLIST",
                                title: item.playlistRenderer.title.simpleText,
                                display:
                                    item.playlistRenderer.thumbnails[0]
                                        .thumbnails,
                                list: item.playlistRenderer.playlistId,
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

                    const content =
                        data.contents.tabbedSearchResultsRenderer.tabs[0]
                            .tabRenderer.content.sectionListRenderer.contents;

                    for (const item of content) {
                        const items: CollectionSearchEntry["items"] = [];

                        if (!("musicShelfRenderer" in item)) continue;

                        for (const entry of item.musicShelfRenderer.contents) {
                            if (isAudioTemplate(entry)) {
                                items.push({
                                    type: "VIDEO",
                                    code: entry.musicResponsiveListItemRenderer
                                        .playlistItemData.videoId,
                                    display:
                                        entry.musicResponsiveListItemRenderer.thumbnail.musicThumbnailRenderer.thumbnail.thumbnails.map(
                                            cutYTImageLink
                                        ),
                                    title: entry.musicResponsiveListItemRenderer
                                        .flexColumns[0]
                                        .musicResponsiveListItemFlexColumnRenderer
                                        .text.runs[0].text,
                                });
                            } else if (isArtistTemplate(entry)) {
                                items.push({
                                    type: "CHANNEL",
                                    description: null,
                                    display:
                                        entry.musicResponsiveListItemRenderer
                                            .thumbnail.musicThumbnailRenderer
                                            .thumbnail.thumbnails,
                                    id: entry.musicResponsiveListItemRenderer
                                        .navigationEndpoint.browseEndpoint
                                        .browseId,
                                    tag: null,
                                    title: entry.musicResponsiveListItemRenderer
                                        .flexColumns[0]
                                        .musicResponsiveListItemFlexColumnRenderer
                                        .text.runs[0].text,
                                });
                            } else {
                                items.push({
                                    type: "PLAYLIST",
                                    display:
                                        entry.musicResponsiveListItemRenderer
                                            .thumbnail.musicThumbnailRenderer
                                            .thumbnail.thumbnails,
                                    list: entry.musicResponsiveListItemRenderer
                                        .overlay
                                        .musicItemThumbnailOverlayRenderer
                                        .content.musicPlayButtonRenderer
                                        .playNavigationEndpoint
                                        .watchPlaylistEndpoint.playlistId,
                                    title: entry.musicResponsiveListItemRenderer
                                        .flexColumns[0]
                                        .musicResponsiveListItemFlexColumnRenderer
                                        .text.runs[0].text,
                                });
                            }
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
