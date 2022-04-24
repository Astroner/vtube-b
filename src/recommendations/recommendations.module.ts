import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { RecommendationsController } from "./recommendations.controller";
import { RecommendationsService } from "./recommendations.service";

@Module({
    controllers: [RecommendationsController],
    providers: [RecommendationsService],
    imports: [HttpModule],
})
export class RecommendationsModule {}
