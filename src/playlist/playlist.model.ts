import { YTImage } from "src/Types";

export interface Playlist {
    title: string;
    display: YTImage[];
    list: ListItem[];
}

export interface ListItem {
    title: string;
    code: string;
    display: YTImage[];
}
