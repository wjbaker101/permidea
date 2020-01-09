import { NoteService } from '../service/NoteService';
import { StateService } from '../service/StateService';

export const TitleTextboxComponent = (elementSelector: string) => {
    const titleTextbox: HTMLInputElement
            = document.querySelector(elementSelector);

    const events = {
        onInput(): void {
            StateService.getState().currentNote.title = titleTextbox.value;

            NoteService.updateNote();
        },
    };

    titleTextbox.addEventListener('input', events.onInput);
    titleTextbox.addEventListener('change', events.onInput);
    titleTextbox.addEventListener('cut', events.onInput);
    titleTextbox.addEventListener('copy', events.onInput);
    titleTextbox.addEventListener('paste', events.onInput);

    return titleTextbox;
}
