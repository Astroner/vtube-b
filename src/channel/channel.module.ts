import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { ChannelController } from "./channel.controller";
import { ChannelService } from "./channel.service";

@Module({
    controllers: [ChannelController],
    providers: [ChannelService],
    imports: [HttpModule],
})
export class ChannelModule {}
