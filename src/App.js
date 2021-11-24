import React, { Component, createRef } from 'react';
import './App.css';
import Web3 from 'web3';
import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';
import LittlePigsABI from './abi/littlepigs.json';

import Navbar from './components/navbar/navbar';

import Logo from './assets/littlepigs_logo.svg';
import Twitter from './assets/twitter.svg';
import Discord from './assets/discord.svg';
import Preview from './assets/PIGS_320x320.gif';
import Devider from './assets/collection.png';
import ImagePage1 from './assets/page1.png';
import ImagePage2 from './assets/page2.png';
import ImagePage3 from './assets/rarities_image.jpg';
import ImageTeam1 from './assets/team1.png';
import ImageTeam2 from './assets/team2.png';
import ImageTeam3 from './assets/team3.png';
import ImageTeam4 from './assets/team4.png';
import ImageTeam5 from './assets/team5.png';

const INITIAL_STATE = {
  connected: false,
};

class App extends Component {
  timerRef = createRef(null);

  constructor(props) {
    super(props);
    this.state = {
      ...INITIAL_STATE,
    };

    this.address = '';
    this.web3 = undefined;
    this.provider = undefined;
    this.contract = undefined;
    this.networkName = 'Ethereum';
    this.chainId = 1;

    this.web3Modal = new Web3Modal({
      cacheProvider: true,
      providerOptions: this.getProviderOptions(),
    });
  }

