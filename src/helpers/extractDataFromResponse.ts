import { InternalServerErrorException } from "@nestjs/common";
import { map, OperatorFunction } from "rxjs";
import type { AxiosResponse } from "axios";

export const extractDataFromResponse = <DataType>(
    key = "ytInitialData"
): OperatorFunction<AxiosResponse<string>, DataType> => {
    return map(({ data }) => {
        try {
            const json = data.match(new RegExp(`var ${key} = (.+);<`, "m"))[1];
            if (json) {
                return JSON.parse(json);
            } else {
                throw new InternalServerErrorException("Cannot extract data");
            }
        } catch (e) {
            throw new InternalServerErrorException("Cannot extract data");
        }
    });
};
