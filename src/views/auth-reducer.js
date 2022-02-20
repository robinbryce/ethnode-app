import {
    UPDATE_IDTOKEN,
} from './auth-actions.js'

const INITIAL_STATE = {
    idToken: null
}

const auth = (state = INITIAL_STATE, action) => {
    switch (action.type) {
    case UPDATE_IDTOKEN:
        return {...state, idToken: action.idToken}
    default:
        return state;
    }
};
export default auth;