//Navbar.js
import React, { useEffect, useRef } from 'react';
import './navbar.css';

import Logo from '../../assets/littlepigs_logo.svg';
import Twitter from '../../assets/twitter.svg';
import Discord from '../../assets/discord.svg';
import Hamburger from '../../assets/hamburger.svg';

const Navbar = () => {
  const [scrolled, setScrolled] = React.useState(false);
  const navRef = useRef();

  const handleScroll = () => {
    const offset = window.scrollY;
    if (offset > 0) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
    if (navRef.current) navRef.current.classList.remove('navigation-mobile');
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
  });

  let navbarClasses = ['navbar'];
  if (scrolled) {
    navbarClasses.push('scrolled');
  }

  const hamburgerClicked = () => {
    if (navRef.current) {
      navRef.current.classList.toggle('navigation-mobile');
    }
  };

  return (
    <header className={navbarClasses.join(' ')}>
      <div className="logo">
        <a href="#Home">
          <img alt="Little Pigs" src={Logo}></img>
        </a>
      </div>
      <nav className="navigation" ref={navRef}>
        <ul>
          <li className="only-mobile">
            <a href="#Home">Home</a>
          </li>
          <li>
            <a href="#About">Once upon a time</a>
          </li>
          <li>
            <a href="#Pigsville">Pigsville</a>
          </li>
          <li>
            <a href="#Rarity">Rarities</a>
          </li>
          <li>
            <a href="#Team">Team</a>
          </li>
          <li>
            <a href="#FAQ">FAQ</a>
          </li>
        </ul>
      </nav>
      <div>
        <a
          target="_blank"
          rel="noreferrer"
          href="https://twitter.com/LittlePigsNFT"
        >
          <img className="nav-icon" alt="Twitter" src={Twitter} />
        </a>
        <a target="_blank" rel="noreferrer" href="http://discord.gg/3bMSc9gwHQ">
          <img className="nav-icon" alt="Discord" src={Discord} />
        </a>
      </div>
      <img
        className="nav-hamburger"
        src={Hamburger}
        alt=""
        onClick={hamburgerClicked}
      />
    </header>
  );
};
export default Navbar;
