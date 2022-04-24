import { Module } from "@nestjs/common";
import { PlayerModule } from "src/player/player.module";
import { PlaylistModule } from "src/playlist/playlist.module";
import { RecommendationsModule } from "src/recommendations/recommendations.module";

@Module({
    imports: [PlayerModule, PlaylistModule, RecommendationsModule],
})
export class AppModule {}
