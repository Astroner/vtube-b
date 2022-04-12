import { HttpService } from "@nestjs/axios";
import { BadRequestException, Injectable } from "@nestjs/common";
import { map, Observable } from "rxjs";
import { cutYTImageLink } from "src/helpers/cutYTImageLink";
import { PlaylistData, PlaylistError, Playlist } from "./playlist.model";

@Injectable()
export class PlaylistService {
    constructor(private http: HttpService) {}
    getPlaylist(list: string): Observable<Playlist> {
        return this.http
            .get<string>("https://youtube.com/playlist", {
                params: { list },
            })
            .pipe(
                map(
                    (response) =>
                        response.data.match(/var ytInitialData = (.+);</m)[1]
                ),
                map((data) => JSON.parse(data) as PlaylistData | PlaylistError),
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
}
