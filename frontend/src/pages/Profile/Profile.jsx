import { Link, useParams } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import './Profile.css';

function Profile() {
  const { id } = useParams();
  const { selectedUser } = useUser();
  const user = selectedUser && String(selectedUser.id) === id ? selectedUser : null;

  return (
    <div className="Profile-container">
      <Link to="/users" className="user-retour">
              ← Retour au choix des utilisateurs
      </Link>
      <h1>Profil utilisateur</h1>
      {user ? (
        <div className="Profile-card">
          <p>
            <strong>Prénom :</strong> {user.firstname}
          </p>
          <p>
            <strong>Nom :</strong> {user.lastname}
          </p>
        </div>
      ) : (
        <p>Aucun utilisateur sélectionné ou profil introuvable.</p>
      )}
    </div>
  );
}

export default Profile;
