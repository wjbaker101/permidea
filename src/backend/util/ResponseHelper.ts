import { Response } from 'express';

import { IResponse } from '../interface/IResponse';
import { IErrorResponse } from '../interface/IErrorResponse';

export const ResponseHelper = (response: Response) => ({

    sendResult(status: number, data: any): void {
        const result: IResponse = {
            result: data,
            timestamp: Date.now(),
        };

        response.status(status).send(result);
    },

    sendError(status: number, error: string): void {
        const result: IErrorResponse = {
            error,
            timestamp: Date.now(),
        };

        response.status(status).send(result);
    },
})
