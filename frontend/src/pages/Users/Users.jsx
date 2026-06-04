import './Users.css';
import { useUser } from '../../context/UserContext';
import AddUserForm from '../../components/AddUserForm/AddUserForm';
import UsersTable from '../../components/UsersTable/UsersTable';
import UserSelector from '../../components/UserSelector/UserSelector';
import { useFetchUsers } from './useFetchUsers';

function Users() {
  const { selectedUser } = useUser();
  const { users, usersLoadingError, fetchUsers } = useFetchUsers(
    selectedUser?.id
  );

  return (
    <div className="Users-container">
      <h1>Utilisateurs</h1>
      <div className="Users-selector-wrapper">
        <UserSelector />
      </div>
      <AddUserForm onSuccessfulUserCreation={fetchUsers} />
      <UsersTable
        users={users}
        selectedUser={selectedUser}
        onSuccessfulUserDeletion={fetchUsers}
      />
      {usersLoadingError !== null && (
        <div className="users-loading-error">{usersLoadingError}</div>
      )}
    </div>
  );
}

export default Users;
