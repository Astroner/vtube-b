import {
    BadRequestException,
    Controller,
    Get,
    Headers,
    InternalServerErrorException,
    Param,
    Query,
    Response,
} from "@nestjs/common";
import { Response as ServerResponse } from "express";

import { YoutubeService } from "src/youtube/youtube.service";

@Controller("player")
export class PlayerController {
    constructor(private youtube: YoutubeService) {}

    @Get(":code")
    async stream(
        @Response() res: ServerResponse,
        @Param("code") code: string,
        @Headers("range") range: string,
        @Query("itag") itag?: string
    ) {
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
    async getInfo(@Param("code") code: string) {
        try {
            const data = await this.youtube.getVideoInfo(code);

            return {
                title: data.title,
                displayImage: data.displayImage,
            };
        } catch (e) {
            console.log(e);
            throw new InternalServerErrorException("KEK");
        }
    }

    @Get("formats/:code")
    async getFormats(
        @Param("code") code: string,
        @Query("type") type?: string
    ) {
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
            }));
    }

    @Get("/test/:code")
    page(@Param("code") code: string) {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <video id="vid" width="50%" src="/player/${code}" controls>
    </video>
</body>
</html>`;
    }
}
