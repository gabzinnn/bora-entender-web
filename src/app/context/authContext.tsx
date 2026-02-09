"use client";
import { useRouter } from "next/navigation";

import React, {
    createContext,
    useContext,
    useState,
    useCallback,
    useEffect,
    ReactNode,
} from "react";

interface AuthContextData {
    signIn: (token:string, user: Usuario) => void;
    signOut: () => void;
    token: string;
    user: Usuario;
    loading: boolean;
}

interface Usuario {
    email: string;
    id: number;
    role: string | string[];
}  


const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export default function AuthContextProvider({ children }: { readonly children: ReactNode }) {
    const [token, setToken] = useState("");
    const [user, setUser] = useState<Usuario>({
        id: 0,
        email: "",
        role: "",
    });

    const router = useRouter();

    const loadStoragedData = useCallback(async () => {

        const token = await localStorage.getItem("@BoraEntender:token")
        const user = await localStorage.getItem("@BoraEntender:user")

        if (token && user) {
            setToken(token);
            setUser(JSON.parse(user));
        }
    }, []);

    const [loading, setLoading] = useState(true);

    const signIn = useCallback(async (access_token: string, payload: Usuario) => { //armazena o token e user no localStorage e no useState
        console.log("teste SignIn - armazenar token");
        localStorage.setItem("@BoraEntender:token", access_token);
        console.log("Token armazenado no storage");

        setToken(access_token);

        console.log("teste armazenar info usuário");
        localStorage.setItem("@BoraEntender:user", JSON.stringify(payload));
        console.log("Usuário armazenado no storage");

        setUser(payload);
    }, []);

    useEffect(() => {
        loadStoragedData().finally(() => setLoading(false));
    }, []);

    const signOut = useCallback(async () => { //remove token e user do localStorage e remove token do useState
        await localStorage.removeItem("@BoraEntender:token");
        localStorage.removeItem("@BoraEntender:user");
        setToken("");
        setUser({
            id: 0,
            email: "",
            role: "",
        });
        router.push("/login");
    }, []);

    useEffect(() => {
        loadStoragedData();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                signIn,
                signOut,          
                token,
                user,
                loading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}