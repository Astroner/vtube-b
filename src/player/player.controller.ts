import { HttpService } from "@nestjs/axios";
import {
    BadRequestException,
    Controller,
    Get,
    Headers,
    Param,
    Query,
    Res,
} from "@nestjs/common";
import { Response } from "express";

import { YTVideo } from "src/Types";
import { YoutubeService } from "src/youtube/youtube.service";
import { VideoFormat } from "./player.model";

@Controller("player")
export class PlayerController {
    constructor(private youtube: YoutubeService, private http: HttpService) {}

    @Get(":code")
    async stream(
        @Res() res: Response,
        @Param("code") code: string,
        @Headers("range") range: string,
        @Query("itag") itag?: string
    ): Promise<void> {
        if (!range) throw new BadRequestException("Range is not provided");

        const [strStart, strEnd] = range.split("=")[1].split("-");

        const start = Number(strStart);
        const end = !!strEnd ? Number(strEnd) : undefined;

        const video = await this.youtube.getVideo(
            code,
            start,
            end,
            itag ? +itag : undefined
        );

        const headers = {
            "Content-Range": `bytes ${video.start}-${video.end}/${video.videoSize}`,
            "Accept-Ranges": "bytes",
            "Content-Length": video.contentLength,
            "Content-Type": video.mimeType ?? "video/mp4",
        };

        res.writeHead(206, headers);
        video.stream.pipe(res);
    }

    @Get("info/:code")
    async getInfo(@Param("code") code: string): Promise<YTVideo> {
        const data = await this.youtube.getVideoInfo(code);

        return {
            title: data.title,
            display: data.displayImage,
            code,
        };
    }

    @Get("formats/:code")
    async getFormats(
        @Param("code") code: string,
        @Query("type") type?: string
    ): Promise<VideoFormat[]> {
        const info = await this.youtube.getVideoInfo(code);

        return info.formats
            .filter((item) => {
                return (
                    (type === "audio" && item.hasAudio && !item.hasVideo) ||
                    (type === "video" && !item.hasAudio && item.hasVideo) ||
                    (type === "both" && item.hasAudio && item.hasVideo) ||
                    type === "all"
                );
            })
            .map((item) => ({
                itag: item.itag,
                mime: item.mimeType,
                quality: item.quality,
                contentLength: item.contentLength,
            }));
    }

    @Get("/test/:code")
    page(@Param("code") code: string, @Query("itag") itag?: string): string {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <video id="vid" width="50%" src="/player/${code}${
            itag ? `?itag=${itag}` : ""
        }" controls>
    </video>
</body>
</html>`;
    }
}
