import shortID from 'shortid';

import { MySQLDatabaseClient } from './MySQLDatabaseClient';
import { ErrorCodes } from '../util/ErrorCodes';

import { INoteEntity } from '../interface/INoteEntity';

export const NoteClient = {

    async getNote(noteID: string): Promise<INoteEntity | Error> {
        try {
            const sql = 'SELECT * FROM Notes WHERE NOTE_ID = ?';

            const result = await MySQLDatabaseClient.query(sql, [noteID]);

            if (result.length === 0) {
                return new Error(ErrorCodes.GET_NOTE_NOT_FOUND);
            }

            return result[0];
        }
        catch (e) {
            return new Error(ErrorCodes.GET_NOTE_FAILURE);
        }
    },

    async updateNote(
            noteID: string,
            title: string,
            content: string,
            creationDate: Date): Promise<INoteEntity | Error> {
        try {
            const sql = 'UPDATE Notes SET ? WHERE NOTE_ID = ?';

            const partialNote = {
                TITLE: title,
                CONTENT: content,
                CREATION_DATE: creationDate.toISOString(),
            };

            await MySQLDatabaseClient.query(sql, [partialNote, noteID]);

            return {
                NOTE_ID: noteID,
                ...partialNote,
            }
        }
        catch (e) {
            return new Error(ErrorCodes.UPDATE_NOTE_FAILURE);
        }
    },

    async createNote(title: string, content: string, creationDate: Date): Promise<INoteEntity | Error> {
        try {
            const noteID = shortID.generate();
            const sql = 'INSERT INTO Notes SET ?';

            const note = {
                NOTE_ID: noteID,
                TITLE: title,
                CONTENT: content,
                CREATION_DATE: creationDate.toISOString(),
            };

            await MySQLDatabaseClient.query(sql, [note]);

            return note;
        }
        catch (e) {
            return new Error(ErrorCodes.CREATE_NOTE_FAILURE);
        }
    },
}
