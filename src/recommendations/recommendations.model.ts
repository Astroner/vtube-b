import { YTPlaylistWithID, YTVideo, Category } from "src/Types";

export type RecommendationBase<K extends string, T> = {
    type: K;
    value: T;
};

export type Recommendation =
    | RecommendationBase<"VIDEO", YTVideo>
    | RecommendationBase<
          "DYNAMIC_PLAYLIST",
          YTPlaylistWithID & { code: string }
      >;

export type MusicCategory = Category<Recommendation>;

export interface MusicCategories {
    categories: MusicCategory[];
}
