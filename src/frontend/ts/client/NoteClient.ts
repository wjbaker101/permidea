import { INote } from '../../../common/interface/INote';

const BASE_URL = '/api';

export const NoteClient = {

    async getNote(noteID: string): Promise<INote> {
        const response = await fetch(`${BASE_URL}/note/${noteID}`);
        const result = await response.json();

        return {
            ...result,
            creationDate: new Date(result.creationDate),
        }
    },

    async updateNote(
            noteID: string,
            title: string,
            content: string,
            creationDate: Date): Promise<INote> {

        const response = await fetch(`${BASE_URL}/note/${noteID}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title,
                content,
                creationDate,
            }),
        });

        const result = await response.json();

        return {
            ...result,
            creationDate: new Date(result.creationDate),
        }
    },

    async createNote(title: string, content: string): Promise<INote> {
        const response = await fetch(`${BASE_URL}/note`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title,
                content,
                creationDate: new Date().toISOString(),
            }),
        });

        const result = await response.json();

        return {
            ...result,
            creationDate: new Date(result.creationDate),
        }
    },
};
