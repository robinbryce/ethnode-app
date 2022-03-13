import {
    UPDATE_PROVIDER,
    UPDATE_ACCOUNTS,
    UPDATE_NODENAME,
    UPDATE_METHOD,
    UPDATE_PARAMS,
    CALL_METHOD

} from './actions.js'

const INITIAL_STATE = {
    provider: null,
    path: 'node',
    nodename: 'ethnode0',
    method: 'eth_blockNumber',
    params: '[]',
    results: []
}

const MAX_RESULTS = 5;

const wallet = (state = INITIAL_STATE, action) => {
    switch (action.type) {

    case UPDATE_NODENAME:
        return { ...state, nodename: action.nodename };
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
            request: action.request,
            response: action.response
        }, ...state.results.slice(0, end)];

        return state;

    case UPDATE_PROVIDER:
        return {...state, provider: action.provider}
    case UPDATE_ACCOUNTS:
        return {...state, accounts: action.accounts}
    default:
        return state;
    }
};
export default wallet;