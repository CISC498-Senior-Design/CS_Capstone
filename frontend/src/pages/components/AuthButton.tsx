import { useEffect, useState } from "react";

//TODO: put all new types into a single file
type User = { name: string; email: string; picture?: string };

function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data: User | null) => setUser(data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  async function signOut() {
    await fetch("/auth/logout", { method: "POST" });
    setUser(null);
  }

  return { user, loading, signOut };
}

function AuthButton(){
    return <>
    </>
}
export default AuthButton;