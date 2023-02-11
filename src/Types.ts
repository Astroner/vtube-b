export type Page<T> = {
    items: T[];
    next: null | {
        key: string;
    };
};

export type Category<T> = {
    title: string;
    items: T[];
};

export type YTImage = {
    url: string;
    width: number;
    height: number;
};

export type YTVideo = {
    code: string;
    title: string;
    display: YTImage[];
};

export type YTPlaylist = {
    title: string;
    display: YTImage[];
    list: Page<YTVideo>;
};

export type YTPlaylistWithID = {
    list: string;
    title: string;
    display: YTImage[];
};

export type ChannelPreview = {
    id: string;
    title: string;
    description: string | null;
    tag: string | null;
    display: YTImage[];
};

export type YoutubeChannel = {
    id: string;
    title: string;
    description: string | null;
    avatar: YTImage[];
    background: YTImage[];
    tags: string[];
};

export type MusicChannel = {
    id: string;
    title: string;
    description: string | null;
    background: YTImage[];
    categories: Category<ChannelPreview | YTVideo | YTPlaylistWithID>[];
};
