import { EventBus } from 'ts-bus';

export const EventService = new EventBus();

export const Events = {
    EVENT_ERROR_MESSAGE_SHOW: 'event.error_message.show',
    EVENT_ERROR_MESSAGE_HIDE: 'event.error_message.hide',
}
