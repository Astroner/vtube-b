import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

@Schema()
export class User {
    @Prop({ type: String, required: true, unique: true })
    username!: string;

    @Prop({ type: String, required: true })
    password!: string;

    @Prop({ type: String, required: true })
    psid!: string;

    @Prop({ type: String, required: true })
    psidts!: string;
}

export type UserDocument = HydratedDocument<User>;

export const UserSchema = SchemaFactory.createForClass(User);
