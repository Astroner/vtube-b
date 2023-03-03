import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { ImageModule } from "src/image/image.module";
import { SearchController } from "./search.controller";
import { SearchService } from "./search.service";

@Module({
    controllers: [SearchController],
    providers: [SearchService],
    imports: [HttpModule, ImageModule],
})
export class SearchModule {}
