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

export type YTPlaylistWithID = {
    list: string;
    title: string;
    display: YTImage[];
};
