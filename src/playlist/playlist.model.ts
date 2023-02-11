import { Page, YTImage, YTVideo } from "src/Types";

export interface Playlist {
    title: string;
    display: YTImage[];
    list: Page<YTVideo>;
}
