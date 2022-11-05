import * as fetcher from "ytdl-core";
import { YTImage } from "src/Types";
import { YTSource } from "./youtube.responses";

export interface VideoInfo {
    title: string;
    formats: YTSource[];
    standard: YTSource;
    displayImage: YTImage[];
}

export interface VideoStream {
    stream: ReturnType<typeof fetcher>;
    contentLength: number;
    videoSize: number;
    start: number;
    end: number;
    mimeType: string;
}
