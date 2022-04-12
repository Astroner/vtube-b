import { Module } from "@nestjs/common";
import { PlayerModule } from "src/player/player.module";
import { PlaylistModule } from "src/playlist/playlist.module";

@Module({
    imports: [PlayerModule, PlaylistModule],
})
export class AppModule {}
