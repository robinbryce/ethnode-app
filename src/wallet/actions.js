export const UPDATE_PROVIDER = 'WALLET_UPDATE_PROVIDER';
export const UPDATE_ACCOUNTS = 'WALLET_UPDATE_ACCOUNTS';

export const UPDATE_NODENAME = 'WALLET_UPDATE_NODENAME';
export const UPDATE_METHOD = 'WALLET_UPDATE_METHOD';
export const UPDATE_PARAMS = 'WALLET_UPDATE_PARAMS';
export const CALL_METHOD = 'WALLET_CALL_METHOD';

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

export const rawRequest = (request, response) => {
    return {
        type: CALL_METHOD,
        request: request,
        response: response
    };
};

export const updateProvider = provider => {
    return {
        type: UPDATE_PROVIDER,
        provider
    }
}

export const updateAccounts = accounts => {
    return {
        type: UPDATE_ACCOUNTS,
        accounts
    }
}