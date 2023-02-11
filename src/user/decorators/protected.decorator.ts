import { applyDecorators, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../guards/auth.guard";

// To hard to write type for Decorator
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const Protected = () => applyDecorators(UseGuards(AuthGuard));
