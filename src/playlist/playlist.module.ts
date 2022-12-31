import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { UserModule } from "src/user/user.module";
import { PlaylistController } from "./playlist.controller";
import { PlaylistService } from "./playlist.service";

@Module({
    controllers: [PlaylistController],
    imports: [HttpModule, UserModule],
    providers: [PlaylistService],
})
export class PlaylistModule {}
