import { YTImage, YTPlaylistWithID, YTVideo } from "src/Types";

export type YoutubeChannel = {
    id: string;
    title: string;
    description: string | null;
    avatar: YTImage[];
    background: YTImage[];
    tags: string[];
};

export type MusicChannelPreview = {
    id: string;
    title: string;
    display: YTImage[];
};

export type MusicChannelCategory = {
    title: string;
    items: Array<YTVideo | MusicChannelPreview | YTPlaylistWithID>;
};

export type MusicChannel = {
    id: string;
    title: string;
    description: string | null;
    background: YTImage[];
    categories: MusicChannelCategory[];
};
