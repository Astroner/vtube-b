import { Controller, Get } from "@nestjs/common";
import { Observable } from "rxjs";
import { Protected } from "src/user/decorators/protected.decorator";
import { UserData } from "src/user/decorators/user-data.decorator";
import { User } from "src/user/user.schema";
import { MusicCategories, Recommendation } from "./recommendations.model";
import { RecommendationsService } from "./recommendations.service";

@Controller("recommendations")
export class RecommendationsController {
    constructor(private recs: RecommendationsService) {}

    @Protected()
    @Get("youtube")
    getYoutube(@UserData() user: User): Observable<Recommendation[]> {
        return this.recs.getYoutubeRecommendations(user.ytID);
    }

    @Protected()
    @Get("music")
    getMusic(@UserData() user: User): Observable<MusicCategories> {
        return this.recs.getMusicRecommendations(user.ytID);
    }
}
