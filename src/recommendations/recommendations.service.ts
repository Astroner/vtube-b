import { HttpService } from "@nestjs/axios";
import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { map, Observable } from "rxjs";

import { cutYTImageLink } from "src/helpers/functions/cutYTImageLink";
import { extractDataFromResponse } from "src/helpers/functions/extractDataFromResponse";
import { MusicCategories, Recommendation } from "./recommendations.model";
import {
    MusicRecommendations,
    YoutubeRecommendations,
} from "./recommendations.native";

@Injectable()
export class RecommendationsService {
    constructor(private http: HttpService) {}

    getYoutubeRecommendations(psid: string): Observable<Recommendation[]> {
        return this.http
            .get<string>("https://youtube.com", {
                headers: {
                    cookie: `__Secure-3PSID=${psid}; PREF=hl=en`,
                },
            })
            .pipe(
                extractDataFromResponse<YoutubeRecommendations>(),
                map((data) => {
                    // return data as any;
                    const videos =
                        data.contents.twoColumnBrowseResultsRenderer.tabs[0].tabRenderer.content.richGridRenderer.contents.slice(
                            0,
                            -1
                        );

                    return videos.map(({ richItemRenderer: { content } }) => {
                        if ("videoRenderer" in content) {
                            return {
                                type: "VIDEO",
                                title: content.videoRenderer.title.runs[0].text,
                                display:
                                    content.videoRenderer.thumbnail.thumbnails.map(
                                        cutYTImageLink
                                    ),
                                code: content.videoRenderer.videoId,
                            };
                        } else if ("radioRenderer" in content) {
                            return {
                                type: "DYNAMIC_PLAYLIST",
                                title: content.radioRenderer.title.simpleText,
                                display:
                                    content.radioRenderer.thumbnail.thumbnails.map(
                                        cutYTImageLink
                                    ),
                                list: content.radioRenderer.navigationEndpoint
                                    .watchEndpoint.playlistId,
                                code: content.radioRenderer.navigationEndpoint
                                    .watchEndpoint.videoId,
                            };
                        } else {
                            throw new InternalServerErrorException(
                                "UNKNOWN_RENDERER"
                            );
                        }
                    });
                })
            );
    }
    getMusicRecommendations(psid: string): Observable<MusicCategories> {
        return this.http
            .get<string>("https://music.youtube.com/", {
                headers: {
                    cookie: `__Secure-3PSID=${psid}; PREF=hl=en`,
                    "User-Agent":
                        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36",
                },
            })
            .pipe(
                map((res) => res.data),
                map((data) => {
                    const match = data.match(
                        /wse', params: (.+), data: (.+);ytcfg/gm
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
                map((json) => json && JSON.parse(json)),
                map((data: MusicRecommendations | null) => {
                    if (!data)
                        throw new InternalServerErrorException(
                            "CANNOT_PARSE_PLAYLIST"
                        );

                    return {
                        categories:
                            data.contents.singleColumnBrowseResultsRenderer.tabs[0].tabRenderer.content.sectionListRenderer.contents.map(
                                (category) => {
                                    const items: MusicCategories["categories"][0]["items"] =
                                        [];

                                    for (const item of category
                                        .musicCarouselShelfRenderer.contents) {
                                        if ("musicTwoRowItemRenderer" in item) {
                                            // Sometimes YTM recommends user's playlists and we cannot get their IDs so we just skip them
                                            if (
                                                !item.musicTwoRowItemRenderer
                                                    .navigationEndpoint
                                                    .watchEndpoint
                                            )
                                                continue;

                                            const list =
                                                item.musicTwoRowItemRenderer
                                                    .navigationEndpoint
                                                    .watchEndpoint.playlistId;

                                            const code =
                                                item.musicTwoRowItemRenderer
                                                    .navigationEndpoint
                                                    .watchEndpoint.videoId;

                                            const display =
                                                item.musicTwoRowItemRenderer.thumbnailRenderer.musicThumbnailRenderer.thumbnail.thumbnails.map(
                                                    cutYTImageLink
                                                );

                                            const title =
                                                item.musicTwoRowItemRenderer
                                                    .title.runs[0].text;

                                            if (list) {
                                                items.push({
                                                    type: "DYNAMIC_PLAYLIST",
                                                    code,
                                                    list,
                                                    display,
                                                    title,
                                                });
                                            } else {
                                                items.push({
                                                    type: "VIDEO",
                                                    code,
                                                    display,
                                                    title,
                                                });
                                            }
                                        } else if (
                                            "musicResponsiveListItemRenderer" in
                                            item
                                        ) {
                                            items.push({
                                                type: "DYNAMIC_PLAYLIST",
                                                title: item
                                                    .musicResponsiveListItemRenderer
                                                    .flexColumns[0]
                                                    .musicResponsiveListItemFlexColumnRenderer
                                                    .text.runs[0].text,
                                                display:
                                                    item.musicResponsiveListItemRenderer.thumbnail.musicThumbnailRenderer.thumbnail.thumbnails.map(
                                                        cutYTImageLink
                                                    ),
                                                list: item
                                                    .musicResponsiveListItemRenderer
                                                    .overlay
                                                    .musicItemThumbnailOverlayRenderer
                                                    .content
                                                    .musicPlayButtonRenderer
                                                    .playNavigationEndpoint
                                                    .watchEndpoint.playlistId,
                                                code: item
                                                    .musicResponsiveListItemRenderer
                                                    .overlay
                                                    .musicItemThumbnailOverlayRenderer
                                                    .content
                                                    .musicPlayButtonRenderer
                                                    .playNavigationEndpoint
                                                    .watchEndpoint.videoId,
                                            });
                                        } else {
                                            throw new InternalServerErrorException(
                                                "UNKNOWN_RENDERER"
                                            );
                                        }
                                    }

                                    return {
                                        title: category
                                            .musicCarouselShelfRenderer.header
                                            .musicCarouselShelfBasicHeaderRenderer
                                            .title.runs[0].text,
                                        items: items,
                                    };
                                }
                            ),
                    };
                })
            );
    }
}
