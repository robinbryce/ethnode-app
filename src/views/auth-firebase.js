import { LitElement, html } from 'lit';
import { connect } from 'pwa-helpers';
import '@vaadin/vaadin-text-field';
import '@vaadin/vaadin-button';

import { store } from '../redux/store.js';

import {
  updateIDToken
} from './auth-actions.js'


class AuthFirebase extends connect(store)(LitElement) {

  static get properties() {
    return {
        idToken: {type: String}
    };
  }

  constructor () {
    super();
  }

  stateChanged(state) {
    this.idToken = state.auth.idToken;
  }

  render() {
    return html`
     <style>
        node-console {
          display: block;
          max-width: 800px;
          margin: 0 auto;
        }
        node-console .input-layout {
          width: 100%;
          display: flex;
        }
        node-console .input-layout vaadin-text-field {
          flex: 1;
          margin-right: var(--spacing);
        }
        node-console .results-list {
          margin-top: var(--spacing);
        }
        node-console .visibility-filters {
          margin-top: calc(4 * var(--spacing));
        }
      </style>

      <div class="input-layout"
        @keyup="${this.shortcutListener}"> 

      <vaadin-text-field
        placeholder="Node name, eg ethnode0"
        value="${this.name}" 
        @change="${this.updateName}"> 
      </vaadin-text-field>

      <vaadin-text-field
        placeholder="Method name, eg eth_blockNumber"
        value="${this.method}" 
        @change="${this.updateMethod}"> 
      </vaadin-text-field>

      <vaadin-text-field
        placeholder="Method params, eg []"
        value="${this.params}" 
        @change="${this.updateParams}"> 
      </vaadin-text-field>

      <vaadin-button
        theme="primary"
        @click="${this.callMethod}"> 
          Call
      </vaadin-button>

      <div class="results-list">
        ${
          this.results.map(
            r => html`
              <div class="result-item">
              <ul><li>${r.requestId}</li><li>${r.name}</li><li>${r.params}</li><li>${r.method}</li></ul>
              </div>
            `
          )
        }
      </div>
    </div>
    `;
  }

  shortcutListener(e) {
    if (e.key === 'Enter') { (3)
      // this.callMethod();
      console.log(JSON.stringify(e));
    }
  }

  updateUser(user) {

    if (user) {
        user.getIdToken().then(function(idToken){
            store.dispatch(updateIDToken(idToken));
        });
    } else {
        store.dispatch(updateIDToken(null));
    }
    document.getElementById('close-modal-icon').addEventListener('click', function() {
      document.getElementById('auth-modal').close();
    });
    document.getElementById('sign-out').addEventListener('click', function() {
      auth.getAuth().signOut();
    });
  }
}

customElements.define('auth-firebase', AuthFirebase);