import { HttpService } from "@nestjs/axios";
import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { map } from "rxjs";
import { extractDataFromResponse } from "src/helpers/functions/extractDataFromResponse";
import { YTPlaylistWithID, YTVideo } from "src/Types";
import { Channel, Page } from "./channel.model";
import {
    YTChannelBasic,
    YTChannelPlaylists,
    YTChannelPlaylistsContinuation,
    YTChannelVideos,
    YTChannelVideosContinuation,
} from "./channel.native";

@Injectable()
export class ChannelService {
    constructor(private http: HttpService) {}

    getYoutubeChannelInfo(id: string) {
        return this.http
            .get<string>(`https://youtube.com/channel/${id}/`, {
                headers: {
                    cookie: "PREF=hl=en",
                },
            })
            .pipe(
                extractDataFromResponse<YTChannelBasic>(),
                map(
                    (data): Channel => ({
                        id: data.header.c4TabbedHeaderRenderer.channelId,
                        avatar: data.header.c4TabbedHeaderRenderer.avatar
                            .thumbnails,
                        background:
                            data.header.c4TabbedHeaderRenderer.banner
                                .thumbnails,
                        title: data.header.c4TabbedHeaderRenderer.title,
                        description:
                            data.metadata.channelMetadataRenderer.description ??
                            null,
                        tags: data.microformat.microformatDataRenderer.tags,
                    })
                )
            );
    }
    getYoutubeChannelVideos(id: string) {
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
                        items,
                        next: nextToken
                            ? {
                                  key: nextToken,
                              }
                            : null,
                    };
                })
            );
    }

    continueYoutubeChannelVideos(key: string) {
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
                                    item.richItemRenderer.content.videoRenderer
                                        .thumbnail.thumbnails,
                                title: item.richItemRenderer.content
                                    .videoRenderer.title.runs[0].text,
                            });
                        }
                    }

                    return {
                        items,
                        next: nextToken
                            ? {
                                  key: nextToken,
                              }
                            : null,
                    };
                })
            );
    }

    getYoutubeChannelPlaylists(id: string) {
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
                                    item.gridPlaylistRenderer.thumbnail
                                        .thumbnails,
                                list: item.gridPlaylistRenderer.playlistId,
                            });
                        }
                    }

                    return {
                        items,
                        next: nextToken
                            ? {
                                  key: nextToken,
                              }
                            : null,
                    };
                })
            );
    }

    continueYoutubeChannelPlaylists(key: string) {
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
                                    item.gridPlaylistRenderer.thumbnail
                                        .thumbnails,
                                list: item.gridPlaylistRenderer.playlistId,
                            });
                        }
                    }

                    return {
                        items,
                        next: nextToken
                            ? {
                                  key: nextToken,
                              }
                            : null,
                    };
                })
            );
    }
}
