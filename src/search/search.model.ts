import { Category, ChannelPreview, YTPlaylistWithID, YTVideo } from "src/Types";

export type SearchEntryBase<K extends string, T> = {
    type: K;
    value: T;
};

export type ChannelSearchEntry = SearchEntryBase<"CHANNEL", ChannelPreview>;

export type VideoSearchEntry = SearchEntryBase<"VIDEO", YTVideo>;

export type PlaylistSearchEntry = SearchEntryBase<"PLAYLIST", YTPlaylistWithID>;

export type DynamicPlaylistSearchEntry = SearchEntryBase<
    "DYNAMIC_PLAYLIST",
    YTPlaylistWithID & { code: string }
>;

export type CollectionSearchEntry = SearchEntryBase<
    "COLLECTION",
    Category<
        | ChannelSearchEntry
        | VideoSearchEntry
        | PlaylistSearchEntry
        | DynamicPlaylistSearchEntry
    >
>;

export type SearchEntry =
    | ChannelSearchEntry
    | VideoSearchEntry
    | CollectionSearchEntry
    | PlaylistSearchEntry
    | DynamicPlaylistSearchEntry;