  async componentDidMount() {
    await this.setup();
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
      if (this.chainId !== chainIdInt) {
        this.chainId = chainIdInt;
        this.setup();
        console.log('Network changed: ', chainIdInt);
      }
    });
  };

  getProviderOptions = () => {
    console.log(process.env.REACT_APP_INFURA_ID);
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
    this.resetApp(false);

    this.provider = await this.web3Modal.connect();
    await this.subscribeProvider(this.provider);

    this.web3 = new Web3(this.provider);
    this.accounts = await this.web3.eth.getAccounts();
    this.address = this.accounts[0];
    this.chainId = await this.web3.eth.getChainId();

    console.log('Connected: ', this.chainId);

    this.contract = undefined;
    if (this.chainId === 4) {
      this.networkName = 'Rinkeby';
      this.contract = new this.web3.eth.Contract(
        LittlePigsABI,
        '0x1f1cc38324bb4bf0b66772ec673201f57688897e'
      );
    }
    if (this.contract) {
      const total = await this.contract.methods.totalSupply().call();
      console.log(total);
    }

    this.setState({
      connected: true,
    });
  };

  _shortAddress() {
    const { connected } = this.state;
    return connected
      ? this.contract
        ? this.address.substring(0, 6) +
          '...' +
          this.address.substring(this.address.length - 4, this.address.length) +
          ' (' +
          this.networkName +
          ')'
        : 'INVALID NETWORK'
      : 'CONNECT WALLET';
  }

  resetApp = async (clearCache) => {
    const { provider, web3 } = this.state;
    if (provider) provider.removeAllListeners();
    if (web3 && web3.currentProvider && web3.currentProvider.close) {
      await web3.currentProvider.close();
    }
    this.contract = undefined;
    this.web3 = undefined;
    this.provider = undefined;
    this.address = '';

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
    if (this.timerRef?.current)
      this.timerRef.current.innerHTML = `${days
        .toString()
        .padStart(2, '0')} DAYS ${hours
        .toString()
        .padStart(2, '0')} HOURS ${minutes.toString().padStart(2, '0')} OINKS`;
  };

  _toggleConnect = () => {
    if (this.state.connected) this.resetApp(true);
    else this.setup();
  };

  render() {
    return (
      <>
        <div id="Home">
          <Navbar />
          <div id="Home-Content">
            <div id="Social-Container">
              <p className="header">Meet the Little Pigs</p>
              <p className="last">
                10,000 porkers from Pigsville ready to blow the ETH blockchain
                down.
              </p>
              <div
                className="app-btn social-btn"
                id="Connect-Button"
                onClick={() => this._toggleConnect()}
              >
                {this._shortAddress()}
              </div>
              <div className="app-btn" id="Social-Counter" ref={this.timerRef}>
                12 DAYS 00 HOURS 00 OINKS
              </div>
            </div>
            <div id="Main-Preview">
              <img id="Preview-Image" alt="Preview" src={Preview} />
            </div>
          </div>
        </div>
        <div className="page" id="About">
          <div className="flex-half-image">
            <img alt="Porky" src={ImagePage1} width="280px" />
          </div>
          <div className="flex-half-text">
            <p className="header">Once Upon a Time …</p>
            <p className="normal">
              Following their bestseller, The Three Pigs spent some time in the
              limelight. They brought a ton of cash back to Pigsville and the
              economy ramped up. Hoove’s Hookers, Ham’s Diner, and other such
              fine establishments began to take off.
            </p>
            <p className="normal">
              The Little Pigs of Pigsville were finally able to afford daily
              necessities like clothing and cocaine. They took a liking to this
              new-found money.
            </p>
            <p className="last">
              They bought swaggy t-shirts and sailor caps; cigars and fancy
              contact lens’ too
            </p>
          </div>
        </div>
        <div className="devider">
          <img src={Devider} alt="" width="100%" />
        </div>
        <div className="page page-even" id="Pigsville">
          <div className="flex-half-text">
            <p className="header font-32">In Pigsville - a place for pigs</p>
            <p className="normal">
              For those unfamiliar, Pigsville’s population is 10,000.
            </p>
            <p className="normal">
              The road into Pigsville is currently under construction. We’ll be
              able to access the town for visitation beginning December 1st,
              2021. Should you adopt a pig, you’re welcome to stay.
            </p>
            <p className="last">
              Otherwise visitation visas to the general public will be capped at
              30 days.
            </p>
          </div>
          <div className="flex-half-image">
            <img alt="Porky" src={ImagePage2} width="280px" />
          </div>
        </div>
        <div className="page" id="Rarity">
          <div className="flex-half-image">
            <img alt="Porky" src={ImagePage3} width="280px" />
          </div>
          <div className="flex-half-text">
            <p className="header">Rare piglets</p>
            <p className="normal">
              Little Pigs aren’t your average pork bois. If you own one, you own
              a piece of history. And that’s rare. That being said… some are
              more special & rare than others. But don’t tell them that. They’re
              all special in their own way! Except the ones that aren’t. Got it?
            </p>
            <p className="normal">
              Every pig is comprised of skin, body, face, head, and earring
              traits—with millions of possible unique combinations. Their traits
              are programmed in a way that makes them them common, uncommon,
              rare, or super rare. No two piggies are exactly alike.
            </p>
            <p className="normal">
              And just when you think you’ve got it figured out. BAM! We throw
              in some Special Edition Little Pigs™ — a drove of hogs that are
              all 1/1. These are the kings of the pen, sharing no traits with
              any of the other pigs.
            </p>
            <p className="last">
              The Little Pigs are swine with swag. Pigs with polish. Haute hogs.
              Do not sleep on the pigs, or we’ll blow your house down.
            </p>
          </div>
        </div>
        <div className="page" id="Team">
          <p className="title">Team Swill</p>
          <div id="Bio-Container">
            <div className="bio">
              <img alt="Team" src={ImageTeam1} />
              <p className="header">Chrispy</p>
              <p className="normal">
                -Product Development
                <br />
                -Venture Capitalist
                <br />
                -Self-proclaimed professional NFT collector
              </p>
            </div>
            <div className="bio">
              <img alt="Team" src={ImageTeam2} />
              <p className="header">Schlomo</p>
              <p className="normal">
                -Artist & Designer
                <br />
                -10+ years as art director + creative director working on some
                of the world’s top brands
                <br />
                -Likes the pigs
              </p>
            </div>
            <div className="bio">
              <img alt="Team" src={ImageTeam3} />
              <p className="header">Peak3d</p>
              <p className="normal">
                - Full Stack Dev
                <br />
                - 25+ years development experience
                <br />- Admires good artists
              </p>
            </div>
            <div className="bio">
              <img alt="Team" src={ImageTeam4} />
              <p className="header">DxVert</p>
              <p className="normal">
                - Startup advisor and incubator
                <br />
                - 25 years in DESIGN & development
                <br />- Crypto nut 5 years and still solvent
              </p>
            </div>
            <div className="bio">
              <img alt="Team" src={ImageTeam5} />
              <p className="header">BigPig</p>
              <p className="normal">
                - Public Relations
                <br />
                - E-commerce/retail arbitrage specialist
                <br />- !oink
              </p>
            </div>
          </div>
        </div>
        <div className="page" id="FAQ">
          <p className="title">Pork FAQs</p>
          <div className="faq-container">
            <span className="header">
              How many Littlepigs can live in Pigsville?
            </span>
            <p>
              The Three Little Pigs quickly gained notoriety from their best
              selling novel. They have many friends. 10,000 to be exact. ONLY
              10000 CAN BE ADOPTED AND MOVE INTO THE SPIRITUAL HOME OF PIGSVILLE
              with our presale December 1, 2021.
            </p>
            <span className="header">
              When can I get a pig and move into Pigsville?
            </span>
            <p>
              Presale for Littlepigs and their access to Pigsville is on the 1st
              december - check discord for whitelist announcements - Public sale
              date TBC.
            </p>
            <span className="header">
              Where can i talk with my fellow porkaneers?
            </span>
            <p>
              All of the pigs gather at the local pigsville townhall called
              Discord. Get an invite won'tya! - We have giveaways, whitelistings
              and general swill to partake in. Also Twitter - let yourselves be
              known and support the build of Pigsville into a thriving
              porkopolis!
            </p>
          </div>
          <div className="faq-container">
            <span className="header">Do pigs wear clothes?</span>
            <p>
              Pah! Of course these pigs do - Fresh off their book royalties they
              have cash and crypto to spare. The pigs have swag and you can
              purchase some little pigs once we get 25% of these babes a home in
              Pigsville.
            </p>
            <span className="header">What is the road to bacon?</span>
            <p>
              Dont be fraid - in this case bacon = cheese = cash. The little
              pigs are a store of value with a roadmap to match. They got
              tricks, and their tricks got tricks. We'll announce upcoming plans
              and partnerships as we get nearer to the sale date. Get thee to
              the townhall for latest updates.
            </p>
            <span className="header">Dont blow this!</span>
            <p>
              Blowing it is strictly frowned upon - in fact all pigs no longer
              have this in their vocab. They just know WAGMI and IGMI, and that
              big bad wolf is done for. In fact there's rumours he's on the "if
              you can't beat them join them" train. Stay tuned!!
            </p>
          </div>
        </div>
        <div className="page" id="Roadmap">
          <p className="title">Where the roads are paved in bacon...</p>
          <div className="roadmap-container">
            <span className="header">Pigsville opening</span>
            <p>
              Pigsville is large. On an island, with a population of 10,000, our
              city planners need to carefully deliberate the layout of our pig
              pen.
            </p>
            <p>
              Being pigs, we prefer dirt. Sure, we may have built a house from
              brick, but dirt roads allow us to make changes easier. The
              construction of this road is one that requires the help of all our
              piglets. It’s important to use the Town Hall channel in discord to
              cast your vote during city planning proposals.
            </p>
            <p>
              Pigsville pigs will be available for adoption on December 1, 2021,
              12:00pm PST. Please note that our adoption agency has pre-screened
              and whitelisted some families that we deemed fit for adopting.
              These families will be able to purchase our little ones on
              December 1, 2021, 11:00am PST.
            </p>
            <p>
              A gentle reminder that our roads are constructed of dirt; should
              all pigs find homes faster than expected, we may need to
              reconstruct and widen the road to fit all newcomers. This means
              that some proposals will be given a scheduled date as opposed to
              waiting to fill an adoption percentage.
            </p>
            <span className="header">Gas & Fees</span>
            <p>
              December 1, Pigsville opens to the public. You may fly here direct
              and adopt your pig. Should you choose the slower route, by boat,
              Opensea is where you’ll want to look to adopt.
            </p>
            <p>
              Adoptions on Opensea come with a 5% royalty. These royalties will
              be sent directly here{' '}
              <code>
                <a
                  href="https://etherscan.io/address/0x0C3590ee39e4F305C4227BBE9768679aFcC63203"
                  rel="noreferrer"
                  target="_blank"
                >
                  0x0C35....3203
                </a>
              </code>
              . Royalties will be used to fund our community DAO and $BACON
              rewards. More detailed information on the community DAO and
              $BACON, below.
            </p>
            <p>
              Ethereum is the gas you’ll need to get to Pigsville Island. Being
              travellers ourselves, we use gas on this island to make everyday
              purchases, like ham. Our mayor, BigPig, periodically gives away
              Ethereum to members in our community as a thanks. He already
              mentioned at the previous town meeting that ethereum giveaways
              will be based upon our piglets finding homes and will go as
              follows:
              <br />
              10% of pigs finding a home - 1 Eth giveaway
              <br />
              25% - 3 Eth giveaway
              <br />
              50% - 5 Eth giveaway
              <br />
              75% - 7 Eth giveaway
              <br />
              100% - 10 Eth giveaway
            </p>
          </div>
          <div className="roadmap-container">
            <span className="header">Bad wolves & little pigs</span>
            <p>
              Pigs have been at odds with wolves for our entire existence. The
              neighbouring island, Wolvesville, presented a truce between our
              lands and theirs. In exchange for $bacon, they’ve been blowing our
              windmills. Energy doesn’t get more renewable than that. These
              wolves have come as far to even seduce some of our pigs
              romantically. There may come a day where the Pigs of Pigsville and
              the Wolves of Wolvesville come together, in matrimony and in
              Metamask wallets. Holders of Pigs will be granted whitelist status
              for wolves. More specifics on this proposal will be announced in
              Q1, 2022. It’s important for us to vote on this before allowing
              wolves in the pen.
            </p>
            <span className="header">Threads for $BACON</span>
            <p>
              We pigs are civilized beings. underwear may not be something we
              wear off the island, when vacationing with humans, but here it’s
              required. Hats and shirts are just a few items we wear. These
              items will become available for purchase at Pigs & Fitch, found
              later on our site. Be aware that their shop is still under
              construction. They’ve advised us that completion will be sometime
              around Q2, 2022 or when demand for clothes becomes urgent (50%
              adoption rate of pigs). They accept Ethereum and $BACON as payment
              for clothing. More on $BACON, below.
            </p>
            <span className="header">To DAO or not to DAO ...</span>
            <p>
              Community is big here in Pigsville. We share everything, even the
              cores of our apples. Our community DAO will be equally owned by
              all pig holders. Should all pigs find adoption, then each pig
              represents .1% of the DAO.
            </p>
            <span className="header">Bring home the $BACON</span>
            <p>
              $BACON isn’t as bad as it sounds. We aren’t asking you to eat your
              own, I promise. As mentioned earlier, we use $BACON to barter with
              the wolves and run our economy - and make our island smell great.
              Earn $BACON by depositing your pig into slaughter school. Here
              your pig will sit comfortably and earn you that beautiful $BACON
              you can use to get around in Pigsville.
            </p>
          </div>
        </div>
        <div className="page" id="Page5">
          <img id="Main-Logo" alt="Little Pigs" src={Logo}></img>
          <div id="Page5-Buttons">
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
          </div>
          <span>COPYRIGHT ALL RIGHTS RESERVED LITTLEPIGS.IO 2021</span>
        </div>
      </>
    );
  }
}

export default App;
