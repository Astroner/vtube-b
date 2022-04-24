import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { YoutubeModule } from "src/youtube/youtube.module";
import { PlayerController } from "./player.controller";

@Module({
    controllers: [PlayerController],
    imports: [YoutubeModule, HttpModule],
})
export class PlayerModule {}
