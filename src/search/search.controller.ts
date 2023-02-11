import { Controller, Get, Query } from "@nestjs/common";
import { Observable, of } from "rxjs";
import { SearchEntry } from "./search.model";
import { SearchService } from "./search.service";

@Controller("search")
export class SearchController {
    constructor(private search: SearchService) {}

    @Get("youtube")
    searchYoutube(@Query("query") query?: string): Observable<SearchEntry[]> {
        if (!query) return of([]);
        return this.search.searchYoutube(query);
    }

    @Get("music")
    searchMusic(@Query("query") query?: string): Observable<SearchEntry[]> {
        if (!query) return of([]);
        return this.search.searchMusic(query);
    }
}
