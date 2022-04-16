import { Injectable, InternalServerErrorException } from "@nestjs/common";
import * as fetcher from "ytdl-core";
import { CacheService } from "./cache.service";
import { VideoInfo, VideoStream } from "./youtube.model";

@Injectable()
export class YoutubeService {
    static CHUNK_SIZE = 10 ** 6;

    constructor(private cache: CacheService) {}

    async getVideoInfo(code: string): Promise<VideoInfo> {
        return await this.cache.getOr(code, () => this.fetchInfo(code));
    }

    async getVideo(
        code: string,
        start: number,
        endParam?: number,
        formatParam?: fetcher.videoFormat | number
    ): Promise<VideoStream> {
        let format: fetcher.videoFormat;

        if (formatParam) {
            if (typeof formatParam !== "number") format = formatParam;
            else {
                const info = await this.getVideoInfo(code);

                for (const item of info.all) {
                    if (item.itag === formatParam) {
                        format = item;
                        break;
                    }
                }
            }
        } else {
            format = (await this.getVideoInfo(code)).standard;
        }

        if (!format) throw new Error("Format doesn't specified");

        const videoSize = +format.contentLength;

        const end =
            endParam ??
            Math.min(start + YoutubeService.CHUNK_SIZE, videoSize - 1);

        try {
            const stream = fetcher(code, {
                quality: format.itag,
                range: {
                    start,
                    end,
                },
                dlChunkSize: YoutubeService.CHUNK_SIZE,
            });
            return {
                contentLength: end - start + 1,
                end,
                start,
                stream,
                videoSize,
                mimeType: format.mimeType,
            };
        } catch (e) {
            throw new InternalServerErrorException(
                `Failed to fetch video "${code}"`
            );
        }
    }

    private async fetchInfo(code: string): Promise<VideoInfo> {
        const info = await fetcher.getBasicInfo(code);

        const audioOnly: fetcher.videoFormat[] = [];
        const videoOnly: fetcher.videoFormat[] = [];
        const both: fetcher.videoFormat[] = [];
        let standard: fetcher.videoFormat | null = null;

        for (const format of info.formats) {
            const [type, ext] = format.mimeType.match(/^(.+);/)[1].split("/");
            if (ext !== "mp4") continue;

            if (format.itag === 18) standard = format;

            const hasVideo = type === "video";
            const hasAudio = !!format.audioChannels;

            if (hasAudio && hasVideo) {
                both.push(format);
            } else if (hasVideo) {
                videoOnly.push(format);
            } else {
                audioOnly.push(format);
            }
        }

        return {
            audioOnly,
            videoOnly,
            standard,
            title: info.videoDetails.title,
            both,
            all: info.formats,
            displayImage:
                info.player_response.videoDetails.thumbnail.thumbnails.map(
                    (item) => ({
                        ...item,
                        url: item.url.split("?")[0],
                    })
                ),
        };
    }
}
