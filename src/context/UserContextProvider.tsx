import { createContext, useState, ReactNode, FC } from 'react';
import { useNavigate } from 'react-router-dom';
const BASE_URL = import.meta.env.VITE_BASE_URL || 'https://dsoi-backend.onrender.com/api';

// Define the context type
interface UserContextType {
    loading: string;
    login: (credentials: { username: string; password: string }) => Promise<void>;
    logout: () => void;
    BASE_URL: String;
}

// Create the UserContext
export const UserContext = createContext<UserContextType | undefined>(undefined);

// Define props for UserContextProvider
interface UserContextProviderProps {
    children: ReactNode;
}

// UserContextProvider component
const UserContextProvider: FC<UserContextProviderProps> = ({ children }) => {
    const [loading, setLoading] = useState<string>("");
    const navigate = useNavigate();

    console.log(`BASE URL ${BASE_URL}`);

    const getHeaders = () => {
        return {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem("token") || ""
        };
    };

    const login = async (credentials: { username: string; password: string }) => {
        setLoading("login");

        try {
            const res = await fetch(`${BASE_URL}/login`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify({ userName: credentials.username, password: credentials.password })
            });
            if (res.status === 401) {
                logout();
                return;
            }
            const data = await res.json();
            if (data.error) {
                alert(data.error.message);
                return;
            }
            localStorage.setItem("id", data.admin.id);
            localStorage.setItem("userName", data.admin.userName);
            localStorage.setItem("token", `Berear ${data.token}`);
            localStorage.setItem("userType", data.admin.type);
            navigate('/admins');
        } catch (error) {
            console.error('Login error:', error);
            alert('Login failed. Please try again.');
        } finally {
            setLoading("");
        }
    };

    const logout = () => {
        localStorage.removeItem("id");
        localStorage.removeItem("userName");
        localStorage.removeItem("token");
        localStorage.removeItem("userType");
        navigate('/');
    };

    return (
        <UserContext.Provider value={{
            loading,
            login,
            logout,
            BASE_URL
        }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContextProvider;
