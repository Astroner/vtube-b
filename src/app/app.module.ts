import { Module } from "@nestjs/common";
import { PlayerModule } from "src/player/player.module";

@Module({
    imports: [PlayerModule],
})
export class AppModule {}
