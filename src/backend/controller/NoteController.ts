import express, { Request, Response } from 'express';

import { NoteService } from '../service/NoteService';
import { ResponseHelper } from '../util/ResponseHelper';
import { ErrorCodes } from '../util/ErrorCodes';

const router = express.Router();

const routes = {

    async getNote(request: Request, response: Response): Promise<void> {
        const { noteID } = request.params;

        const result = await NoteService.getNote(noteID);

        if (result instanceof Error) {
            if (result.message === ErrorCodes.GET_NOTE_NOT_FOUND) {
                ResponseHelper(response).sendError(404, result.message);
            }
            if (result.message === ErrorCodes.GET_NOTE_FAILURE) {
                ResponseHelper(response).sendError(400, result.message);
            }
        }

        ResponseHelper(response).sendResult(200, result);
    },

    async updateNote(request: Request, response: Response): Promise<void> {
        const { noteID } = request.params;
        const { title, content, creationDate } = request.body;

        const result = await NoteService.updateNote(
            noteID,
            title,
            content,
            new Date(creationDate));

        if (result instanceof Error) {
            ResponseHelper(response).sendError(400, result.message);
        }

        ResponseHelper(response).sendResult(200, result);
    },

    async createNote(request: Request, response: Response): Promise<void> {
        const { title, content, creationDate } = request.body;

        const result = await NoteService.createNote(
            title,
            content,
            new Date(creationDate));

        if (result instanceof Error) {
            ResponseHelper(response).sendError(400, result.message);
        }

        ResponseHelper(response).sendResult(201, result);
    },
};

router.get('/note/:noteID', routes.getNote);
router.put('/note/:noteID', routes.updateNote);
router.post('/note', routes.createNote);

export const NoteController = router;
