import { YTImage } from "src/Types";

export type ChannelSearchEntry = {
    type: "CHANNEL";
    id: string;
    title: string;
    description: string | null;
    tag: string | null;
    display: YTImage[];
};

export type VideoSearchEntry = {
    type: "VIDEO";
    code: string;
    title: string;
    display: YTImage[];
};

export type PlaylistSearchEntry = {
    type: "PLAYLIST";
    title: string;
    list: string;
    display: YTImage[];
};

export type CollectionSearchEntry = {
    type: "COLLECTION";
    title: string;
    items: Array<ChannelSearchEntry | VideoSearchEntry | PlaylistSearchEntry>;
};

export type SearchEntry =
    | ChannelSearchEntry
    | VideoSearchEntry
    | CollectionSearchEntry
    | PlaylistSearchEntry;
