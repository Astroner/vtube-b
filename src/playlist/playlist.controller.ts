import { Controller, Get, Param } from "@nestjs/common";
import { PlaylistService } from "./playlist.service";

@Controller("playlist")
export class PlaylistController {
    constructor(private playlist: PlaylistService) {}

    @Get("dynamic/:psid/:list/:code")
    getDynamicPlaylist(
        @Param("psid") psid: string,
        @Param("list") list: string,
        @Param("code") code: string
    ) {
        return this.playlist.getDynamicPlaylist(psid, list, code);
    }

    @Get(":list")
    getPlaylist(@Param("list") list: string) {
        return this.playlist.getPlaylist(list);
    }
}
