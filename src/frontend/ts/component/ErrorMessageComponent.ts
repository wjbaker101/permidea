import { BusEvent } from 'ts-bus/types';

import { EventService, Events } from '../service/EventService';

export const ErrorMessageComponent = (elementSelector: string) => {
    const errorMessage: HTMLDivElement
            = document.querySelector(elementSelector);

    EventService.subscribe(Events.EVENT_ERROR_MESSAGE_SHOW, (e: BusEvent) => {
        errorMessage.innerHTML = e.payload;
        errorMessage.classList.add('is-visible');

        setTimeout(() => {
            EventService.publish({
                type: Events.EVENT_ERROR_MESSAGE_HIDE,
                payload: '',
            });
        }, 4000);
    });

    EventService.subscribe(Events.EVENT_ERROR_MESSAGE_HIDE, (e: BusEvent) => {
        errorMessage.classList.remove('is-visible');
    });

    return errorMessage;
}
