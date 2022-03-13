import {
    UPDATE_NODENAME,
    UPDATE_METHOD,
    UPDATE_PARAMS,
    UPDATE_APIKEY,
    CALL_RAW_METHOD,
    CALL_PROVIDER_METHOD
} from './nodeconsole-actions.js'

const INITIAL_STATE = {
    chainId: "0x63",
    accounts: [],
    path: 'node',
    nodename: 'ethnode0',
    method: 'eth_blockNumber',
    params: '[]',
    apikey: '',
    results: []
}

const MAX_RESULTS = 5;

export const nodeConsole = (state = INITIAL_STATE, action) => {

    let end;
    switch (action.type) {

    case UPDATE_NODENAME:
        return { ...state, nodename: action.nodename };
    case UPDATE_METHOD:
        return { ...state, method: action.method };
    case UPDATE_PARAMS:
        return { ...state, params: action.params };
    case UPDATE_APIKEY:
        return { ...state, apikey: action.apikey };

    case CALL_RAW_METHOD:
        if ( !(state.method && state.params) ) {
            return state;
        }
        end = state.results.length > MAX_RESULTS - 1 ? MAX_RESULTS - 1: state.results.length;
        state.results = [{
            request: action.request,
            response: action.response
        }, ...state.results.slice(0, end)];

        return state;

    case CALL_PROVIDER_METHOD:
        if ( !(state.method && state.params) ) {
            return state;
        }
        end = state.results.length > MAX_RESULTS - 1 ? MAX_RESULTS - 1: state.results.length;
        state.results = [{
            request: action.request,
            response: action.response
        }, ...state.results.slice(0, end)];

        return state;



    default:
        return state;
    }
};
export default nodeConsole;