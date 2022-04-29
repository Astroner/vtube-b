import { YTImage } from "src/Types";

export type Recommendation =
    | VideoRecommendation
    | DynamicPlaylistRecommendation;

export interface VideoRecommendation {
    type: "VIDEO";
    title: string;
    display: YTImage[];
    code: string;
}

export interface DynamicPlaylistRecommendation {
    type: "DYNAMIC_PLAYLIST";
    title: string;
    display: YTImage[];
    list: string;
}

export interface MusicCategory {
    title: string;
    items: DynamicPlaylistRecommendation[];
}

export interface MusicCategories {
    categories: MusicCategory[];
}
