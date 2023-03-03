import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { ImageModule } from "src/image/image.module";
import { UserModule } from "src/user/user.module";
import { PlaylistController } from "./playlist.controller";
import { PlaylistService } from "./playlist.service";

@Module({
    controllers: [PlaylistController],
    imports: [HttpModule, UserModule, ImageModule],
    providers: [PlaylistService],
})
export class PlaylistModule {}
