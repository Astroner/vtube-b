import { videoFormat } from "ytdl-core";
import * as fetcher from "ytdl-core";
import { YTImage } from "src/Types";

export interface VideoInfo {
    title: string;
    standard: videoFormat;
    displayImage: YTImage[];

    videoOnly: videoFormat[];
    audioOnly: videoFormat[];
    both: videoFormat[];
    all: videoFormat[];
}

export interface VideoStream {
    stream: ReturnType<typeof fetcher>;
    contentLength: number;
    videoSize: number;
    start: number;
    end: number;
    mimeType: string;
}
