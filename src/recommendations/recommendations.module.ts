import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { ImageModule } from "src/image/image.module";
import { UserModule } from "src/user/user.module";
import { RecommendationsController } from "./recommendations.controller";
import { RecommendationsService } from "./recommendations.service";

@Module({
    controllers: [RecommendationsController],
    providers: [RecommendationsService],
    imports: [HttpModule, UserModule, ImageModule],
})
export class RecommendationsModule {}
