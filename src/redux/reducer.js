import { combineReducers } from 'redux';

import nodeConsole from '../views/nodeconsole-reducer.js';
import authReducer from '../views/auth-reducer.js';

export default combineReducers({nodeConsole});