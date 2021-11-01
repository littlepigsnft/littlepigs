import React, { Component } from 'react';
import './App.css';
import Web3 from 'web3';
import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';

import Logo from './assets/littlepigs_logo.svg';
import Twitter from './assets/twitter.svg';
import Discord from './assets/discord.svg';
import Preview from './assets/MorePigs.gif';

const INITIAL_STATE = {
  address: '',
  web3: null,
  provider: null,
  connected: false,
  chainId: 1,
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...INITIAL_STATE,
    };

    this.web3Modal = new Web3Modal({
      cacheProvider: true,
      providerOptions: this.getProviderOptions(),
    });
  }

  async componentDidMount() {
    //await this.setup();
  }

  async componentWillUnmount() {
    this.resetApp(false);
  }

  subscribeProvider = async (provider) => {
    if (!provider.on) {
      return;
    }

    provider.on('disconnect', () => {
      this.resetApp(false);
    });

    provider.on('accountsChanged', async (accounts) => {
      this.setState({ address: accounts[0] });
    });

    provider.on('chainChanged', async (chainId) => {
      const chainIdInt = parseInt(chainId);
      if (this.state.chainId !== chainIdInt) {
        this.setState({ chainId: chainIdInt });
        console.log('Network changed: ', chainIdInt);
      }
    });
  };

  getProviderOptions = () => {
    const providerOptions = {
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          infuraId: process.env.REACT_APP_INFURA_ID,
        },
      },
    };
    return providerOptions;
  };

  setup = async () => {
    const provider = await this.web3Modal.connect();
    await this.subscribeProvider(provider);

    const web3 = new Web3(provider);
    const accounts = await web3.eth.getAccounts();
    const address = accounts[0];
    const chainId = await web3.eth.getChainId();

    console.log('Connected: ', chainId);

    this.setState({
      web3,
      provider,
      connected: true,
      address,
      chainId,
      selIndex: -1,
    });
  };

  resetApp = async (clearCache) => {
    const { provider, web3 } = this.state;
    if (provider) provider.removeAllListeners();
    if (web3 && web3.currentProvider && web3.currentProvider.close) {
      await web3.currentProvider.close();
    }
    if (clearCache) {
      this.web3Modal.clearCachedProvider();
    }
    this.setState({ ...INITIAL_STATE });
  };

  render() {
    return (
      <div id="App">
        <img id="Main-Logo" alt="Little Pigs" src={Logo}></img>
        <div id="Social-Container">
          <a
            className="social-btn"
            target="_blank"
            rel="noreferrer"
            href="http://discord.gg/3bMSc9gwHQ"
          >
            <img alt="Discord" src={Discord}></img>
          </a>
          <a
            className="social-btn"
            target="_blank"
            rel="noreferrer"
            href="https://twitter.com/LittlePigsNFT"
          >
            <img alt="Twitter" src={Twitter}></img>
          </a>
        </div>
        <div id="Main-Preview">
          <img alt="Preview" src={Preview} width="160px"></img>
        </div>
      </div>
     );
  }
}

export default App;
