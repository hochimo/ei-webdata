import { useEffect, useState } from 'react';
import axios from 'axios';

export function useFetchUsers(followerId) {
  const [users, setUsers] = useState([]);
  const [usersLoadingError, setUsersLoadingError] = useState(null);

  const fetchUsers = () => {
    setUsersLoadingError(null);

    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/users`, {
        params: followerId ? { followerId } : {},
      })
      .then((response) => {
        setUsers(response.data.users || []);
      })
      .catch((error) => {
        setUsersLoadingError('An error occured while fetching users.');
        console.error(error);
      });
  };

  // fetch users on component mount and when the selected follower changes
  useEffect(() => {
    fetchUsers();
  }, [followerId]);

  return { users, usersLoadingError, fetchUsers };
}
