import { Controller, Get, Param } from "@nestjs/common";
import { MusicChannelService } from "./music-channel.service";
import { YoutubeChannelService } from "./youtube-channel.service";

@Controller("channel")
export class ChannelController {
    constructor(
        private youtube: YoutubeChannelService,
        private music: MusicChannelService
    ) {}

    @Get("youtube/:id")
    getYoutubeInfo(@Param("id") channel: string) {
        return this.youtube.getYoutubeChannelInfo(channel);
    }

    @Get("youtube/videos/:id")
    getYoutubeVideos(@Param("id") channel: string) {
        return this.youtube.getYoutubeChannelVideos(channel);
    }

    @Get("youtube/videos/continue/:key")
    continueYoutubeVideos(@Param("key") key: string) {
        return this.youtube.continueYoutubeChannelVideos(key);
    }

    @Get("youtube/playlists/:id")
    getYoutubePlaylists(@Param("id") channel: string) {
        return this.youtube.getYoutubeChannelPlaylists(channel);
    }

    @Get("youtube/playlists/continue/:key")
    continueYoutubePlaylists(@Param("key") key: string) {
        return this.youtube.continueYoutubeChannelPlaylists(key);
    }

    @Get("youtube/streams/:id")
    getYoutubeStreams(@Param("id") channel: string) {
        return this.youtube.getYoutubeChannelStreams(channel);
    }

    @Get("youtube/streams/continue/:key")
    continueYoutubeStreams(@Param("key") key: string) {
        return this.youtube.continueYoutubeChannelStreams(key);
    }

    @Get("music/:id")
    getMusicArtist(@Param("id") id: string) {
        return this.music.getInfo(id);
    }
}
