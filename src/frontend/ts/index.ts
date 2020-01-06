import { NoteClient } from './client/NoteClient';
import { StateService } from './service/StateService';
import { DateUtils } from './util/DateUtils';

import { ContentTextboxComponent } from './component/ContentTextboxComponent';
import { LoadingIconComponent } from './component/LoadingIconComponent';
import { NoteDateComponent } from './component/NoteDateComponent';
import { SaveButtonComponent } from './component/SaveButtonComponent';
import { TitleTextboxComponent } from './component/TitleTextboxComponent';

const init = async () => {
    const saveButtonComponent = SaveButtonComponent('.save-button');
    const titleTextboxComponent = TitleTextboxComponent('.note-title');
    const contentTextboxComponent = ContentTextboxComponent('.note-content');
    const noteDateComponent = NoteDateComponent('.note-date');
    const loadingIconComponent = LoadingIconComponent('.content-loading');

    const noteID = window.location.hash.substring(1);

    if (noteID.length === 0) {
        loadingIconComponent.classList.remove('is-visible');
        saveButtonComponent.classList.add('is-visible');
        contentTextboxComponent.disabled = false;

        StateService.getState().currentNote = {
            noteID: null,
            title: titleTextboxComponent.value,
            content: contentTextboxComponent.value,
            creationDate: new Date(),
        };

        return;
    }

    loadingIconComponent.classList.add('is-visible');
    saveButtonComponent.classList.remove('is-visible');
    contentTextboxComponent.disabled = true;
    contentTextboxComponent.value = '';
    titleTextboxComponent.value = '';
    noteDateComponent.innerHTML = '';

    const newNote = await NoteClient.getNote(noteID);
    StateService.getState().currentNote = newNote;

    if (newNote !== null) {
        contentTextboxComponent.value = newNote.content;
        titleTextboxComponent.value = newNote.title;
        noteDateComponent.innerHTML = DateUtils.formatDate(newNote.creationDate);
    }

    loadingIconComponent.classList.remove('is-visible');
    contentTextboxComponent.disabled = false;
};

(async () => {
    await init();

    window.onhashchange = async (event: HashChangeEvent) => {
        await init();
    };
})();
