import { Module } from "@nestjs/common";
import { YoutubeService } from "./youtube.service";
import { CacheService } from "./cache.service";
import { HttpModule } from "@nestjs/axios";

@Module({
    imports: [HttpModule],
    providers: [YoutubeService, CacheService],
    exports: [YoutubeService],
})
export class YoutubeModule {}
