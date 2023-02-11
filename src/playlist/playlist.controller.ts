import { HttpService } from "@nestjs/axios";
import { Controller, Get, Param, Res } from "@nestjs/common";
import { Response } from "express";
import { lastValueFrom, Observable } from "rxjs";

import { getMidItem } from "src/helpers/functions/getMidItem";
import { Page, YTPlaylist, YTPlaylistWithID, YTVideo } from "src/Types";
import { Protected } from "src/user/decorators/protected.decorator";
import { UserData } from "src/user/decorators/user-data.decorator";
import { User } from "src/user/user.schema";

import { PlaylistService } from "./playlist.service";

@Controller("playlist")
export class PlaylistController {
    constructor(private playlist: PlaylistService, private http: HttpService) {}

    @Protected()
    @Get("dynamic/:list/:code")
    getDynamicPlaylist(
        @UserData() user: User,
        @Param("list") list: string,
        @Param("code") code: string
    ): Observable<YTPlaylist> {
        return this.playlist.getDynamicPlaylist(user.ytID, list, code);
    }

    @Protected()
    @Get("all")
    getAllPlaylists(@UserData() user: User): Observable<YTPlaylistWithID[]> {
        return this.playlist.getAll(user.ytID);
    }

    @Get("thumbnail/:list")
    async getThumbnail(
        @Param("list") list: string,
        @Res() res: Response
    ): Promise<void> {
        const playlist = await lastValueFrom(this.playlist.getPlaylist(list));
        const { data, headers } = await lastValueFrom(
            this.http.get(getMidItem(playlist.display).url, {
                responseType: "stream",
            })
        );
        res.setHeader("content-type", headers["content-type"]);
        res.setHeader("content-length", headers["content-length"]);
        data.pipe(res);
    }

    @Get("continue/:key")
    continuePlaylist(@Param("key") key: string): Observable<Page<YTVideo>> {
        return this.playlist.continuePlaylist(key);
    }

    @Get(":list")
    getPlaylist(@Param("list") list: string): Observable<YTPlaylist> {
        return this.playlist.getPlaylist(list);
    }
}
