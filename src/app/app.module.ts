import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ChannelModule } from "src/channel/channel.module";
import { env } from "src/env";
import { ImageModule } from "src/image/image.module";
import { PlayerModule } from "src/player/player.module";
import { PlaylistModule } from "src/playlist/playlist.module";
import { RecommendationsModule } from "src/recommendations/recommendations.module";
import { SearchModule } from "src/search/search.module";
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
        SearchModule,
        ChannelModule,
        ImageModule,
    ],
})
export class AppModule {}
