import { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from '../../context/UserContext';
import './UserSelector.css';

function UserSelector() {
  const [users, setUsers] = useState([]);
  const [loadingError, setLoadingError] = useState(null);
  const { selectedUser, setSelectedUser } = useUser();

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/users`)
      .then((response) => {
        setUsers(response.data.users || []);
      })
      .catch((error) => {
        console.error(error);
        setLoadingError('Impossible de charger la liste des utilisateurs.');
      });
  }, []);

  const handleChange = (event) => {
    const userId = event.target.value;

    if (!userId) {
      setSelectedUser(null);
      return;
    }

    const user = users.find((item) => String(item.id) === userId);
    setSelectedUser(user || null);
  };

  return (
    <div className="UserSelector-container">
      <label className="UserSelector-label" htmlFor="user-select">
        Utilisateur :
      </label>
      <select
        id="user-select"
        value={selectedUser?.id ?? ''}
        onChange={handleChange}
      >
        <option value="">Choisir un utilisateur</option>
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.firstname} {user.lastname} ({user.email})
          </option>
        ))}
      </select>
      {loadingError && <div className="UserSelector-error">{loadingError}</div>}
    </div>
  );
}

export default UserSelector;
