import { HttpService } from "@nestjs/axios";
import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { map, Observable } from "rxjs";
import { extractDataFromResponse } from "src/helpers/functions/extractDataFromResponse";
import { ImageService } from "src/image/image.service";
import { Page, YoutubeChannel, YTPlaylistWithID, YTVideo } from "src/Types";

import {
    YTChannelBasic,
    YTChannelPlaylists,
    YTChannelPlaylistsContinuation,
    YTChannelVideos,
    YTChannelVideosContinuation,
} from "./channel.native";

@Injectable()
export class YoutubeChannelService {
    constructor(private http: HttpService, private image: ImageService) {}

    getYoutubeChannelInfo(id: string): Observable<YoutubeChannel> {
        return this.http
            .get<string>(`https://youtube.com/channel/${id}/`, {
                headers: {
                    cookie: "PREF=hl=en",
                },
            })
            .pipe(
                extractDataFromResponse<YTChannelBasic>(),
                map(
                    (data): YoutubeChannel => ({
                        id: data.header.c4TabbedHeaderRenderer.channelId,
                        avatar: data.header.c4TabbedHeaderRenderer.avatar.thumbnails.map(
                            this.image.wrapYTImage
                        ),
                        background:
                            data.header.c4TabbedHeaderRenderer.banner.thumbnails.map(
                                this.image.wrapYTImage
                            ),
                        title: data.header.c4TabbedHeaderRenderer.title,
                        description:
                            data.metadata.channelMetadataRenderer.description ??
                            null,
                        tags: data.microformat.microformatDataRenderer.tags,
                    })
                )
            );
    }
    getYoutubeChannelVideos(id: string): Observable<Page<YTVideo>> {
        return this.http
            .get<string>(`https://youtube.com/channel/${id}/videos/`, {
                headers: {
                    cookie: "PREF=hl=en",
                },
            })
            .pipe(
                extractDataFromResponse<YTChannelVideos>(),
                map((data): Page<YTVideo> => {
                    const items: YTVideo[] = [];
                    let nextToken: null | string = null;

                    const tab =
                        data.contents.twoColumnBrowseResultsRenderer.tabs.find(
                            (t) => t.tabRenderer.content
                        );

                    if (!tab)
                        throw new InternalServerErrorException(
                            "FAILED_TO_FIND_TAB"
                        );

                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    for (const item of tab.tabRenderer.content!.richGridRenderer
                        .contents) {
                        if ("continuationItemRenderer" in item) {
                            nextToken =
                                item.continuationItemRenderer
                                    .continuationEndpoint.continuationCommand
                                    .token;
                        } else {
                            items.push({
                                code: item.richItemRenderer.content
                                    .videoRenderer.videoId,
                                display:
                                    item.richItemRenderer.content.videoRenderer
                                        .thumbnail.thumbnails,
                                title: item.richItemRenderer.content
                                    .videoRenderer.title.runs[0].text,
                            });
                        }
                    }

                    return {
                        next: nextToken
                            ? {
                                  key: nextToken,
                              }
                            : null,
                        items,
                    };
                })
            );
    }

    continueYoutubeChannelVideos(key: string): Observable<Page<YTVideo>> {
        return this.http
            .post<YTChannelVideosContinuation>(
                "https://www.youtube.com/youtubei/v1/browse",
                {
                    continuation: key,
                    context: {
                        client: {
                            hl: "en",
                            clientName: "WEB",
                            clientVersion: "2.20230120.00.00",
                        },
                    },
                }
            )
            .pipe(
                map((res): Page<YTVideo> => {
                    const items: YTVideo[] = [];
                    let nextToken: null | string = null;

                    for (const item of res.data.onResponseReceivedActions[0]
                        .appendContinuationItemsAction.continuationItems) {
                        if ("continuationItemRenderer" in item) {
                            nextToken =
                                item.continuationItemRenderer
                                    .continuationEndpoint.continuationCommand
                                    .token;
                        } else {
                            items.push({
                                code: item.richItemRenderer.content
                                    .videoRenderer.videoId,
                                display:
                                    item.richItemRenderer.content.videoRenderer.thumbnail.thumbnails.map(
                                        this.image.wrapYTImage
                                    ),
                                title: item.richItemRenderer.content
                                    .videoRenderer.title.runs[0].text,
                            });
                        }
                    }

                    return {
                        next: nextToken
                            ? {
                                  key: nextToken,
                              }
                            : null,
                        items,
                    };
                })
            );
    }

    getYoutubeChannelPlaylists(id: string): Observable<Page<YTPlaylistWithID>> {
        return this.http
            .get<string>(`https://youtube.com/channel/${id}/playlists/`, {
                headers: {
                    cookie: "PREF=hl=en",
                },
            })
            .pipe(
                extractDataFromResponse<YTChannelPlaylists>(),
                map((data): Page<YTPlaylistWithID> => {
                    const items: YTPlaylistWithID[] = [];
                    let nextToken: null | string = null;

                    const tab =
                        data.contents.twoColumnBrowseResultsRenderer.tabs.find(
                            (t) => t.tabRenderer.content
                        );

                    if (!tab)
                        throw new InternalServerErrorException(
                            "FAILED_TO_FIND_TAB"
                        );

                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    for (const item of tab.tabRenderer.content!
                        .sectionListRenderer.contents[0].itemSectionRenderer
                        .contents[0].gridRenderer.items) {
                        if ("continuationItemRenderer" in item) {
                            nextToken =
                                item.continuationItemRenderer
                                    .continuationEndpoint.continuationCommand
                                    .token;
                        } else {
                            items.push({
                                title: item.gridPlaylistRenderer.title.runs[0]
                                    .text,
                                display:
                                    item.gridPlaylistRenderer.thumbnail.thumbnails.map(
                                        this.image.wrapYTImage
                                    ),
                                list: item.gridPlaylistRenderer.playlistId,
                            });
                        }
                    }

                    return {
                        next: nextToken
                            ? {
                                  key: nextToken,
                              }
                            : null,
                        items,
                    };
                })
            );
    }

