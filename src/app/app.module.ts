import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { env } from "src/env";
import { PlayerModule } from "src/player/player.module";
import { PlaylistModule } from "src/playlist/playlist.module";
import { RecommendationsModule } from "src/recommendations/recommendations.module";
import { SubscriptionsModule } from "src/subscriptions/subscriptions.module";
import { UserModule } from "src/user/user.module";

@Module({
    imports: [
        PlayerModule,
        PlaylistModule,
        RecommendationsModule,
        SubscriptionsModule,
        MongooseModule.forRoot(env.MONGO_URL),
        UserModule,
    ],
})
export class AppModule {}
