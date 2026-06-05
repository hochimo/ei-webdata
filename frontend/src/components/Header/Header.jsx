import { Link } from 'react-router-dom';
import './Header.css';
import logo from '../../pages/Home/logoC.png';

const Header = () => {
  return (
    <div className="Header-container">
      <img src={logo} className="App-logo" alt="logo" />
      <span className="Header-title">bledterboxd</span>
      <div className="Header-links">
        <Link className="Link" to="/">
          Accueil
        </Link>
        <div>|</div>
        {/* <Link className="Link" to="/counter">
          Counter
        </Link> 
        <div>|</div>*/}
        <Link className="Link" to="/users">
          Utilisateurs
        </Link>
        {/*<div>|</div>
        <Link className="Link" to="/about">
          About
        </Link>*/}
      </div>
    </div>
  );
};

export default Header;
