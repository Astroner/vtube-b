import { HttpService } from "@nestjs/axios";
import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { map, Observable } from "rxjs";

import { extractDataFromResponse } from "src/helpers/functions/extractDataFromResponse";
import { ImageService } from "src/image/image.service";
import { MusicCategories, Recommendation } from "./recommendations.model";
import {
    MusicRecommendations,
    YoutubeRecommendations,
} from "./recommendations.native";

@Injectable()
export class RecommendationsService {
    constructor(private http: HttpService, private image: ImageService) {}

    getYoutubeRecommendations(
        psid: string,
        psidts: string
    ): Observable<Recommendation[]> {
        return this.http
            .get<string>("https://youtube.com", {
                headers: {
                    cookie: `__Secure-3PSID=${psid}; __Secure-3PSIDTS=${psidts}; PREF=hl=en;`,
                    "Accept-Language": "en",
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

                    const recommendations: Recommendation[] = [];

                    for (const item of videos) {
                        // filter reels and posts
                        if ("richSectionRenderer" in item) continue;

                        const { content } = item.richItemRenderer;

                        if ("videoRenderer" in content) {
                            recommendations.push({
                                type: "VIDEO",
                                value: {
                                    title: content.videoRenderer.title.runs[0]
                                        .text,
                                    display:
                                        content.videoRenderer.thumbnail.thumbnails.map(
                                            this.image.wrapYTImage
                                        ),
                                    code: content.videoRenderer.videoId,
                                },
                            });
                        } else if ("radioRenderer" in content) {
                            recommendations.push({
                                type: "DYNAMIC_PLAYLIST",
                                value: {
                                    title: content.radioRenderer.title
                                        .simpleText,
                                    display:
                                        content.radioRenderer.thumbnail.thumbnails.map(
                                            this.image.wrapYTImage
                                        ),
                                    list: content.radioRenderer
                                        .navigationEndpoint.watchEndpoint
                                        .playlistId,
                                    code: content.radioRenderer
                                        .navigationEndpoint.watchEndpoint
                                        .videoId,
                                },
                            });
                        } else {
                            throw new InternalServerErrorException(
                                "UNKNOWN_RENDERER"
                            );
                        }
                    }

                    return recommendations;
                })
            );
    }
    getMusicRecommendations(
        psid: string,
        psidts: string
    ): Observable<MusicCategories> {
        return this.http
            .get<string>("https://music.youtube.com/", {
                headers: {
                    cookie: `__Secure-3PSID=${psid}; __Secure-3PSIDTS=${psidts}; PREF=hl=en`,
                    "User-Agent":
                        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36",
                    "Accept-Language": "en",
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
                                                    this.image.wrapYTImage
                                                );

                                            const title =
                                                item.musicTwoRowItemRenderer
                                                    .title.runs[0].text;

                                            if (list) {
                                                items.push({
                                                    type: "DYNAMIC_PLAYLIST",
                                                    value: {
                                                        code,
                                                        list,
                                                        display,
                                                        title,
                                                    },
                                                });
                                            } else {
                                                items.push({
                                                    type: "VIDEO",
                                                    value: {
                                                        code,
                                                        display,
                                                        title,
                                                    },
                                                });
                                            }
                                        } else if (
                                            "musicResponsiveListItemRenderer" in
                                            item
                                        ) {
                                            items.push({
                                                type: "DYNAMIC_PLAYLIST",
                                                value: {
                                                    title: item
                                                        .musicResponsiveListItemRenderer
                                                        .flexColumns[0]
                                                        .musicResponsiveListItemFlexColumnRenderer
                                                        .text.runs[0].text,
                                                    display:
                                                        item.musicResponsiveListItemRenderer.thumbnail.musicThumbnailRenderer.thumbnail.thumbnails.map(
                                                            this.image
                                                                .wrapYTImage
                                                        ),
                                                    list: item
                                                        .musicResponsiveListItemRenderer
                                                        .overlay
                                                        .musicItemThumbnailOverlayRenderer
                                                        .content
                                                        .musicPlayButtonRenderer
                                                        .playNavigationEndpoint
                                                        .watchEndpoint
                                                        .playlistId,
                                                    code: item
                                                        .musicResponsiveListItemRenderer
                                                        .overlay
                                                        .musicItemThumbnailOverlayRenderer
                                                        .content
                                                        .musicPlayButtonRenderer
                                                        .playNavigationEndpoint
                                                        .watchEndpoint.videoId,
                                                },
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
