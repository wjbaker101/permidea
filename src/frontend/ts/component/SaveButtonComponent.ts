import { NoteClient } from '../client/NoteClient';
import { StateService } from '../service/StateService';
import { EventService, Events } from '../service/EventService';

export const SaveButtonComponent = (elementSelector: string) => {
    const saveButton: HTMLButtonElement
            = document.querySelector(elementSelector);

    const events = {
        async onClick(): Promise<void> {
            const currentNote = StateService.getState().currentNote;

            if (currentNote.title.length === 0) {
                EventService.publish({
                    type: Events.EVENT_ERROR_MESSAGE_SHOW,
                    payload: 'Please enter a title.',
                });

                return;
            }

            if (currentNote.content.length === 0) {
                EventService.publish({
                    type: Events.EVENT_ERROR_MESSAGE_SHOW,
                    payload: 'Please enter your note.',
                });

                return;
            }

            const createdNote = await NoteClient.createNote(
                    currentNote.title,
                    currentNote.content);

            if (createdNote instanceof Error) {
                EventService.publish({
                    type: Events.EVENT_ERROR_MESSAGE_SHOW,
                    payload: 'Sorry, something went wrong creating a new note.',
                });

                return;
            }

            window.location.hash = createdNote.noteID;
        },
    };

    saveButton.addEventListener('click', events.onClick);

    return saveButton;
};
