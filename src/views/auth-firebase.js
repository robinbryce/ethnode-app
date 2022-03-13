import { LitElement, html } from 'lit';
import { connect } from 'pwa-helpers';
import '@vaadin/vaadin-text-field';
import '@vaadin/vaadin-button';

import {
  getAuth,
  /* EmailAuthProvider,*/
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { initializeApp } from 'firebase/app';


import { store } from '../redux/store.js';

import {
  updateIDToken
} from './auth-actions.js'

const firebaseConfig = {
  apiKey: "AIzaSyDBiBbsc98dGlLonXS0BaaFWrkCZtot70g",
  authDomain: "iona-1.firebaseapp.com",
  projectId: "iona-1",
  storageBucket: "iona-1.appspot.com",
  messagingSenderId: "871349271977",
  appId: "1:871349271977:web:072a88c17984aa499e98b8"
};
/* const firebaseApp =*/
initializeApp(firebaseConfig);


const THAUMAGEN_TENANT='thaumagen-h92cb';
const PUBLIC_TENANT='public-69cvf';

// This structure was originaly for the benefit of firebaseui but we don't use
// that anymore.
var TENANT_CONFIG = {
  [THAUMAGEN_TENANT]: {

    'tenantName': 'Thaumagen'
  },
  [PUBLIC_TENANT]: {
    'tenantName': 'Public'
  }
};

function parseJwt (token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
  return JSON.parse(jsonPayload);
};
class AuthFirebase extends connect(store)(LitElement) {

  static get properties() {
    return {
        idToken: {type: String}
    };
  }

  constructor () {
    super();
    this.tenantConfig = TENANT_CONFIG;
    this.idClaims = null;
    this.tenantID = null;
    getAuth().onAuthStateChanged(this.authStatusChanged);
  }

  initAuthUI() {
  }

  stateChanged(state) {
    this.idToken = state.auth.idToken;
    if (this.idToken != null) {
      this.idClaims = parseJwt(this.idToken);
      this.tenantID = this.idClaims.firebase ? this.idClaims.firebase.tenant : null;
    }
  }

  render() {

      return html`
      <div class="mdl-cell mdl-cell--12-col mdl-cell--12-col-tablet mdl-grid">

        <!-- Container for the demo -->
        <div id="quickstart-tenant-card" class="mdl-card mdl-shadow--2dp mdl-cell mdl-cell--12-col mdl-cell--12-col-tablet mdl-cell--12-col-desktop">
          <div class="mdl-card__title mdl-color--light-blue-600 mdl-color-text--white">
            <p class="mdl-card__title-text">Sign in with google to one of these tenants</p>
          </div>
          <!-- Buttons that handle tenants sign-in -->
          <div id="sign-in-buttons">
              ${
                Object.entries(this.tenantConfig).map(
                  ([tenantId, cfg]) => html`
                  <vaadin-button id="${tenantId}" data-val="${tenantId}"
                      theme="primary"
                      @click="${this.onSignInClickHandler}"
                      >
                      ${cfg.tenantName}
                  </vaadin-button>
                  `
                )
              }
          </div>

          <div class="user-details-container">
            <p><span id="quickstart-sign-in-status">Signed in as ${this.idClaims ? this.idClaims.email : 'not signed in'}</span></p>
            <p>Tenant ID: <span id="tenant-id">${this.tenantID}</span></p>
            <p>ID Token: <div class="idtoken">${this.idToken}</div> <br/> </p>
            <pre><code id="account-details">${JSON.stringify(this.idClaims, null, 2)}</code></pre>
          </div>
          </div>
      </div>
      `
  }

  /**
   * Handles tenant selection button clicks.
   * @param {!Event} e The tenant sign-in button click event.
   */
  onSignInClickHandler(e) {
    const tenantId = e.target.getAttribute('data-val');
    const auth = getAuth();
    auth.tenantId = tenantId;
    auth.useDeviceLanguage();

    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
  }

  authStatusChanged(user) {

    if (user) {
        user.getIdToken().then(function(idToken){
            store.dispatch(updateIDToken(idToken));
        });
    } else {
        store.dispatch(updateIDToken(null));
    }
  }
}

customElements.define('auth-firebase', AuthFirebase);
