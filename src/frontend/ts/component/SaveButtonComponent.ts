import { NoteClient } from '../client/NoteClient';
import { StateService } from '../service/StateService';

export const SaveButtonComponent = (elementSelector: string) => {
    const saveButton: HTMLButtonElement
            = document.querySelector(elementSelector);

    const events = {
        async onClick() {
            const currentNote = StateService.getState().currentNote;

            if (currentNote.title.length === 0) {
                return;
            }

            if (currentNote.content.length === 0) {
                return;
            }

            const result = await NoteClient.createNote(
                    currentNote.title,
                    currentNote.content);

            window.location.hash = result.noteID;
        },
    };

    saveButton.addEventListener('click', events.onClick);

    return saveButton;
};
