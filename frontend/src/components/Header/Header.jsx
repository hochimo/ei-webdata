import { Link } from 'react-router-dom';
import './Header.css';
import logo from '../../pages/Home/logoC.png';

const Header = () => {
  return (
    <div className="Header-container">
      <img src={logo} className="App-logo" alt="logo" /> 
      
      <div className="Header-links">
        <Link className="Link" to="/">
          Home
        </Link>
        <div>|</div>
        {/* <Link className="Link" to="/counter">
          Counter
        </Link> 
        <div>|</div>*/}
        <Link className="Link" to="/users">
          Users
        </Link>
        <div>|</div>
        <Link className="Link" to="/about">
          About
        </Link>
      </div>
    </div>
  );
};

export default Header;
