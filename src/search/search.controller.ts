import { Controller, Get, Query } from "@nestjs/common";
import { SearchService } from "./search.service";

@Controller("search")
export class SearchController {
    constructor(private search: SearchService) {}

    @Get("youtube")
    searchYoutube(@Query("query") query?: string) {
        if (!query) return [];
        return this.search.searchYoutube(query);
    }

    @Get("music")
    searchMusic(@Query("query") query?: string) {
        if (!query) return [];
        return this.search.searchMusic(query);
    }
}
