import './nodeconsole.css'
import { LitElement, html } from 'lit';
import { connect } from 'pwa-helpers';
import '@vaadin/vaadin-text-field';
import '@vaadin/vaadin-button';

import { store } from '../redux/store.js';

import {
  updateNodeName as updateNodeName,
  updateMethod,
  updateParams,
  callMethod
} from './nodeconsole-actions.js'


class NodeConsole extends connect(store)(LitElement) {

  static get properties() {
    return {
      path: {type: String},
      nodename: {type: String},
      method: {type: String},
      params: {type: String},
      results: {type: Array}
    };
  }

  constructor () {
    super();
    this.requestId = 1;
    this.idToken = null;
  }

  stateChanged(state) {
    this.idToken = state.auth.idToken;
    this.path = state.nodeConsole.path;
    this.nodename = state.nodeConsole.nodename;
    this.method = state.nodeConsole.method;
    this.params = state.nodeConsole.params;
    this.results = state.nodeConsole.results;
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
        value="${this.nodename}" 
        @change="${this.updateNodeName}"> 
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
              <ul>
                <li>${r.response.ok ? "(OK) " : "(Failed) "}${r.request.path}/${r.request.nodename}/${JSON.stringify({jsonrpc:"2.0", method: r.request.method, params: r.request.params, id: r.request.id}, null, 2)}</li>
                <li>${r.response.ok ? JSON.stringify(r.response.data.result, null, 2) : r.response.data.responseText}</li>
              </ul>
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
      this.callMethod();
    }
  }

  updateNodeName(e) {
    store.dispatch(updateNodeName(e.target.value))
  }
  updateMethod(e) {
    store.dispatch(updateMethod(e.target.value))
  }
  updateParams(e) {
    store.dispatch(updateParams(e.target.value))
  }

  _callMethod(request, token) {

    return new Promise((resolve, reject) => {

        const url = ['', request.path,  request.nodename].join('/');
        const params = JSON.parse(request.params);

        const data=JSON.stringify({jsonrpc:"2.0", method: request.method, params: params, id: request.id});
        $.ajax({
          url: url,
          type: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          data: data,
          success: function(result) {
            resolve(result);
          },
          error: function(error) {
            reject(error);
          }
        })
    });
  }

  callMethod() {

    const request = {
      id: this.requestId,
      path: this.path,
      nodename: this.nodename,
      method: this.method,
      params: this.params
    };

    this.requestId += 1;

    this._callMethod(request, this.idToken)
    .then((data) => {
      const response = {
        data: data,
        ok: true
      };
      store.dispatch(callMethod(request, response));
    })
    .catch((error) => {
      const response = {
        data: error,
        ok: false
      };
      store.dispatch(callMethod(request, response));
    });
  }
}

customElements.define('node-console', NodeConsole);