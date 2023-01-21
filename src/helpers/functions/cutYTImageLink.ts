import { YTImage } from "src/Types";

export const cutYTImageLink = (img: YTImage): YTImage => {
    const addr = img.url.slice(0, 2) === "//" ? `http:${img.url}` : img.url;
    return {
        ...img,
        url: addr,
    };
};
