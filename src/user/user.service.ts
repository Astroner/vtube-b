import {
    BadRequestException,
    Injectable,
    NotAcceptableException,
    NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { hash, compare } from "bcrypt";

import { AuthDTO, CreateUserDTO } from "./user.dto";
import { User, UserDocument } from "./user.schema";
import { JwtService } from "@nestjs/jwt";

const saltRounds = 10;

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        private jwt: JwtService
    ) {}

    async createUser(dto: CreateUserDTO): Promise<void> {
        const user = new this.userModel({
            username: dto.username,
            password: await hash(dto.password, saltRounds),
            psid: dto.psid,
            psidts: dto.psidts,
        });

        try {
            await user.save();
        } catch (e: any) {
            // username duplicate
            if (e.code === 11000) {
                throw new NotAcceptableException();
            }
        }
    }

    async authenticate(dto: AuthDTO): Promise<string> {
        const user = await this.userModel.findOne({
            username: dto.username,
        });

        if (!user || !(await compare(dto.password, user.password)))
            throw new BadRequestException();

        return this.jwt.signAsync({ id: user.id });
    }

    async verify(token: string): Promise<{ id: string } | null> {
        try {
            const data = await this.jwt.verifyAsync<{ id: string }>(token);
            return {
                id: data.id,
            };
        } catch (e: any) {
            return null;
        }
    }

    async getUserById(id: string): Promise<UserDocument | null> {
        return await this.userModel.findById(id);
    }

    async getUserToken(username: string): Promise<string> {
        const user = await this.userModel.findOne({
            username,
        });

        if (!user) throw new NotFoundException();

        return this.jwt.signAsync({ id: user.id });
    }
}
