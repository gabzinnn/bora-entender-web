"use client";
import { useRouter } from "next/navigation";
import { setCookie, parseCookies, destroyCookie } from "nookies";

import React, {
    createContext,
    useContext,
    useState,
    useCallback,
    useEffect,
    ReactNode,
} from "react";

interface AuthContextData {
    signIn: (token: string, user: Usuario) => void;
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
        const cookies = parseCookies();
        const token = cookies["@BoraEntender:token"];
        const user = cookies["@BoraEntender:user"];
        console.log("teste loadStoragedData - token:", token);
        console.log("teste loadStoragedData - user:", user);

        if (token && user) {
            setToken(token);
            try {
                setUser(JSON.parse(user));
            } catch (e) {
                console.error("Erro ao fazer parse do usuário do cookie", e);
            }
        }
    }, []);

    const [loading, setLoading] = useState(true);

    const signIn = useCallback(async (access_token: string, payload: Usuario) => {
        console.log("teste SignIn - armazenar token e user em cookies", access_token);

        setCookie(null, "@BoraEntender:token", access_token, {
            maxAge: 60 * 60 * 24 * 30, // 30 dias
            path: "/",
        });

        setCookie(null, "@BoraEntender:user", JSON.stringify(payload), {
            maxAge: 60 * 60 * 24 * 30, // 30 dias
            path: "/",
        });

        setToken(access_token);
        setUser(payload);
    }, []);

    useEffect(() => {
        loadStoragedData().finally(() => setLoading(false));
    }, [loadStoragedData]);

    const signOut = useCallback(async () => {
        destroyCookie(null, "@BoraEntender:token", { path: '/' });
        destroyCookie(null, "@BoraEntender:user", { path: '/' });

        setToken("");
        setUser({
            id: 0,
            email: "",
            role: "",
        });
        router.push("/login");
    }, [router]);

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