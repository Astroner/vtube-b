import { HttpService } from "@nestjs/axios";
import * as fetcher from "ytdl-core";
import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { firstValueFrom, map, Observable } from "rxjs";

import { cutYTImageLink } from "src/helpers/cutYTImageLink";
import { extractDataFromResponse } from "src/helpers/extractDataFromResponse";
import { CacheService } from "./cache.service";
import { VideoInfo, VideoStream } from "./youtube.model";
import { YTSource, YTVideoResponse } from "./youtube.responses";

@Injectable()
export class YoutubeService {
    static CHUNK_SIZE = 10 ** 6;

    constructor(private cache: CacheService, private http: HttpService) {}

    async getVideoInfo(code: string): Promise<VideoInfo> {
        return await this.cache.getOr(code, () =>
            firstValueFrom(this.fetchInfo(code))
        );
    }

    async getVideo(
        code: string,
        start: number,
        endParam?: number,
        itag?: number
    ): Promise<VideoStream> {
        let format: YTSource;

        if (itag) {
            const info = await this.getVideoInfo(code);

            for (const item of info.all) {
                if (item.itag === itag) {
                    format = item;
                    break;
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

    private fetchInfo(code: string): Observable<VideoInfo> {
        return this.http
            .get<string>("https://youtube.com/watch", {
                params: {
                    v: code,
                },
            })
            .pipe(
                extractDataFromResponse<YTVideoResponse>(
                    "ytInitialPlayerResponse"
                ),
                map((info): VideoInfo => {
                    const audioOnly: YTSource[] = [];
                    const videoOnly: YTSource[] = [];
                    const both: YTSource[] = [];
                    let standard: YTSource | null = null;

                    const allFormats =
                        info.streamingData.adaptiveFormats.concat(
                            info.streamingData.formats
                        );

                    for (const format of allFormats) {
                        const [type, ext] = format.mimeType
                            .match(/^(.+);/)[1]
                            .split("/");
                        if (ext !== "mp4") continue;

                        if (format.itag === 18) standard = format;

                        const hasVideo = type === "video";
                        const hasAudio = "audioChannels" in format;

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
                        all: allFormats,
                        displayImage:
                            info.videoDetails.thumbnail.thumbnails.map(
                                cutYTImageLink
                            ),
                    };
                })
            );
    }
}
