import { Link, useLocation } from 'react-router-dom';
import './Header.css';
import UserSelector from '../UserSelector/UserSelector';

const Header = () => {
  const location = useLocation();

  return (
    <div className="Header-container">
      <div className="Header-links">
        <Link className="Link" to="/">
          Home
        </Link>
        <div>|</div>
        <Link className="Link" to="/counter">
          Counter
        </Link>
        <div>|</div>
        <Link className="Link" to="/users">
          Users
        </Link>
        <div>|</div>
        <Link className="Link" to="/about">
          About
        </Link>
      </div>
      {location.pathname === '/users' && <UserSelector />}
    </div>
  );
};

export default Header;
