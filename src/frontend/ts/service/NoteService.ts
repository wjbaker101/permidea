import { NoteClient } from '../client/NoteClient';
import { StateService } from './StateService';

import { UpdateLoadingComponent } from '../component/UpdateLoadingComponent';

let updateTimeout: NodeJS.Timeout = null;

const updateLoadingComponent = UpdateLoadingComponent('.content-updating');

export const NoteService = {
    updateNote(): void {
        if (updateTimeout !== null) {
            clearTimeout(updateTimeout);
        }

        updateTimeout = setTimeout(async () => {
            const currentNote = StateService.getState().currentNote;

            if (currentNote === null || currentNote.noteID === null) {
                return;
            }

            updateLoadingComponent.classList.add('is-visible');

            await NoteClient.updateNote(
                    currentNote.noteID,
                    currentNote.title,
                    currentNote.content,
                    currentNote.creationDate);

            updateLoadingComponent.classList.remove('is-visible');
        }, 600);
    },
};
