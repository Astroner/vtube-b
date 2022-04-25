import { Module } from "@nestjs/common";
import { PlayerModule } from "src/player/player.module";
import { PlaylistModule } from "src/playlist/playlist.module";
import { RecommendationsModule } from "src/recommendations/recommendations.module";
import { SubscriptionsModule } from "src/subscriptions/subscriptions.module";

@Module({
    imports: [
        PlayerModule,
        PlaylistModule,
        RecommendationsModule,
        SubscriptionsModule,
    ],
})
export class AppModule {}
