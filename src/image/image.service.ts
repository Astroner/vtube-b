import { Injectable } from "@nestjs/common";

import { env } from "src/env";
import { YTImage } from "src/Types";

@Injectable()
export class ImageService {
    wrapURL(originalUrl: string): string {
        let addr: string;
        if (originalUrl.slice(0, 2) === "//") {
            const url = new URL(`http:${originalUrl}`);
            if (url.host === "yt3.googleusercontent.com") {
                url.protocol = "https:";
            }
            addr = url.toString();
        } else {
            addr = originalUrl;
        }

        const result = new URL("/image", env.PUBLIC_ADDRESS);

        result.searchParams.set("url", addr);

        return result.toString();
    }

    wrapYTImage = (original: YTImage): YTImage => {
        return {
            ...original,
            url: this.wrapURL(original.url),
        };
    };
}
