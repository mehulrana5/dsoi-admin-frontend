import { createContext, useState, useEffect, ReactNode, FC } from 'react';
import { useNavigate } from 'react-router-dom';
const BASE_URL = import.meta.env.VITE_BASE_URL || 'https://dsoi-backend.onrender.com/api';
const MIN_AMOUNT = import.meta.env.VITE_MIN_AMOUNT || 4000

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
    membersData: {
        status: number,
        data: {
            _id: string,
            userName: string,
            contact: number,
            email: string,
            wallet: number,
            photo: string,
            createdAt: string,
            pendingAmount: number
        }[],
        count: number
    };
    screenSize: number;
    ordersData: any[];
    getOrders: (type: string, query: string, id: string) => Promise<void>;
    createOrder: (member_id: string, price: number, wallet: number) => Promise<void>;
    updateOrder: (order_id: string, operation: string, query: { status: string }) => Promise<void>;
    getLogs: (type: string, query: string, skip: number, limit: number) => Promise<void>;
    logData: {
        status: number;
        data: {
            _id: string;
            initiatorId: string;
            targetId: string;
            targetModel: string;
            action: string;
            timeStamp: string;
        }[];
        count: number
    };
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
    const [screenSize, setScreenSize] = useState<number>(window.innerWidth);
    const [ordersData, setOrdersData] = useState<any[]>([]);

    const [membersData, setMembersData] = useState<{
        status: number,
        data: {
            _id: string,
            userName: string,
            contact: number,
            email: string,
            wallet: number,
            photo: string,
            createdAt: string,
            pendingAmount: number
        }[],
        count: number
    }>({ status: 0, data: [], count: 0 });

    const [logData, setLogData] = useState<{
        status: number,
        data: {
            _id: string,
            initiatorId: string,
            targetId: string,
            targetModel: string,
            action: string,
            timeStamp: string
        }[],
        count: number
    }>({ status: 0, data: [], count: 0 });

    const navigate = useNavigate();

    useEffect(() => {
        const handleResize = () => setScreenSize(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    console.log(`BASE URL ${BASE_URL}`);
    console.log(`MIN_AMOUNT ${MIN_AMOUNT}`);

    const getHeaders = () => {
        return {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem("token") || "Bearer null"
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

            if (res.status === 401) return logout();

            const data = await res.json();
            if (data.error) return alert(data.error.message);

            localStorage.setItem("id", data.admin.id);
            localStorage.setItem("userName", data.admin.userName);
            localStorage.setItem("token", `Bearer ${data.token}`);
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

            if (res.status === 401) return logout();

            const data = await res.json();
            if (data.error) return alert(data.error.message);

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

            if (res.status === 401) return logout();

            const data = await res.json();
            if (data.error) return alert(data.error.message);

            setMembersData(data);
            return data;
        } catch (error) {
            console.error('Get members error:', error);
            alert('Failed to fetch members. Please try again.');
        } finally {
            setLoading("");
        }
    };

    const getOrders = async (type: string, query: string, id: string) => {
        setLoading("getOrders");
        try {
            const res = await fetch(`${BASE_URL}/getOrders?orderId=${id}`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify({ type, query })
            });

            if (res.status === 401) return logout();

            const data = await res.json();
            if (data.error) return alert(data.error.message);
            setOrdersData(data);
        } catch (error) {
            console.error('Get orders error:', error);
            alert('Failed to fetch orders. Please try again.');
        } finally {
            setLoading("");
        }
    };

    const createOrder = async (member_id: string, price: number, wallet: number) => {
        setLoading("createOrder");

        if (wallet - price < MIN_AMOUNT) {
            return alert(`Cannot deduct: Wallet balance would fall below ${MIN_AMOUNT}`);
        }

        try {
            const res = await fetch(`${BASE_URL}/orders`, {
                method: "POST",
                headers: getHeaders(),
                body: JSON.stringify({ member_id, price })
            });

            if (res.status === 401) return logout();

            const data = await res.json();
            if (data.error) return alert(data.error.message);

            alert(data.message);
        } catch (error) {
            console.error("Create orders error:", error);
            alert("Failed to create orders. Please try again.");
        } finally {
            setLoading("");
        }
    };

    const updateOrder = async (order_id: string, operation: string, query: { status: string }) => {
        setLoading("createOrder");

        try {
            const res = await fetch(`${BASE_URL}/orders`, {
                method: "PUT",
                headers: getHeaders(),
                body: JSON.stringify({ orderId: order_id, operation, query })
            });

            if (res.status === 401) return logout();

            const data = await res.json();
            if (data.error) return alert(data.error.message);
            alert(data.message);
            navigate(-1)
        } catch (error) {
            console.error("Update orders error:", error);
            alert("Failed to update orders. Please try again.");
        } finally {
            setLoading("");
        }
    };

    const getLogs = async (type: string, query: string, skip: number, limit: number) => {
        try {
            console.log("running");

            const res = await fetch(`${BASE_URL}/getLogs`, {
                method: "POST",
                headers: getHeaders(),
                body: JSON.stringify({ type, query, skip, limit })
            });

            if (res.status === 401) return logout();

            const data = await res.json();
            if (data.error) return alert(data.error.message);

            setLogData(data.result)

        } catch (error) {
            console.log("get logs error:", error);
            alert("Failed to get Logs.");
        }
    }

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
            ordersData,
            getOrders,
            createOrder,
            updateOrder,
            getLogs,
            logData
        }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContextProvider;
