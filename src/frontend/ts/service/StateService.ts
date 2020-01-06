import { IState } from '../interface/IState';

const state: IState = {
    currentNote: null,
};

export const StateService = {

    getState(): IState {
        return state;
    },
}
