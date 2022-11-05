import { YTImage } from "src/Types";

export interface BasicSource {
    itag: number;
    url: string;

    contentLength: number;

    initRange: {
        start: string;
        end: string;
    };

    indexRange: {
        start: string;
        end: string;
    };

    mimeType: string;
    quality: string;

    hasAudio: boolean;
    hasVideo: boolean;
}

export interface YTVideoSource extends BasicSource {
    width: number;
    height: number;
}

export interface YTAudioSource extends BasicSource {
    audioChannels: number;
}

export type YTSource =
    | YTVideoSource
    | YTAudioSource
    | (YTVideoSource & YTAudioSource);

export interface YTVideoResponse {
    videoDetails: {
        author: string;
        channelId: string;
        isLiveContent: string;
        title: string;
        videoId: string;
        thumbnail: {
            thumbnails: YTImage[];
        };
    };
    streamingData: {
        adaptiveFormats: Array<YTSource>;
        formats: Array<YTVideoSource & YTAudioSource>;
    };
}
