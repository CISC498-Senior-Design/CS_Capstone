import { createContext, useContext, useState, type ReactNode } from "react";

export type User = { name: string; email: string; picture?: string };
type UserContextType = {
  user: User | null;
  login: (user: User | null) => void;
};

export const UserContext = createContext<UserContextType | undefined>(undefined);

// Custom hook: cleaner to use, and gives a non-undefined type
export function useUser(): UserContextType {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useAuth must be used inside <UserProvider>");
  return ctx;
}


function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const login = (user: User | null) => setUser(user);


  return (
    <UserContext.Provider value={{ user, login }}>
      {children}
    </UserContext.Provider>
  );
}
export default UserProvider;