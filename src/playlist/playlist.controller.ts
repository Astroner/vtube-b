import { Controller, Get, Param } from "@nestjs/common";
import { PlaylistService } from "./playlist.service";

@Controller("playlist")
export class PlaylistController {
    constructor(private playlist: PlaylistService) {}

    @Get("dynamic/:list")
    getDynamicPlaylist(@Param("list") list: string) {
        return this.playlist.getDynamicPlaylist(list);
    }

    @Get(":list")
    getPlaylist(@Param("list") list: string) {
        return this.playlist.getPlaylist(list);
    }
}
