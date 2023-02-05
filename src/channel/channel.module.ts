import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { ChannelController } from "./channel.controller";
import { MusicChannelService } from "./music-channel.service";
import { YoutubeChannelService } from "./youtube-channel.service";

@Module({
    controllers: [ChannelController],
    providers: [YoutubeChannelService, MusicChannelService],
    imports: [HttpModule],
})
export class ChannelModule {}
