import { NoteClient } from '../client/NoteClient';
import { StateService } from './StateService';

let updateTimeout: NodeJS.Timeout = null;

export const NoteService = {
    updateNote() {
        if (updateTimeout !== null) {
            clearTimeout(updateTimeout);
        }

        updateTimeout = setTimeout(async () => {
            const currentNote = StateService.getState().currentNote;

            if (currentNote === null || currentNote.noteID === null) {
                return;
            }

            await NoteClient.updateNote(
                    currentNote.noteID,
                    currentNote.title,
                    currentNote.content,
                    currentNote.creationDate);
        }, 600);
    },
};
