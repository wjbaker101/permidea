import { NoteClient } from '../client/NoteClient';
import { NoteMapper } from '../mapper/NoteMapper';

import { INote } from '../../common/interface/INote';

export const NoteService = {

    async getNote(noteID: string): Promise<INote | Error> {
        const result = await NoteClient.getNote(noteID);

        if (result instanceof Error) {
            return result;
        }

        return NoteMapper.toModel(result);
    },

    async updateNote(
            noteID: string,
            title: string,
            content: string,
            creationDate: Date): Promise<INote | Error> {

        const result = await NoteClient.updateNote(
                noteID,
                title,
                content,
                creationDate);

        if (result instanceof Error) {
            return result;
        }

        return NoteMapper.toModel(result);
    },

    async createNote(title: string, content: string, creationDate: Date):
            Promise<INote | Error> {

        const result = await NoteClient.createNote(
            title,
            content,
            creationDate);

        if (result instanceof Error) {
            return result;
        }

        return NoteMapper.toModel(result);
    },
}
