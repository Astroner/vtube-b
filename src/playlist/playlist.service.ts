import { HttpService } from "@nestjs/axios";
import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
} from "@nestjs/common";
import { map, Observable } from "rxjs";
import { cutYTImageLink } from "src/helpers/functions/cutYTImageLink";
import { extractDataFromResponse } from "src/helpers/functions/extractDataFromResponse";
import { YTImage } from "src/Types";
import { ListItem, Playlist, PlaylistWithID } from "./playlist.model";
import {
    DynamicPlaylist,
    PlaylistData,
    PlaylistError,
    UserPlaylists,
} from "./playlist.native";

@Injectable()
export class PlaylistService {
    constructor(private http: HttpService) {}
    getPlaylist(list: string): Observable<Playlist> {
        return this.http
            .get<string>("https://youtube.com/playlist", {
                params: { list },
            })
            .pipe(
                extractDataFromResponse<PlaylistData | PlaylistError>(),
                map((json) => {
                    if ("metadata" in json) {
                        return {
                            title: json.metadata.playlistMetadataRenderer.title,
                            display:
                                json.microformat.microformatDataRenderer.thumbnail.thumbnails.map(
                                    cutYTImageLink
                                ),
                            list: json.contents.twoColumnBrowseResultsRenderer.tabs[0].tabRenderer.content.sectionListRenderer.contents[0].itemSectionRenderer.contents[0].playlistVideoListRenderer.contents.map(
                                (item) => {
                                    const info = item.playlistVideoRenderer;

                                    return {
                                        title: info.title.runs[0].text,
                                        code: info.videoId,
                                        display:
                                            info.thumbnail.thumbnails.map(
                                                cutYTImageLink
                                            ),
                                    };
                                }
                            ),
                        };
                    }
                    throw new BadRequestException(json.alerts);
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
                    // return data as any;
                    const playlist =
                        data.contents.twoColumnWatchNextResults.playlist
                            .playlist;

                    let display: YTImage[] = [];
                    const list: ListItem[] = [];

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
                        list,
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
                extractDataFromResponse<UserPlaylists>(),
                map((data) => {
                    return data.contents.twoColumnBrowseResultsRenderer.tabs[0]
                        .tabRenderer.content.sectionListRenderer.contents;
                }),
                map((items) => {
                    const userPlaylists: PlaylistWithID[] = [];

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
