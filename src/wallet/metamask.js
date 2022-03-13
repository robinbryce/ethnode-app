import { LitElement, html } from 'lit';
import { connect } from 'pwa-helpers';
import '@vaadin/vaadin-button';
import '@vaadin/vaadin-list-box';
import '@vaadin/vaadin-item';
import MetaMaskOnboarding from '@metamask/onboarding';

import { store } from '../redux/store.js';

const METAMASK_CONNECT = "connect";
const METAMASK_INSTALL = "install";

import {
  updateProvider,
  updateAccounts
} from './actions.js'

class MetaMask extends connect(store)(LitElement) {

  static get properties() {
    return {
      provider: {type: Object},
      accounts: {type: Array},
    };
  }

  constructor() {
    super();
    this.provider = null;
    this.accounts = [];
    this.onboarding = null;
  }

  stateChanged(state) {
    this.provider = state.wallet.provider;
    this.accounts = state.wallet.accounts;
  }

  updateProvider(e) {
    store.dispatch(updateProvider(e.target.value));
  }

  updateAccounts(accounts) {
    store.dispatch(updateAccounts(accounts));
  }

  onClickNetworkConnect(e) {
  }

  onClickConnectOrInstall(e) {

    const action = e.target.getAttribute('data-val');
    if (action == METAMASK_CONNECT) {
        window.ethereum
            .request({method: 'eth_requestAccounts'})
            .then(this.updateAccounts);
        window.ethereum.on('accountsChanged', this.updateAccounts);
        return;
    }
    if (action != METAMASK_INSTALL) {
        return;
    }
    if (!this.onboarding) {
        this.onboarding = new MetaMaskOnboarding();
    }
    this.onboarding.startOnboarding();
    // There is no need to 'stop' on boarding. MetaMask does its own thing (its a browser plugin)
  }

  render () {
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

    <vaadin-button theme="primary" data-val="${MetaMaskOnboarding.isMetaMaskInstalled() ? METAMASK_CONNECT : METAMASK_INSTALL}"
        @click="${this.onClickConnectOrInstall}">
        ${MetaMaskOnboarding.isMetaMaskInstalled() ? "Connect Wallet" : "Install MetaMask"}
    </vaadin-button>

    <vaadin-list-box selected="0">
    ${
      (this.accounts ? this.accounts : [])
      .map(
      a => html`
      <vaadin-item>${a}</vaadin-item>
      `
      )
    }
    </vaadin-list-box>
    `
  }


}

customElements.define('metamask-wallet', MetaMask);