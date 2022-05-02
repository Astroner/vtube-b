import * as fetcher from "ytdl-core";
import { YTImage } from "src/Types";
import { YTSource } from "./youtube.responses";

export interface VideoInfo {
    title: string;
    standard: YTSource;
    displayImage: YTImage[];

    videoOnly: YTSource[];
    audioOnly: YTSource[];
    both: YTSource[];
    all: YTSource[];
}

export interface VideoStream {
    stream: ReturnType<typeof fetcher>;
    contentLength: number;
    videoSize: number;
    start: number;
    end: number;
    mimeType: string;
}
