import { YTImage, YTVideo } from "src/Types";

export interface Playlist {
    title: string;
    display: YTImage[];
    list: YTVideo[];
}

export interface PlaylistWithID {
    title: string;
    display: YTImage[];
    list: string;
}
