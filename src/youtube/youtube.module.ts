import { Module } from "@nestjs/common";
import { YoutubeService } from "./youtube.service";
import { CacheService } from "./cache.service";

@Module({
    providers: [YoutubeService, CacheService],
    exports: [YoutubeService],
})
export class YoutubeModule {}
