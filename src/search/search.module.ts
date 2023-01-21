import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { SearchController } from "./search.controller";
import { SearchService } from "./search.service";

@Module({
    controllers: [SearchController],
    providers: [SearchService],
    imports: [HttpModule],
})
export class SearchModule {}
