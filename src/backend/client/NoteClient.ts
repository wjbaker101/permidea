import shortID from 'shortid';

import { MySQLDatabaseClient } from './MySQLDatabaseClient';

import { INoteEntity } from '../interface/INoteEntity';

export const NoteClient = {

    async getNote(noteID: string): Promise<INoteEntity | null> {
        const result = await MySQLDatabaseClient.query('SELECT * FROM Notes WHERE NOTE_ID = ?', [noteID]);

        if (result.length === 0) {
            return null
        }

        return result[0];
    },

    async updateNote(noteID: string, title: string, content: string, creationDate: Date): Promise<void> {
        await MySQLDatabaseClient.query('UPDATE Notes SET ? WHERE NOTE_ID = ?', [
            {
                TITLE: title,
                CONTENT: content,
                CREATION_DATE: creationDate.toISOString(),
            },
            noteID,
        ]);
    },

    async createNote(title: string, content: string, creationDate: Date): Promise<string | null> {
        const noteID = shortID.generate();

        await MySQLDatabaseClient.query('INSERT INTO Notes SET ?', [
            {
                NOTE_ID: noteID,
                TITLE: title,
                CONTENT: content,
                CREATION_DATE: creationDate.toISOString(),
            },
        ]);

        return noteID;
    },
}
