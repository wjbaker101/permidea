import { INote } from '../../common/interface/INote';

import { NoteClient } from './client/NoteClient';
import { DateUtils } from './util/DateUtils';

let currentNote: (INote | null) = null;
let timeout: NodeJS.Timeout = null;

const UpdateHandler = {
    updateNote(titleElement: HTMLInputElement, textarea: HTMLTextAreaElement) {
        if (timeout !== null) {
            clearTimeout(timeout);
        }

        timeout = setTimeout(async () => {
            if (currentNote === null) {
                return;
            }

            await NoteClient.updateNote(
                    currentNote.noteID,
                    titleElement.value,
                    textarea.value,
                    currentNote.creationDate);
        }, 600);
    },
};

const SaveButtonEvents =
        (titleElement: HTMLInputElement, textarea: HTMLTextAreaElement) => ({

    async onClick() {
        if (titleElement.value.length === 0) {
            return;
        }

        if (textarea.value.length === 0) {
            return;
        }

        const result: any = await NoteClient.createNote(titleElement.value, textarea.value);

        window.location.hash = result.noteID;
    },
});

const TitleInputEvents =
        (textarea: HTMLTextAreaElement, titleElement: HTMLInputElement) => ({

    onInput() {
        UpdateHandler.updateNote(titleElement, textarea);
    },
});

const TextareaEvents =
        (textarea: HTMLTextAreaElement, titleElement: HTMLInputElement) => ({

    onKeyDown(event: KeyboardEvent) {
        if (event.keyCode === 9) {
            const tab = '    ';

            const caretPosition = textarea.selectionStart + tab.length;

            textarea.value = `${textarea.value.substring(0, caretPosition)}${tab}${textarea.value.substring(caretPosition, textarea.value.length)}`;

            textarea.selectionStart = caretPosition;
            textarea.selectionEnd = caretPosition;

            event.preventDefault();
            return false;
        }
    },

    onInput(event: InputEvent) {
        textarea.style.height = '1px';
        textarea.style.height = `${textarea.scrollHeight}px`;

        UpdateHandler.updateNote(titleElement, textarea);
    },

    async onLoad(
            loadingIcon: HTMLDivElement,
            dateElement: HTMLElement,
            saveButton: HTMLButtonElement) {

        const noteID = window.location.hash.substring(1);

        if (noteID.length === 0) {
            loadingIcon.classList.remove('is-visible');
            saveButton.classList.add('is-visible');
            textarea.disabled = false;

            return;
        }

        loadingIcon.classList.add('is-visible');
        saveButton.classList.remove('is-visible');
        textarea.disabled = true;
        textarea.value = '';
        titleElement.value = '';
        dateElement.innerHTML = '';

        currentNote = await NoteClient.getNote(noteID);

        if (currentNote !== null) {
            textarea.value = currentNote.content;
            dateElement.innerHTML = DateUtils.formatDate(currentNote.creationDate);
            titleElement.value = currentNote.title;
        }

        loadingIcon.classList.remove('is-visible');
        textarea.disabled = false;
    },
});

document.addEventListener('DOMContentLoaded', () => {
    const textarea: HTMLTextAreaElement = document.querySelector('textarea');
    const loadingIcon: HTMLDivElement = document.querySelector('.content-loading');
    const titleElement: HTMLInputElement = document.querySelector('.note-title');
    const dateElement: HTMLDivElement = document.querySelector('.note-date');
    const saveButton: HTMLButtonElement = document.querySelector('.save-button');

    const textareaEvents = TextareaEvents(textarea, titleElement);
    const titleInputEvents = TitleInputEvents(textarea, titleElement);
    const saveButtonEvents = SaveButtonEvents(titleElement, textarea);

    (async () => {
        window.onhashchange = async (event: HashChangeEvent) => {
            await textareaEvents.onLoad(loadingIcon, dateElement, saveButton);
        };

        await textareaEvents.onLoad(loadingIcon, dateElement, saveButton);
    })();

    textarea.addEventListener('keydown', textareaEvents.onKeyDown);
    textarea.addEventListener('input', textareaEvents.onInput);
    textarea.addEventListener('propertychange', textareaEvents.onInput);

    titleElement.addEventListener('input', titleInputEvents.onInput);
    titleElement.addEventListener('change', titleInputEvents.onInput);
    titleElement.addEventListener('cut', titleInputEvents.onInput);
    titleElement.addEventListener('copy', titleInputEvents.onInput);
    titleElement.addEventListener('paste', titleInputEvents.onInput);

    saveButton.addEventListener('click', saveButtonEvents.onClick);
});
