import { createContext, useContext, useState } from 'react';

const UserContext = createContext({
  selectedUser: null,
  setSelectedUser: () => {},
});

export function UserProvider({ children }) {
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <UserContext.Provider value={{ selectedUser, setSelectedUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
