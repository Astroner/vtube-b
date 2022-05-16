import { Injectable } from "@nestjs/common";

import { VideoInfo } from "./youtube.model";

@Injectable()
export class CacheService {
    static LIFE_TIME = 5000;

    private data = new Map<string, VideoInfo>();

    private timers = new Map<string, NodeJS.Timeout>();

    async set(code: string, info: VideoInfo) {
        this.data.set(code, info);
        this.setTimer(code);
    }

    async get(code: string): Promise<VideoInfo | null> {
        const item = this.data.get(code) ?? null;

        this.setTimer(code);

        return item;
    }

    async getOr(
        code: string,
        create: () => VideoInfo | Promise<VideoInfo>
    ): Promise<VideoInfo> {
        if (!this.data.has(code)) {
            const result = await create();
            this.data.set(code, result);
        }
        this.setTimer(code);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return this.data.get(code)!;
    }

    private setTimer(code: string) {
        const current = this.timers.get(code);
        if (current) clearTimeout(current);
        this.timers.set(
            code,
            setTimeout(() => this.data.delete(code), CacheService.LIFE_TIME)
        );
    }
}
