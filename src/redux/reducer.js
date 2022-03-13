import { combineReducers } from 'redux';

import nodeConsole from '../views/nodeconsole-reducer.js';
import auth from '../views/auth-reducer.js';
import wallet from '../wallet/reducer.js';

export default combineReducers({nodeConsole, auth, wallet});