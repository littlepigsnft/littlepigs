import React, { Component, createRef } from 'react';
import './App.css';
import Web3 from 'web3';
import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';

import Logo from './assets/littlepigs_logo.svg';
import Twitter from './assets/twitter.svg';
import Discord from './assets/discord.svg';
import Preview from './assets/Pigs_320x320.gif';

const INITIAL_STATE = {
  address: '',
  web3: null,
  provider: null,
  connected: false,
  chainId: 1,
};

class App extends Component {
  timerRef = createRef(null);

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
    this._setRemaining();
    setInterval(() => {
      this._setRemaining();
    }, 10000);
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

  _setRemaining = () => {
    let days = 0;
    let hours = 0;
    let minutes = 0;

    let delay = Date.now();
    if (delay < 1638316800000) {
      delay = (1638316800000 - delay) / 1000;
      days = parseInt(delay / 86400);
      delay -= days * 86400;
      hours = parseInt(delay / 3600);
      delay -= hours * 3600;
      minutes = parseInt(delay / 60);
    }
    this.timerRef.current.innerHTML = `${days
      .toString()
      .padStart(2, '0')} DAYS ${hours
      .toString()
      .padStart(2, '0')} HOURS ${minutes.toString().padStart(2, '0')} OINKS`;
  };

  render() {
    return (
      <div id="App">
        <img id="Main-Logo" alt="Little Pigs" src={Logo}></img>
        <div id="App-Content">
          <div id="Social-Container">
            <a
              className="app-btn social-btn"
              target="_blank"
              rel="noreferrer"
              href="http://discord.gg/3bMSc9gwHQ"
            >
              <img className="social-icon" alt="Discord" src={Discord} />
              <div className="social-text">GO HOG-WILD ON DISCORD</div>
            </a>
            <a
              className="app-btn social-btn"
              target="_blank"
              rel="noreferrer"
              href="https://twitter.com/LittlePigsNFT"
            >
              <img className="social-icon" alt="Twitter" src={Twitter} />
              <div className="social-text">GET DIRTY AT TWITTER</div>
            </a>
            <div className="app-btn" id="Social-Counter" ref={this.timerRef}>
              12 DAYS 00 HOURS 00 OINKS
            </div>
          </div>
          <div id="Main-Preview">
            <img id="Preview-Image" alt="Preview" src={Preview} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
