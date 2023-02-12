import { HttpService } from "@nestjs/axios";
import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { map, Observable } from "rxjs";
import { MusicChannel } from "src/Types";
import {
    isCarouselArtist,
    isCarouselPlaylist,
    MusicChannelResponse,
} from "./channel.native";

@Injectable()
export class MusicChannelService {
    constructor(private http: HttpService) {}

    getInfo(id: string): Observable<MusicChannel> {
        return this.http
            .get<string>(`https://music.youtube.com/channel/${id}/`, {
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
                        /browse', params: (.+), data: (.+);ytcfg/gm
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
                map(
                    (json) => json && (JSON.parse(json) as MusicChannelResponse)
                ),
                map((data): MusicChannel => {
                    if (!data)
                        throw new InternalServerErrorException(
                            "CANNOT_PARSE_AUTHOR"
                        );

                    const categories: MusicChannel["categories"] = [];

                    for (const category of data.contents
                        .singleColumnBrowseResultsRenderer.tabs[0].tabRenderer
                        .content.sectionListRenderer.contents) {
                        if ("musicShelfRenderer" in category) {
                            categories.push({
                                title: category.musicShelfRenderer.title.runs[0]
                                    .text,
                                items: category.musicShelfRenderer.contents.map(
                                    (item) => ({
                                        code: item
                                            .musicResponsiveListItemRenderer
                                            .playlistItemData.videoId,
                                        title: item
                                            .musicResponsiveListItemRenderer
                                            .flexColumns[0]
                                            .musicResponsiveListItemFlexColumnRenderer
                                            .text.runs[0].text,
                                        display:
                                            item.musicResponsiveListItemRenderer
                                                .thumbnail
                                                .musicThumbnailRenderer
                                                .thumbnail.thumbnails,
                                    })
                                ),
                            });
                        } else if ("musicCarouselShelfRenderer" in category) {
                            categories.push({
                                title: category.musicCarouselShelfRenderer
                                    .header
                                    .musicCarouselShelfBasicHeaderRenderer.title
                                    .runs[0].text,
                                items: category.musicCarouselShelfRenderer.contents.map(
                                    (item) => {
                                        if (isCarouselArtist(item)) {
                                            return {
                                                id: item.musicTwoRowItemRenderer
                                                    .navigationEndpoint
                                                    .browseEndpoint.browseId,
                                                title: item
                                                    .musicTwoRowItemRenderer
                                                    .title.runs[0].text,
                                                display:
                                                    item.musicTwoRowItemRenderer
                                                        .thumbnailRenderer
                                                        .musicThumbnailRenderer
                                                        .thumbnail.thumbnails,
                                                tag: null,
                                                description: null,
                                            };
                                        } else if (isCarouselPlaylist(item)) {
                                            return {
                                                list: item
                                                    .musicTwoRowItemRenderer
                                                    .navigationEndpoint
                                                    .watchEndpoint.playlistId,
                                                title: item
                                                    .musicTwoRowItemRenderer
                                                    .title.runs[0].text,
                                                display:
                                                    item.musicTwoRowItemRenderer
                                                        .thumbnailRenderer
                                                        .musicThumbnailRenderer
                                                        .thumbnail.thumbnails,
                                            };
                                        } else {
                                            return {
                                                list: item
                                                    .musicTwoRowItemRenderer
                                                    .thumbnailOverlay
                                                    .musicItemThumbnailOverlayRenderer
                                                    .content
                                                    .musicPlayButtonRenderer
                                                    .playNavigationEndpoint
                                                    .watchPlaylistEndpoint
                                                    .playlistId,
                                                title: item
                                                    .musicTwoRowItemRenderer
                                                    .title.runs[0].text,
                                                display:
                                                    item.musicTwoRowItemRenderer
                                                        .thumbnailRenderer
                                                        .musicThumbnailRenderer
                                                        .thumbnail.thumbnails,
                                            };
                                        }
                                    }
                                ),
                            });
                        }
                    }

                    return {
                        id,
                        background:
                            data.header.musicImmersiveHeaderRenderer.thumbnail
                                .musicThumbnailRenderer.thumbnail.thumbnails,
                        categories,
                        description:
                            data.header.musicImmersiveHeaderRenderer.description
                                ?.runs[0].text ?? null,
                        title: data.header.musicImmersiveHeaderRenderer.title
                            .runs[0].text,
                    };
                })
            );
    }
}
