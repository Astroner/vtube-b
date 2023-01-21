import { YTImage } from "src/Types";

export type ChannelSearchEntry = {
    type: "CHANNEL";
    id: string;
    title: string;
    description: string | null;
    tag: string;
    display: YTImage[];
};

export type VideoSearchEntry = {
    type: "VIDEO";
    code: string;
    title: string;
    display: YTImage[];
};

export type CollectionSearchEntry = {
    type: "COLLECTION";
    title: string;
    items: VideoSearchEntry[];
};

export type SearchEntry =
    | ChannelSearchEntry
    | VideoSearchEntry
    | CollectionSearchEntry;
