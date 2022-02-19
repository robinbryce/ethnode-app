import * as auth from 'firebase/auth';
import {auth as authui }  from 'firebaseui';
import { initializeApp } from 'firebase/app';

// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDBiBbsc98dGlLonXS0BaaFWrkCZtot70g",
  authDomain: "iona-1.firebaseapp.com",
  projectId: "iona-1",
  storageBucket: "iona-1.appspot.com",
  messagingSenderId: "871349271977",
  appId: "1:871349271977:web:072a88c17984aa499e98b8"
};
// Initialize Firebase
/* const firebaseApp =*/
initializeApp(firebaseConfig);


const THAUMAGEN_TENANT='thaumagen-h92cb';
const PUBLIC_TENANT='public-69cvf';
/**
 * The configuration object for each tenant project keyed by tenant ID.
 * The tenant name will be displayed on the sign-in buttons. uiConfig will
 * be used to config FirebaseUI. You can specify the provider you'd like
 * to enable for each tenant.
 *
 * You'll need to substitute the `TENANT_ID` with the tenant IDs of your
 * project and `tenantName` with the display names you'd like to use for
 * the tenant selection buttons.
 *
 * For SAML, OIDC and generic OAuth providers, you'll need to configure
 * the `provider`, `providerName`, `buttonColor` and `iconUrl` in
 * `signInOptions`.
 */
var TENANT_CONFIG = {
  [THAUMAGEN_TENANT]: {

    'tenantName': 'Thaumagen',
    'uiConfig': {
      'signInOptions': [
        auth.EmailAuthProvider.PROVIDER_ID,
        auth.GoogleAuthProvider.PROVIDER_ID],
      'credentialHelper': 'none',
      'signInFlow': 'popup',
      'callbacks': {
        'signInSuccessWithAuthResult': function(authResult, redirectUrl) {
          document.getElementById('tenant-ui-modal').close();
          return false;
        }
      }
    }
  },
  [PUBLIC_TENANT]: {
    'tenantName': 'General public',
    'uiConfig': {
      'signInOptions': [auth.GoogleAuthProvider.PROVIDER_ID],
      'credentialHelper': 'none',
      'signInFlow': 'popup',
      'callbacks': {
        'signInSuccessWithAuthResult': function(authResult, redirectUrl) {
          document.getElementById('tenant-ui-modal').close();
          return false;
        }
      }
    }
  }
};
var ui = null;
/**
 * Dynamically creates the tenant sign-in buttons.
 */
function initializeSignInButtons() {
  var buttonContainer = document.getElementById('sign-in-buttons');
  Object.keys(TENANT_CONFIG).forEach(function(key) {
    var tenantId = key;
    var tenantName = TENANT_CONFIG[key].tenantName;
    var uiConfig = TENANT_CONFIG[key].uiConfig;
    var button = document.createElement('button');
    button.classList = 'mdl-button mdl-js-button mdl-button--raised';
    button.id = tenantId;
    button.textContent = tenantName;
    button.setAttribute('data-val', tenantId);
    button.addEventListener('click', onSignInClickHandler);
    buttonContainer.appendChild(button);
  });
}
/**
 * Handles tenant selection button clicks.
 * @param {!Event} e The tenant sign-in button click event.
 */
function onSignInClickHandler(e) {
  var tenantId = e.target.getAttribute('data-val');
  auth.getAuth().tenantId = tenantId;
  ui.reset();
  ui.start('#firebaseui-auth-container', TENANT_CONFIG[tenantId]['uiConfig']);
  document.getElementById('quickstart-tenant-modal-title').textContent = 'Tenant ID: ' + tenantId;
  document.getElementById('tenant-ui-modal').show();
}
/**
 * Handles setting up UI event listeners and registering Firebase auth listeners:
 *  - firebase.auth().onAuthStateChanged: This listener is called when the user is signed in or
 *    out, and that is where we update the UI.
 */
function initApp() {
  // Initialize the FirebaseUI component.
  ui = new authui.AuthUI(auth.getAuth());
  // Dynamically initialize the tenant sign-in buttons.
  initializeSignInButtons();

  auth.getAuth().onAuthStateChanged(function(user) {
    if (user) {
      document.getElementById('quickstart-sign-in-status').textContent = 'Signed in';
      document.getElementById('quickstart-account-details').textContent = JSON.stringify(user, null, '  ');
      document.getElementById('quickstart-tenant-id').textContent = user.tenantId;
    } else {
      document.getElementById('quickstart-sign-in-status').textContent = 'Signed out';
      document.getElementById('quickstart-account-details').textContent = 'null';
      document.getElementById('quickstart-tenant-id').textContent = 'null';
    }
    document.getElementById('close-modal-icon').addEventListener('click', function() {
      document.getElementById('tenant-ui-modal').close();
    });
    document.getElementById('sign-out').addEventListener('click', function() {
      auth().signOut();
    });
  });
}
window.onload = function() {
  initApp();
};
