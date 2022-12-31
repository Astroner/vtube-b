import { Controller, Get, Param } from "@nestjs/common";
import { Protected } from "src/user/decorators/protected.decorator";
import { UserData } from "src/user/decorators/user-data.decorator";
import { User } from "src/user/user.schema";
import { PlaylistService } from "./playlist.service";

@Controller("playlist")
export class PlaylistController {
    constructor(private playlist: PlaylistService) {}

    @Protected()
    @Get("dynamic/:list/:code")
    getDynamicPlaylist(
        @UserData() user: User,
        @Param("list") list: string,
        @Param("code") code: string
    ) {
        return this.playlist.getDynamicPlaylist(user.ytID, list, code);
    }

    @Get(":list")
    getPlaylist(@Param("list") list: string) {
        return this.playlist.getPlaylist(list);
    }
}
