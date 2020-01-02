interface INote {
    noteID: string,
    title: string,
    content: string,
    creationDate: Date,
}

let currentNote: (INote | null) = null;
let timeout: NodeJS.Timeout = null;

const DateFormatter = {
    days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],

    formatDate(date: Date): string {
        const day = this.days[date.getDay()];
        const dateOfMonth = date.getDate();
        const month = this.months[date.getMonth()];
        const year = date.getFullYear();

        const hours = date.getHours();
        const minutes = date.getMinutes();

        const timePostfix = hours > 12 ? 'pm' : 'am';
        const hours12 = hours > 12 ? hours - 12 : hours;

        return `${day} ${dateOfMonth}${this.getOrdinal(dateOfMonth)} ${month} ${year}, ${hours12}:${minutes}${timePostfix}`;
    },

    getOrdinal(n: number): string {
        return (n > 0 ? ['th', 'st', 'nd', 'rd'][(n > 3 && n < 21) || n % 10 > 3 ? 0 : n % 10] : '');
    }
};

const NoteClient = {
    baseURL: '/api',

    async getNote(noteID: string): Promise<INote> {
        const response = await fetch(`${this.baseURL}/note/${noteID}`);
        const result = await response.json();

        return {
            noteID: result.noteID,
            title: result.title,
            content: result.content,
            creationDate: new Date(result.creationDate),
        }
    },

    async updateNote(noteID: string, title: string, content: string, creationDate: Date): Promise<INote> {
        const response = await fetch(`${this.baseURL}/note/${noteID}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title,
                content,
                creationDate,
            }),
        });

        return await response.json();
    },

    async createNote(title: string, content: string): Promise<INote> {
        const response = await fetch(`${this.baseURL}/note`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title,
                content,
                creationDate: new Date().toISOString(),
            }),
        });

        return await response.json();
    },
};

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

const SaveButtonEvents = (titleElement: HTMLInputElement, textarea: HTMLTextAreaElement) => ({
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

const TitleInputEvents = (textarea: HTMLTextAreaElement, titleElement: HTMLInputElement) => ({

    onInput() {
        UpdateHandler.updateNote(titleElement, textarea);
    },
});

const TextareaEvents = (textarea: HTMLTextAreaElement, titleElement: HTMLInputElement) => ({

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

    async onLoad(loadingIcon: HTMLDivElement, dateElement: HTMLElement, saveButton: HTMLButtonElement) {
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
            dateElement.innerHTML = DateFormatter.formatDate(currentNote.creationDate);
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