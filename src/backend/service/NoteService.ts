import { NoteClient } from '../client/NoteClient';
import { NoteMapper } from '../mapper/NoteMapper';

import { INote } from '../../common/interface/INote';

export const NoteService = {
    async getNote(noteID: string): Promise<INote> {
        const note = await NoteClient.getNote(noteID);

        return NoteMapper.toModel(note);
    },

    async updateNote(noteID: string, title: string, content: string, creationDate: Date) {
        await NoteClient.updateNote(noteID, title, content, creationDate);
    },

    async createNote(title: string, content: string, creationDate: Date) {
        return await NoteClient.createNote(title, content, creationDate);
    },
}
