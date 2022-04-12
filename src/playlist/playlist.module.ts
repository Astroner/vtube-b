import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { PlaylistController } from "./playlist.controller";
import { PlaylistService } from "./playlist.service";

@Module({
    controllers: [PlaylistController],
    imports: [HttpModule],
    providers: [PlaylistService],
})
export class PlaylistModule {}
