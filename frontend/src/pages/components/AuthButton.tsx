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
    const { user, loading, signOut } = useAuth();

    if (loading) return null;

    if (!user) {
        return <a href="/auth/google">Sign in with Google</a>;
    }

    return (
        <div className="account">
        {user.picture && (
            <img src={user.picture} alt="" width={32} height={32} referrerPolicy="no-referrer" />)}
        <span>{user.name}</span>
        <button onClick={signOut}>Sign out</button>
        </div>
    );
}
export default AuthButton;