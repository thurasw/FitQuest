import { createContext, useContext, useEffect, useMemo, useState } from "react";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";

interface AuthContextProps {
    isInitializing: boolean;
    isAuthenticated: boolean;
    user?: FirebaseAuthTypes.User;
    signUp: (email: string, pw: string) => Promise<FirebaseAuthTypes.UserCredential>;
    signIn: (email: string, pw: string) => Promise<FirebaseAuthTypes.UserCredential>;
    signOut: () => Promise<void>;
}
const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function useAuth() {
    const auth = useContext(AuthContext);
    if (!auth) {
        throw new Error("AuthContext used outside of provider!");
    }
    return auth;
}

export function AuthProvider({ children } : { children: React.ReactNode }) {

    const [ isInitializing, setIsInitializing ] = useState(true);
    const [ user, setUser ] = useState<FirebaseAuthTypes.User>();
    
    const isAuthenticated = useMemo(() => user !== undefined, [user]);

    useEffect(() => {
        /** Subscribe to changes to user */
        const unsub = auth().onAuthStateChanged((user) => {
            setUser(user || undefined);
            setIsInitializing(false);
        });

        /** Unsubscribe on dismount */
        return () => unsub();
    }, []);

    /** Auth functions */
    const signUp = async(email: string, pw: string) => {
        return await auth().createUserWithEmailAndPassword(email, pw);
    }
    const signIn = async(email: string, pw: string) => {
        return await auth().signInWithEmailAndPassword(email, pw);
    }
    const signOut = async() => {
        await auth().signOut();
    }

    return (
        <AuthContext.Provider value={{
            isInitializing,
            isAuthenticated,
            user,
            signIn,
            signOut,
            signUp
        }}>
            { children }
        </AuthContext.Provider>
    )
}