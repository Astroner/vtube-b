import { YTImage } from "src/Types";

export type Channel = {
    id: string;
    title: string;
    description: string | null;
    avatar: YTImage[];
    background: YTImage[];
    tags: string[];
};

export type Page<T> = {
    items: T[];
    next: null | {
        key: string;
    };
};
