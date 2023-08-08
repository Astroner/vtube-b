import { HttpService } from "@nestjs/axios";
import * as fetcher from "ytdl-core";
import {
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from "@nestjs/common";
import { firstValueFrom } from "rxjs";

import { CacheService } from "./cache.service";
import { VideoInfo, VideoStream } from "./youtube.model";
import { BasicSource, YTSource } from "./youtube.responses";
import { ImageService } from "src/image/image.service";

@Injectable()
export class YoutubeService {
    static CHUNK_SIZE = 10 ** 6;

    constructor(
        private cache: CacheService,
        private http: HttpService,
        private image: ImageService
    ) {}

    async getVideoInfo(code: string): Promise<VideoInfo> {
        return await this.cache.getOr(code, () => this.fetchInfo(code));
    }

    async getVideo(
        code: string,
        start: number,
        endParam?: number,
        itag?: number
    ): Promise<VideoStream> {
        let format: YTSource | null = null;

        if (itag) {
            const info = await this.getVideoInfo(code);

            for (const item of info.formats) {
                if (item.itag === itag) {
                    format = item;
                    break;
                }
            }
        } else {
            format = (await this.getVideoInfo(code)).standard;
        }

        if (!format) throw new Error("Format doesn't specified");
        const videoSize = format.contentLength;
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
        try {
            const info = await fetcher.getInfo(code);
            const formats: YTSource[] = await Promise.all(
                info.formats.map(async (format): Promise<YTSource> => {
                    let contentLength: number;
                    if (format.contentLength) {
                        contentLength = +format.contentLength;
                    } else {
                        try {
                            const data = await firstValueFrom(
                                this.http.get(format.url, {
                                    headers: {
                                        Range: "bytes=0-1",
                                    },
                                })
                            );
                            if (data.headers["content-range"]) {
                                contentLength =
                                    +data.headers["content-range"].split(
                                        "/"
                                    )[1];
                            } else {
                                return null as any;
                            }
                        } catch (e) {
                            return null as any;
                        }
                    }

                    const basic: BasicSource = {
                        contentLength,
                        indexRange: format.indexRange ?? {
                            end: "0",
                            start: "0",
                        },
                        initRange: format.initRange ?? {
                            end: "0",
                            start: "0",
                        },
                        itag: format.itag,
                        mimeType: format.mimeType ?? "",
                        quality: format.quality as string,
                        url: format.url,
                        hasAudio: format.hasAudio,
                        hasVideo: format.hasVideo,
                    };

                    if (format.hasVideo && format.hasAudio)
                        return {
                            ...basic,
                            width: format.width ?? 0,
                            height: format.height ?? 0,
                            audioChannels: format.audioChannels ?? 0,
                        };
                    else if (format.hasVideo)
                        return {
                            ...basic,
                            width: format.width ?? 0,
                            height: format.height ?? 0,
                        };
                    else
                        return {
                            ...basic,
                            audioChannels: format.audioChannels ?? 0,
                        };
                })
            );
            const filteredFormats = formats.filter((a) => !!a);

            return {
                formats: filteredFormats,
                displayImage: info.videoDetails.thumbnails.map(
                    this.image.wrapYTImage
                ),
                title: info.videoDetails.title,
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                standard: filteredFormats.find((item) => item.itag === 18)!,
            };
        } catch (e: any) {
            // "This video may not be suitable for some users" yt code;
            if (e.statusCode === 410) {
                throw new NotFoundException();
            }
            if (e.message.search("No video id found") !== -1) {
                throw new NotFoundException();
            }
            throw new InternalServerErrorException();
        }
    }
}
