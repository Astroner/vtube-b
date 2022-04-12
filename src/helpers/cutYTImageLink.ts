import { YTImage } from "src/Types";

export const cutYTImageLink = (img: YTImage): YTImage => {
    return {
        ...img,
        url: img.url.split("?")[0],
    };
};
