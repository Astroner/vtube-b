import { Module } from "@nestjs/common";
import { YoutubeService } from "./youtube.service";
import { CacheService } from "./cache.service";
import { HttpModule } from "@nestjs/axios";
import { ImageModule } from "src/image/image.module";

@Module({
    imports: [HttpModule, ImageModule],
    providers: [YoutubeService, CacheService],
    exports: [YoutubeService],
})
export class YoutubeModule {}
