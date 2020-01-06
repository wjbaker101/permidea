import { NoteService } from '../service/NoteService';
import { StateService } from '../service/StateService';

export const ContentTextboxComponent = (elementSelector: string) => {
    const contentTextbox: HTMLTextAreaElement
            = document.querySelector(elementSelector);

    const events = {
        onKeyDown(event: KeyboardEvent) {
            if (event.keyCode === 9) {
                const tab = '    ';

                const caretPosition = contentTextbox.selectionStart + tab.length;

                contentTextbox.value = `${contentTextbox.value.substring(0, caretPosition)}${tab}${contentTextbox.value.substring(caretPosition, contentTextbox.value.length)}`;

                contentTextbox.selectionStart = caretPosition;
                contentTextbox.selectionEnd = caretPosition;

                event.preventDefault();
                return false;
            }
        },

        onInput() {
            contentTextbox.style.height = '1px';
            contentTextbox.style.height = `${contentTextbox.scrollHeight}px`;

            StateService.getState().currentNote.content = contentTextbox.value;

            NoteService.updateNote();
        },
    };

    contentTextbox.addEventListener('keydown', events.onKeyDown);
    contentTextbox.addEventListener('input', events.onInput);
    contentTextbox.addEventListener('propertychange', events.onInput);

    return contentTextbox;
}
