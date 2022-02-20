export const UPDATE_NODENAME = 'NODECONSOLE_UPDATE_NODENAME';
export const UPDATE_METHOD = 'NODECONSOLE_UPDATE_METHOD';
export const UPDATE_PARAMS = 'NODECONSOLE_UPDATE_PARAMS';
export const CALL_METHOD = 'NODECONSOLE_CALL_METHOD';

export const updateNodeName = nodename => {
    return {
        type: UPDATE_NODENAME,
        nodename
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

export const callMethod = (request, response) => {
    return {
        type: CALL_METHOD,
        request: request,
        response: response
    };
};
