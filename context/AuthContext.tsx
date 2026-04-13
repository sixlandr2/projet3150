import { API } from '@/constants/api';
import * as Securestore from 'expo-secure-store';
import { createContext, useContext, useEffect, useState } from 'react';

type User = {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    role: string;
};
type AuthContextType = {
    user: User | null;
    token: string | null;
    login: (email: string, password: string) => Promise< {error?: string}>;
    logout: () => void;
    register: (first_name: string, last_name: string, email: string, password: string, role: string) => Promise< {error?: string}>;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({children}: {children: React.ReactNode}){
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const load = async()=>{
            const savedToken = await Securestore.getItemAsync('token');
            const savedUser = await Securestore.getItemAsync('user');
            if(savedToken && savedUser) {
                setToken(savedToken);
                setUser(JSON.parse(savedUser));
            }
        };
        load();
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const response = await fetch(`${API}/api/auth/login`,{
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({email, password}),
            });
            const data = await response.json();
            if (data.error) return {error: data.error};
            await Securestore.setItemAsync('token', data.token);
            await Securestore.setItemAsync('user', JSON.stringify(data.user));
            setToken(data.token);
            setUser(data.user);
            return{};
        } catch(err) {
            return {error: 'Erreur de connexion au serveur'};
        }
    };

    const logout = async() => {
        await Securestore.deleteItemAsync('token');
        await Securestore.deleteItemAsync('user');
        setToken(null);
        setUser(null);
    };

    const register = async (first_name: string, last_name: string, email: string, password: string, role: string) =>{
        try{
            const response = await fetch (`${API}/api/auth/signup`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({first_name,last_name,email,password,role}),
            });
            const data = await response.json();
            if(data.error) return {error: data.error};

            await Securestore.setItemAsync('token', data.token);
            await Securestore.setItemAsync('user', JSON.stringify(data.user));
            setToken(data.token);
            setUser(data.user);
            return{};
        } catch(err) {
            return {error: 'Erreur de connexion au serveur'};
        }
        
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);