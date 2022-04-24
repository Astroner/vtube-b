import { Controller, Get, Param } from "@nestjs/common";
import { RecommendationsService } from "./recommendations.service";

@Controller("recommendations")
export class RecommendationsController {
    constructor(private recs: RecommendationsService) {}

    @Get("youtube/:psid")
    getYoutube(@Param("psid") psid: string) {
        return this.recs.getYoutubeRecommendations(psid);
    }

    @Get("music/:psid")
    getMusic(@Param("psid") psid: string) {
        return this.recs.getMusicRecommendations(psid);
    }
}
