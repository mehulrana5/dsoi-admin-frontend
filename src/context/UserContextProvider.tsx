import { createContext, useState, useEffect, ReactNode, FC } from 'react';
import { useNavigate } from 'react-router-dom';
const BASE_URL = import.meta.env.VITE_BASE_URL || 'https://dsoi-backend.onrender.com/api';

// Define the context type
interface UserContextType {
    loading: string;
    login: (credentials: { username: string; password: string }) => Promise<void>;
    logout: () => void;
    getAdmins: (type: string, query: string) => Promise<void>;
    adminsData: any[];
    BASE_URL: String;
    fontSize: string;
    setFontSize: (size: string) => void;
    getMembers: (type: string, query: string, skip: number, limit: number) => Promise<void>;
    membersData: any[];
    screenSize: number;
    totalMembers: number;
    ordersData: any[];
    getOrders: (type: string, query: string) => Promise<void>;
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
    const [adminsData, setAdminsData] = useState<any[]>([]);
    const [fontSize, setFontSize] = useState<string>("sm");
    const [membersData, setMembersData] = useState<any[]>([]);
    const [screenSize, setScreenSize] = useState<number>(window.innerWidth);
    const [totalMembers, setTotalMembers] = useState<number>(0);
    const [ordersData, setOrdersData] = useState<any[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const handleResize = () => setScreenSize(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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
            navigate('/home');
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

    const getAdmins = async (type: string, query: string) => {
        setLoading("getAdmins");
        try {
            const res = await fetch(`${BASE_URL}/getAdmins`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify({ type, query })
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
            setAdminsData(data);
        } catch (error) {
            console.error('Get admins error:', error);
            alert('Failed to fetch admins. Please try again.');
        } finally {
            setLoading("");
        }
    };

    const getMembers = async (type: string, query: string, skip: number, limit: number) => {
        setLoading("getMembers");
        try {
            const res = await fetch(`${BASE_URL}/getMembers`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify({ type, query, skip, limit })
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
            setMembersData(data.data);
            setTotalMembers(data.count);
            return data;
        } catch (error) {
            console.error('Get members error:', error);
            alert('Failed to fetch members. Please try again.');
        } finally {
            setLoading("");
        }
    };

    const getOrders = async (type: string, query: string) => {
        setLoading("getOrders");
        try {
            const res = await fetch(`${BASE_URL}/getOrders`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify({ type, query })
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
            setOrdersData(data.data);
        } catch (error) {
            console.error('Get orders error:', error);
            alert('Failed to fetch orders. Please try again.');
        } finally {
            setLoading("");
        }
    };

    return (
        <UserContext.Provider value={{
            loading,
            login,
            logout,
            getAdmins,
            adminsData,
            BASE_URL,
            fontSize,
            setFontSize,
            getMembers,
            membersData,
            screenSize,
            totalMembers,
            ordersData,
            getOrders,
        }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContextProvider;
