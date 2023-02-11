import { HttpService } from "@nestjs/axios";
import {
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from "@nestjs/common";
import { map, Observable } from "rxjs";
import { cutYTImageLink } from "src/helpers/functions/cutYTImageLink";
import { extractDataFromResponse } from "src/helpers/functions/extractDataFromResponse";
import { Page, YTImage, YTPlaylistWithID, YTVideo } from "src/Types";
import { Playlist } from "./playlist.model";
import {
    DynamicPlaylist,
    PlaylistContinuation,
    PlaylistData,
    PlaylistError,
    UserLibrary,
} from "./playlist.native";

@Injectable()
export class PlaylistService {
    constructor(private http: HttpService) {}
    getPlaylist(list: string): Observable<Playlist> {
        return this.http
            .get<string>("https://youtube.com/playlist", {
                params: { list },
                headers: {
                    cookie: "PREF=hl=en",
                },
            })
            .pipe(
                extractDataFromResponse<PlaylistData | PlaylistError>(),
                map((json) => {
                    if ("metadata" in json) {
                        const items: Playlist["list"]["items"] = [];
                        let next: string | null = null;

                        const content =
                            json.contents.twoColumnBrowseResultsRenderer.tabs[0]
                                .tabRenderer.content.sectionListRenderer
                                .contents[0].itemSectionRenderer.contents[0]
                                .playlistVideoListRenderer.contents;

                        for (const item of content) {
                            if ("playlistVideoRenderer" in item) {
                                items.push({
                                    title: item.playlistVideoRenderer.title
                                        .runs[0].text,
                                    code: item.playlistVideoRenderer.videoId,
                                    display:
                                        item.playlistVideoRenderer.thumbnail.thumbnails.map(
                                            cutYTImageLink
                                        ),
                                });
                            } else {
                                next =
                                    item.continuationItemRenderer
                                        .continuationEndpoint
                                        .continuationCommand.token;
                            }
                        }

                        return {
                            title: json.metadata.playlistMetadataRenderer.title,
                            display:
                                json.microformat.microformatDataRenderer.thumbnail.thumbnails.map(
                                    cutYTImageLink
                                ),
                            list: {
                                next: !next
                                    ? null
                                    : {
                                          key: next,
                                      },
                                items,
                            },
                        };
                    }
                    throw new NotFoundException();
                })
            );
    }

    continuePlaylist(continuation: string): Observable<Page<YTVideo>> {
        return this.http
            .post<PlaylistContinuation>(
                "https://www.youtube.com/youtubei/v1/browse/",
                {
                    continuation,
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
                map((res) => res.data),
                map((data) => {
                    const items: YTVideo[] = [];
                    let next: string | null = null;

                    for (const item of data.onResponseReceivedActions[0]
                        .appendContinuationItemsAction.continuationItems) {
                        if ("playlistVideoRenderer" in item) {
                            items.push({
                                title: item.playlistVideoRenderer.title.runs[0]
                                    .text,
                                code: item.playlistVideoRenderer.videoId,
                                display:
                                    item.playlistVideoRenderer.thumbnail
                                        .thumbnails,
                            });
                        } else {
                            next =
                                item.continuationItemRenderer
                                    .continuationEndpoint.continuationCommand
                                    .token;
                        }
                    }

                    return {
                        next: !next
                            ? null
                            : {
                                  key: next,
                              },
                        items,
                    };
                })
            );
    }

    getDynamicPlaylist(
        psid: string,
        list: string,
        code: string
    ): Observable<Playlist> {
        return this.http
            .get<string>("https://youtube.com/watch", {
                params: { list, v: code },
                headers: {
                    cookie: `__Secure-3PSID=${psid};`,
                },
            })
            .pipe(
                extractDataFromResponse<DynamicPlaylist>(),
                map((data: DynamicPlaylist) => {
                    if (!data)
                        throw new InternalServerErrorException(
                            "CANNOT_PARSE_DYNAMIC_PLAYLIST"
                        );

                    if (
                        !("playlist" in data.contents.twoColumnWatchNextResults)
                    )
                        throw new NotFoundException();

                    const playlist =
                        data.contents.twoColumnWatchNextResults.playlist
                            .playlist;

                    let display: YTImage[] = [];
                    const list: YTVideo[] = [];

                    for (const item of playlist.contents) {
                        // filter "YT is not avaliable on your device" video
                        if (
                            item.playlistPanelVideoRenderer.navigationEndpoint
                                .watchEndpoint.videoId === "9xp1XWmJ_Wo"
                        )
                            continue;

                        if (display.length === 0) {
                            display =
                                item.playlistPanelVideoRenderer.thumbnail.thumbnails.map(
                                    cutYTImageLink
                                );
                        }

                        list.push({
                            title: item.playlistPanelVideoRenderer.title
                                .simpleText,
                            code: item.playlistPanelVideoRenderer
                                .navigationEndpoint.watchEndpoint.videoId,
                            display:
                                item.playlistPanelVideoRenderer.thumbnail.thumbnails.map(
                                    cutYTImageLink
                                ),
                        });
                    }

                    return {
                        title: playlist.title,
                        display,
                        list: {
                            next: null,
                            items: list,
                        },
                    };
                })
            );
    }

    getAll(ytID: string) {
        return this.http
            .get("https://www.youtube.com/feed/library", {
                headers: {
                    cookie: `__Secure-3PSID=${ytID};`,
                },
            })
            .pipe(
                extractDataFromResponse<UserLibrary>(),
                map((data) => {
                    return data.contents.twoColumnBrowseResultsRenderer.tabs[0]
                        .tabRenderer.content.sectionListRenderer.contents;
                }),
                map((items) => {
                    const userPlaylists: YTPlaylistWithID[] = [];

                    for (const item of items) {
                        if (!item.itemSectionRenderer.targetId) continue;
                        const sectionItems =
                            item.itemSectionRenderer.contents[0].shelfRenderer
                                .content.gridRenderer.items;
                        for (const sectionItem of sectionItems) {
                            if (!("gridPlaylistRenderer" in sectionItem))
                                continue;
                            userPlaylists.push({
                                display:
                                    sectionItem.gridPlaylistRenderer.thumbnail
                                        .thumbnails,
                                list: sectionItem.gridPlaylistRenderer
                                    .playlistId,
                                title: sectionItem.gridPlaylistRenderer.title
                                    .simpleText,
                            });
                        }
                    }

                    return userPlaylists;
                })
            );
    }
}
