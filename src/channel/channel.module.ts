import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { ImageModule } from "src/image/image.module";
import { ChannelController } from "./channel.controller";
import { MusicChannelService } from "./music-channel.service";
import { YoutubeChannelService } from "./youtube-channel.service";

@Module({
    controllers: [ChannelController],
    providers: [YoutubeChannelService, MusicChannelService],
    imports: [HttpModule, ImageModule],
})
export class ChannelModule {}
