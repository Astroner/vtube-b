import { Controller, Get, Param } from "@nestjs/common";
import { ChannelService } from "./channel.service";

@Controller("channel")
export class ChannelController {
    constructor(private service: ChannelService) {}

    @Get("youtube/info/:id")
    getYoutubeInfo(@Param("id") channel: string) {
        return this.service.getYoutubeChannelInfo(channel);
    }

    @Get("youtube/videos/:id")
    getYoutubeVideos(@Param("id") channel: string) {
        return this.service.getYoutubeChannelVideos(channel);
    }

    @Get("youtube/videos/continue/:key")
    continueYoutubeVideos(@Param("key") key: string) {
        return this.service.continueYoutubeChannelVideos(key);
    }

    @Get("youtube/playlists/:id")
    getYoutubePlaylists(@Param("id") channel: string) {
        return this.service.getYoutubeChannelPlaylists(channel);
    }

    @Get("youtube/playlists/continue/:key")
    continueYoutubePlaylists(@Param("key") key: string) {
        return this.service.continueYoutubeChannelPlaylists(key);
    }

    @Get("youtube/streams/:id")
    getYoutubeStreams(@Param("id") channel: string) {
        return this.service.getYoutubeChannelStreams(channel);
    }

    @Get("youtube/streams/continue/:key")
    continueYoutubeStreams(@Param("key") key: string) {
        return this.service.continueYoutubeChannelStreams(key);
    }
}
