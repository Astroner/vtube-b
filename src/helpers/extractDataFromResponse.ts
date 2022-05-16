import { InternalServerErrorException } from "@nestjs/common";
import { map, OperatorFunction } from "rxjs";
import type { AxiosResponse } from "axios";

export const extractDataFromResponse = <DataType>(
    key = "ytInitialData"
): OperatorFunction<AxiosResponse<string>, DataType> => {
    return map(({ data }) => {
        try {
            const match = data.match(new RegExp(`var ${key} = (.+);<`, "m"));
            if (match) {
                return JSON.parse(match[0]);
            } else {
                throw new InternalServerErrorException("Cannot extract data");
            }
        } catch (e) {
            throw new InternalServerErrorException("Cannot extract data");
        }
    });
};
