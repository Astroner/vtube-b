import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { ImageController } from "./image.controller";
import { ImageService } from "./image.service";

@Module({
    controllers: [ImageController],
    providers: [ImageService],
    exports: [ImageService],
    imports: [HttpModule],
})
export class ImageModule {}
