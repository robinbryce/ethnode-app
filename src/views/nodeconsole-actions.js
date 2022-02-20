export const UPDATE_NAME = 'NODECONSOLE_UPDATE_NAME';
export const UPDATE_METHOD = 'NODECONSOLE_UPDATE_METHOD';
export const UPDATE_PARAMS = 'NODECONSOLE_UPDATE_PARAMS';
export const CALL_METHOD = 'NODECONSOLE_CALL_METHOD';

export const updateName = name => {
    return {
        type: UPDATE_NAME,
        name
    };
};

export const updateMethod = method => {
    return {
        type: UPDATE_METHOD,
        method
    };
};
export const updateParams = params => {
    return {
        type: UPDATE_PARAMS,
        params
    };
};

export const callMethod = (requestId) => {
    return {
        type: CALL_METHOD,
        requestId
    };
};