    continueYoutubeChannelPlaylists(
        key: string
    ): Observable<Page<YTPlaylistWithID>> {
        return this.http
            .post<YTChannelPlaylistsContinuation>(
                "https://www.youtube.com/youtubei/v1/browse",
                {
                    continuation: key,
                    context: {
                        client: {
                            hl: "en",
                            clientName: "WEB",
                            clientVersion: "2.20230120.00.00",
                        },
                    },
                }
            )
            .pipe(
                map((res): Page<YTPlaylistWithID> => {
                    const items: YTPlaylistWithID[] = [];
                    let nextToken: null | string = null;

                    for (const item of res.data.onResponseReceivedActions[0]
                        .appendContinuationItemsAction.continuationItems) {
                        if ("continuationItemRenderer" in item) {
                            nextToken =
                                item.continuationItemRenderer
                                    .continuationEndpoint.continuationCommand
                                    .token;
                        } else {
                            items.push({
                                title: item.gridPlaylistRenderer.title.runs[0]
                                    .text,
                                display:
                                    item.gridPlaylistRenderer.thumbnail.thumbnails.map(
                                        this.image.wrapYTImage
                                    ),
                                list: item.gridPlaylistRenderer.playlistId,
                            });
                        }
                    }

                    return {
                        next: nextToken
                            ? {
                                  key: nextToken,
                              }
                            : null,
                        items,
                    };
                })
            );
    }

    getYoutubeChannelStreams(id: string): Observable<Page<YTVideo>> {
        return this.http
            .get<string>(`https://youtube.com/channel/${id}/streams/`, {
                headers: {
                    cookie: "PREF=hl=en",
                },
            })
            .pipe(
                extractDataFromResponse<YTChannelVideos>(),
                map((data): Page<YTVideo> => {
                    const items: YTVideo[] = [];
                    let nextToken: null | string = null;

                    const tab =
                        data.contents.twoColumnBrowseResultsRenderer.tabs.find(
                            (t) => t.tabRenderer.content
                        );

                    if (!tab)
                        throw new InternalServerErrorException(
                            "FAILED_TO_FIND_TAB"
                        );

                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    for (const item of tab.tabRenderer.content!.richGridRenderer
                        .contents) {
                        if ("continuationItemRenderer" in item) {
                            nextToken =
                                item.continuationItemRenderer
                                    .continuationEndpoint.continuationCommand
                                    .token;
                        } else {
                            if (
                                item.richItemRenderer.content.videoRenderer.thumbnailOverlays.find(
                                    (ov) =>
                                        "thumbnailOverlayTimeStatusRenderer" in
                                            ov &&
                                        ov.thumbnailOverlayTimeStatusRenderer
                                            .style === "LIVE"
                                )
                            )
                                continue;

                            items.push({
                                code: item.richItemRenderer.content
                                    .videoRenderer.videoId,
                                display:
                                    item.richItemRenderer.content.videoRenderer.thumbnail.thumbnails.map(
                                        this.image.wrapYTImage
                                    ),
                                title: item.richItemRenderer.content
                                    .videoRenderer.title.runs[0].text,
                            });
                        }
                    }

                    return {
                        next: nextToken
                            ? {
                                  key: nextToken,
                              }
                            : null,
                        items,
                    };
                })
            );
    }

    continueYoutubeChannelStreams(key: string): Observable<Page<YTVideo>> {
        return this.http
            .post<YTChannelVideosContinuation>(
                "https://www.youtube.com/youtubei/v1/browse",
                {
                    continuation: key,
                    context: {
                        client: {
                            hl: "en",
                            clientName: "WEB",
                            clientVersion: "2.20230120.00.00",
                        },
                    },
                }
            )
            .pipe(
                map((res): Page<YTVideo> => {
                    const items: YTVideo[] = [];
                    let nextToken: null | string = null;

                    for (const item of res.data.onResponseReceivedActions[0]
                        .appendContinuationItemsAction.continuationItems) {
                        if ("continuationItemRenderer" in item) {
                            nextToken =
                                item.continuationItemRenderer
                                    .continuationEndpoint.continuationCommand
                                    .token;
                        } else {
                            items.push({
                                code: item.richItemRenderer.content
                                    .videoRenderer.videoId,
                                display:
                                    item.richItemRenderer.content.videoRenderer.thumbnail.thumbnails.map(
                                        this.image.wrapYTImage
                                    ),
                                title: item.richItemRenderer.content
                                    .videoRenderer.title.runs[0].text,
                            });
                        }
                    }

                    return {
                        next: nextToken
                            ? {
                                  key: nextToken,
                              }
                            : null,
                        items,
                    };
                })
            );
    }
}
