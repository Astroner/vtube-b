import { HttpService } from "@nestjs/axios";
import {
    BadRequestException,
    Controller,
    Get,
    Query,
    Res,
} from "@nestjs/common";
import { Response } from "express";
import { lastValueFrom } from "rxjs";

import { env } from "src/env";

@Controller("image")
export class ImageController {
    constructor(private http: HttpService) {}

    @Get()
    async getImage(
        @Query("url") addr: string,
        @Res() res: Response
    ): Promise<void> {
        let url: URL;
        try {
            url = new URL(addr);
        } catch (e) {
            throw new BadRequestException();
        }
        if (!env.IMAGE.HOST_WHITELIST.includes(url.host))
            throw new BadRequestException();

        const { data, headers } = await lastValueFrom(
            this.http.get(addr, {
                responseType: "stream",
            })
        );

        res.setHeader("content-type", headers["content-type"]);
        res.setHeader("content-length", headers["content-length"]);
        data.pipe(res);
    }
}
