import { HttpService } from "@nestjs/axios";
import { Controller, Get, Param } from "@nestjs/common";
import { Observable } from "rxjs";

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
        return this.playlist.getDynamicPlaylist(
            user.psid,
            user.psidts,
            list,
            code
        );
    }

    @Protected()
    @Get("all")
    getAllPlaylists(@UserData() user: User): Observable<YTPlaylistWithID[]> {
        return this.playlist.getAll(user.psid, user.psidts);
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
