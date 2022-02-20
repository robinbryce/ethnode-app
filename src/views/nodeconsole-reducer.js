import {
    UPDATE_NAME,
    UPDATE_METHOD,
    UPDATE_PARAMS,
    CALL_METHOD
} from './nodeconsole-actions.js'

const INITIAL_STATE = {
    path: 'node',
    name: 'ethnode0',
    method: 'eth_blockNumber',
    params: '[]',
    results: []
}

const MAX_RESULTS = 5;

export const nodeConsole = (state = INITIAL_STATE, action) => {
    switch (action.type) {

    case UPDATE_NAME:
        return { ...state, name: action.name };
    case UPDATE_METHOD:
        return { ...state, method: action.method };
    case UPDATE_PARAMS:
        return { ...state, params: action.params };

    case CALL_METHOD:
        if ( !(state.method && state.params) ) {
            return state;
        }
        const end = state.results.length > MAX_RESULTS - 1 ? MAX_RESULTS - 1: state.results.length;
        state.results = [{
            requestId: action.requestId,
            name: state.name,
            method: state.method,
            params: state.params
        }, ...state.results.slice(0, end)];

        return state;

    default:
        return state;
    }
};
export default nodeConsole;