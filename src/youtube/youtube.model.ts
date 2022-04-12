import { videoFormat } from "ytdl-core";
import * as fetcher from "ytdl-core";

export interface VideoInfo {
    title: string;
    standard: videoFormat;
    displayImage: string;

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
