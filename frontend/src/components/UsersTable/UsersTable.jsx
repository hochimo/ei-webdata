import axios from 'axios';
import './UsersTable.css';

function UsersTable({ users, selectedUser, onSuccessfulUserDeletion }) {
  const deleteUser = (userId) => {
    axios
      .delete(`${import.meta.env.VITE_BACKEND_URL}/users/${userId}`)
      .then(() => onSuccessfulUserDeletion());
  };

  const toggleFollow = (userId, isFollowed) => {
    if (!selectedUser) {
      return;
    }

    const config = {
      headers: { 'Content-Type': 'application/json' },
      data: { followerId: selectedUser.id },
    };

    if (isFollowed) {
      axios
        .delete(
          `${import.meta.env.VITE_BACKEND_URL}/users/${userId}/follow`,
          config,
        )
        .then(() => onSuccessfulUserDeletion());
    } else {
      axios
        .post(
          `${import.meta.env.VITE_BACKEND_URL}/users/${userId}/follow`,
          { followerId: selectedUser.id },
        )
        .then(() => onSuccessfulUserDeletion());
    }
  };

  return (
    <div>
      <table className="users-table">
        <thead>
          <tr>
            <th>Email</th>
            <th>Prénom</th>
            <th>Nom</th>
            <th>Suivre</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.email}>
              <td>{user.email}</td>
              <td>{user.firstname}</td>
              <td>{user.lastname}</td>
              <td>
                {selectedUser && user.id !== selectedUser.id ? (
                  <button
                    className={
                      user.isFollowed ? 'unfollow-button' : 'follow-button'
                    }
                    onClick={() => toggleFollow(user.id, user.isFollowed)}
                  >
                    {user.isFollowed ? 'Ne plus suivre' : 'Suivre'}
                  </button>
                ) : (
                  <span className="follow-placeholder">—</span>
                )}
              </td>
              <td>
                <button onClick={() => deleteUser(user.id)}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UsersTable;
