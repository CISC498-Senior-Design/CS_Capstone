import { useEffect, useState } from "react";
import { useUser, type User } from "../../user.tsx";


function AuthButton(){
    const {user, login} = useUser();
    const [loading, setLoading] = useState(false);

    function userAuth() {
        useEffect(() => {
            fetch("/api/me")
            .then((res) => (res.ok ? res.json() : null))
            .then((data: User | null) => login(data))
            .catch(() => login(null))
            .finally(() => setLoading(false));
        }, []);

        async function signOut() {
            await fetch("/auth/logout", { method: "POST" });
            login(null); //TODO update user.tsx UserContextType to have signout instead of using login
        }

        return signOut
    }
    const signOut = userAuth();


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