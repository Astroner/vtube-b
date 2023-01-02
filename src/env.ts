import { config } from "dotenv";
config();

export const env = {
    NODE_ENV: process.env.NODE_ENV ?? "development",
    PORT: process.env.PORT ? +process.env.PORT : 4040,
    MONGO_URL: process.env.MONGO_URL ?? "ERROR",
    JWT: {
        SECRET: process.env.JWT_SECRET ?? "SECRET",
        EXPIRES_IN: process.env.JWT_EXPIRES_IN ?? "1d",
    },
};
