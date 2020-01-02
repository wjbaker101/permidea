import { INoteEntity } from '../interface/INoteEntity';
import { INote } from '../../common/interface/INote';

export const NoteMapper = {
    toModel(note: INoteEntity): INote {
        const {
            NOTE_ID: noteID,
            TITLE: title,
            CONTENT: content,
            CREATION_DATE: creationDate,
        } = note;

        return {
            noteID,
            title,
            content,
            creationDate: new Date(creationDate),
        }
    },
}
