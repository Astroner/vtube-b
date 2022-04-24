import { YTImage } from "src/Types";

export const cutYTImageLink = (img: YTImage): YTImage => {
    const url = new URL(img.url);
    url.search = "";
    return {
        ...img,
        url: url.toString(),
    };
};
