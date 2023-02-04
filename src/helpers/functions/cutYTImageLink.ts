import { YTImage } from "src/Types";

export const cutYTImageLink = (img: YTImage): YTImage => {
    let addr: string;
    if (img.url.slice(0, 2) === "//") {
        const url = new URL(`http:${img.url}`);
        if (url.host === "yt3.googleusercontent.com") {
            url.protocol = "https:";
        }
        addr = url.toString();
    } else {
        addr = img.url;
    }
    return {
        ...img,
        url: addr,
    };
};
