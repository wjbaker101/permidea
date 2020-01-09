import { NoteClient } from '../client/NoteClient';
import { StateService } from '../service/StateService';

export const SaveButtonComponent = (elementSelector: string) => {
    const saveButton: HTMLButtonElement
            = document.querySelector(elementSelector);

    const events = {
        async onClick(): Promise<void> {
            const currentNote = StateService.getState().currentNote;

            if (currentNote.title.length === 0) {
                return;
            }

            if (currentNote.content.length === 0) {
                return;
            }

            const createdNote = await NoteClient.createNote(
                    currentNote.title,
                    currentNote.content);

            if (createdNote instanceof Error) {
                return;
            }

            window.location.hash = createdNote.noteID;
        },
    };

    saveButton.addEventListener('click', events.onClick);

    return saveButton;
};
