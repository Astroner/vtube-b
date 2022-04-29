import { HttpService } from "@nestjs/axios";
import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { map, Observable } from "rxjs";
import { cutYTImageLink } from "src/helpers/cutYTImageLink";
import {
    DynamicPlaylistRecommendation,
    MusicCategories,
    Recommendation,
} from "./recommendations.model";
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
                    cookie: `__Secure-3PSID=${psid};`,
                },
            })
            .pipe(
                map((res) => res.data),
                map(
                    (data) =>
                        data.match(/var ytInitialData = (.+);</m)[1] ?? null
                ),
                map((json) => json && JSON.parse(json)),
                map((data: YoutubeRecommendations | null) => {
                    if (!data)
                        throw new InternalServerErrorException(
                            "CANNOT_PARSE_PLAYLIST"
                        );
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
                    cookie: `__Secure-3PSID=${psid};`,
                    "User-Agent":
                        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36",
                },
            })
            .pipe(
                map((res) => res.data),
                map((data) => {
                    const text = data.match(
                        /wse', params: (.+), data: (.+);ytcfg/gm
                    )[0];
                    if (!text) return null;
                    const json = "" + text.slice(text.indexOf("data:") + 7, -9);

                    return json.replace(/\\x(\d|\w)(\d|\w)/gm, (entry) => {
                        return String.fromCharCode(
                            parseInt(entry.slice(2), 16)
                        );
                    });
                }),
                map((json) => json && JSON.parse(json)),
                map((data: MusicRecommendations | null) => {
                    if (!data)
                        throw new InternalServerErrorException(
                            "CANNOT_PARSE_PLAyLIST"
                        );

                    return {
                        categories:
                            data.contents.singleColumnBrowseResultsRenderer.tabs[0].tabRenderer.content.sectionListRenderer.contents.map(
                                (category) => {
                                    const items: DynamicPlaylistRecommendation[] =
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

                                            items.push({
                                                type: "DYNAMIC_PLAYLIST",
                                                title: item
                                                    .musicTwoRowItemRenderer
                                                    .title.runs[0].text,
                                                display:
                                                    item.musicTwoRowItemRenderer.thumbnailRenderer.musicThumbnailRenderer.thumbnail.thumbnails.map(
                                                        cutYTImageLink
                                                    ),
                                                list: item
                                                    .musicTwoRowItemRenderer
                                                    .navigationEndpoint
                                                    .watchEndpoint.playlistId,
                                            });
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
