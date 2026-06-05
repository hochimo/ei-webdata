import { Link, useParams } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import './Profile.css';
import useFetchProfile from './useFetchProfile';

function Profile() {
  const { id } = useParams();
  const { selectedUser } = useUser();
  const user = selectedUser && String(selectedUser.id) === id ? selectedUser : null;
  const { ratings, loading: ratingsLoading, error: ratingsError } = useFetchProfile(id);

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
          <div className="Profile-ratings">
            <h3>Films notés</h3>
            {ratingsLoading && <p>Chargement des notes...</p>}
            {ratingsError && <p className="error">Erreur lors du chargement des notes.</p>}
            {!ratingsLoading && ratings?.length === 0 && <p>Aucune note pour cet utilisateur.</p>}
            {ratings?.length > 0 && (
              <ul className="Profile-ratings-list">
                {ratings.map((r) => (
                  <li key={r.id} className="Profile-rating-item">
                    <Link to={`/movies/${r.movie.id}`}>{r.movie.title}</Link>
                    <span className="Profile-rating-value"> — {r.note}/5</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ) : (
        <p>Aucun utilisateur sélectionné ou profil introuvable.</p>
      )}
    </div>
  );
}

export default Profile;
