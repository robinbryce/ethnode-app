import './nodeconsole.css'
import { LitElement, html } from 'lit';
import { connect } from 'pwa-helpers';
import '@vaadin/vaadin-text-field';
import '@vaadin/vaadin-button';

import { store } from '../redux/store.js';

import {
  updateName,
  updateMethod,
  updateParams,
  callMethod
} from './nodeconsole-actions.js'


class NodeConsole extends connect(store)(LitElement) {

  static get properties() {
    return {
      path: {type: String},
      name: {type: String},
      method: {type: String},
      params: {type: String},
      results: {type: Array}
    };
  }

  constructor () {
    super();
    this.requestId = 1;
  }

  stateChanged(state) {
    this.path = state.nodeConsole.path;
    this.name = state.nodeConsole.name;
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
      this.callMethod();
    }
  }

  updateName(e) {
    store.dispatch(updateName(e.target.value))
  }
  updateMethod(e) {
    store.dispatch(updateMethod(e.target.value))
  }
  updateParams(e) {
    store.dispatch(updateParams(e.target.value))
  }

  callMethod() {
    store.dispatch(callMethod(this.requestId));
    this.requestId += 1;
  }
}

customElements.define('node-console', NodeConsole);