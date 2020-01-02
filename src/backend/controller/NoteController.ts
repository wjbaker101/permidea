import express, { Request, Response } from 'express';

import { NoteService } from '../service/NoteService';

const router = express.Router();

const routes = {
    async getNote(request: Request, response: Response) {
        const { noteID } = request.params;

        const note = await NoteService.getNote(noteID);

        response.send(note);
    },

    async updateNote(request: Request, response: Response) {
        const { noteID } = request.params;
        const { title, content, creationDate } = request.body;

        await NoteService.updateNote(noteID, title, content, new Date(creationDate));

        response.send({ success: true });
    },

    async createNote(request: Request, response: Response) {
        const { title, content, creationDate } = request.body;

        const noteID = await NoteService.createNote(title, content, new Date(creationDate));

        response.send({ noteID });
    },
};

router.get('/note/:noteID', routes.getNote);
router.put('/note/:noteID', routes.updateNote);
router.post('/note', routes.createNote);

export const NoteController = router;
