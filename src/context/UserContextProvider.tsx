import { createContext, useState, useEffect, ReactNode, FC } from 'react';
import { useNavigate } from 'react-router-dom';
const BASE_URL = import.meta.env.VITE_BASE_URL || 'https://dsoi-backend.onrender.com/api';
const MIN_AMOUNT = import.meta.env.VITE_MIN_AMOUNT || 4000

// Define the context type
interface UserContextType {
    login: (credentials: { username: string; password: string }) => Promise<void>;
    logout: () => void;
    setFontSize: (size: string) => void;
    getLogs: (type: string, query: string, skip: number, limit: number) => Promise<void>;

    getOrders: (type: string, query: string, skip: number, limit: number) => Promise<void>;
    createOrder: (member_id: string, item_id: string, wallet: number, price: number) => Promise<void>;
    updateOrder: (order_id: string, operation: string, query: { status: string }) => Promise<void>;

    getItems: (type: string, query: string, skip: number, limit: number) => Promise<void>;
    addItem: (name: string, brand: string, type: string, qty: string, price: string) => Promise<string>;
    updateItem: (id: string, updates: { name?: string; brand?: string; type?: string; qty?: number; price?: number }) => Promise<string>;
    deleteItem: (id: string) => Promise<void>;

    getAdmins: (type: string, query: string, skip: number, limit: number) => Promise<any>;
    addAdmin: (type: string, userName: string, password: string) => Promise<any>;
    updateAdmin: (id: string, type: string, userName: string, password: string) => Promise<string>;
    deleteAdmin: (id: string) => Promise<any>;

    getMembers: (type: string, query: string, skip: number, limit: number) => Promise<any>;
    addMember: (userName: string, password: string, contact: string, email: string, wallet: number, photo: File | null) => Promise<string>;
    updateMember: (id: string, photo: File | null, action: string, updates: {
        userName?: string;
        contact?: string;
        email?: string;
        password?: string;
    }) => Promise<string>;
    deleteMember: (id: string) => Promise<void>;
    activateMember: (contact: string) => Promise<void>;
    getSuspendedMembers: (type: string, query: string, skip: number, limit: number) => Promise<{
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
    }>
    deActivateMember: (contact: string) => Promise<void>;

    getFamily: (type: string, query: string, skip: number, limit: number) => Promise<any>;
    addFamily: (member_id: string, type: string, name: string, dob: string, photo: File | null) => Promise<string>;
    updateFamily: (id: string, type: string, name: string, dob: string, photo: File | null) => Promise<string>;
    deleteFamily: (id: string) => Promise<void>;

    loading: string;
    BASE_URL: String;
    fontSize: string;
    screenSize: number;
    MIN_AMOUNT: number;
    adminsData: {
        status: number,
        data: {
            _id: string,
            userName: string,
            type: string,
            createdAt: string
        }[],
        count: number
    };
    setAdminsData: React.Dispatch<React.SetStateAction<{
        status: number;
        data: {
            _id: string;
            userName: string;
            type: string;
            createdAt: string;
        }[];
        count: number;
    }>>;
    ordersData: {
        status: number,
        data: {
            _id: string,
            member_id: string,
            item_id: string,
            itemInfo: string,
            status: string,
            orderDate: string
        }[],
        count: number
    };
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
    itemsData: {
        status: number,
        data: {
            _id: string,
            name: string,
            brand: string,
            type: string,
            qty: number,
            price: number
        }[],
        count: number
    };
    susData: {
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
    familyData: {
        status: number,
        data: {
            _id: string,
            member_id: string,
            type: string,
            name: string,
            dob: string,
            photo: string,
            memberInfo: string
        }[],
        count: number
    };
}

// Create the UserContext
export const UserContext = createContext<UserContextType | undefined>(undefined);

// Define props for UserContextProvider
interface UserContextProviderProps { children: ReactNode; }

// UserContextProvider component
const UserContextProvider: FC<UserContextProviderProps> = ({ children }) => {
    const [loading, setLoading] = useState<string>("");
    const [fontSize, setFontSize] = useState<string>("sm");
    const [screenSize, setScreenSize] = useState<number>(window.innerWidth);

    const [adminsData, setAdminsData] = useState<{
        status: number,
        data: {
            _id: string,
            userName: string,
            type: string,
            createdAt: string
        }[],
        count: number
    }>({ status: 0, data: [], count: 0 });

    const [ordersData, setOrdersData] = useState<{
        status: number,
        data: {
            _id: string,
            member_id: string,
            item_id: string,
            itemInfo: string,
            status: string,
            orderDate: string
        }[],
        count: number
    }>({ status: 0, data: [], count: 0 });

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

    const [itemsData, setItemsData] = useState<{
        status: number,
        data: {
            _id: string,
            name: string,
            brand: string,
            type: string,
            qty: number,
            price: number
        }[],
        count: number,
        message: string
    }>({ status: 0, data: [], count: 0, message: "" });

    const [susData, setSusData] = useState<{
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

    const [familyData, setFamilyData] = useState<{
        status: number,
        data: {
            _id: string,
            member_id: string,
            type: string,
            name: string,
            dob: string,
            photo: string,
            memberInfo: string
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

    const getOrders = async (type: string, query: string, skip: number, limit: number) => {
        setLoading("getOrders");
        try {
            const res = await fetch(`${BASE_URL}/getOrders`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify({ type, query, skip, limit })
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

    const createOrder = async (member_id: string, item_id: string, wallet: number, price: number) => {
        setLoading("createOrder");

        if (wallet - price < MIN_AMOUNT) {
            return alert(`Cannot deduct: Wallet balance would fall below ${MIN_AMOUNT}`);
        }

        try {
            const res = await fetch(`${BASE_URL}/orders`, {
                method: "POST",
                headers: getHeaders(),
                body: JSON.stringify({ member_id, item_id })
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

            const res = await fetch(`${BASE_URL}/getLogs`, {
                method: "POST",
                headers: getHeaders(),
                body: JSON.stringify({ type, query, skip, limit })
            });

            if (res.status === 401) return logout();

            const data = await res.json();
            if (data.error) return alert(data.error.message);

            setLogData(data)

        } catch (error) {
            console.error("get logs error:", error);
            alert("Failed to get Logs.");
        }
    }

    const getItems = async (type: string, query: string, skip: number, limit: number) => {
        setLoading("getItems");
        try {
            const res = await fetch(`${BASE_URL}/getItems`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify({ type, query, skip, limit })
            });

            if (res.status === 401) return logout();

            const data = await res.json();
            if (data.error) return alert(data.error.message);

            setItemsData(data);
            return data;
        } catch (error) {
            console.error('Get items error:', error);
            alert('Failed to fetch items. Please try again.');
        } finally {
            setLoading("");
        }
    };

    const addItem = async (name: string, brand: string, type: string, qty: string, price: string) => {
        setLoading("addItem");
        try {
            const res = await fetch(`${BASE_URL}/item`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify({ name, brand, type, qty, price })
            });

            if (res.status === 401) return logout();
            const data = await res.json();
            if (data.error) return alert(data.error.message);
            return data.message;
        } catch (error) {
            console.error('Add Item error:', error);
            alert('Failed to Add Item. Please try again.');
        } finally {
            setLoading("");
        }
    };

    const updateItem = async (id: string, updates: { name?: string; brand?: string; type?: string; qty?: number; price?: number }) => {
        setLoading("updateItem");
        try {
            const res = await fetch(`${BASE_URL}/item?id=${id}`, {
                method: 'PUT',
                headers: getHeaders(),
                body: JSON.stringify(updates)
            });

            if (res.status === 401) return logout();
            const data = await res.json();
            if (data.error) return alert(data.error.message);
            return data.message;
        } catch (error) {
            console.error('Update Item error:', error);
            alert('Failed to Update Item. Please try again.');
        } finally {
            setLoading("");
        }
    };

    const deleteItem = async (id: string) => {
        setLoading("deleteItem");
        try {
            const res = await fetch(`${BASE_URL}/item?id=${id}`, {
                method: 'DELETE',
                headers: getHeaders(),
            });

            if (res.status === 401) return logout();
            const data = await res.json();
            if (data.error) return alert(data.error.message);
            alert(data.message);
        } catch (error) {
            console.error('Delete Item error:', error);
            alert('Failed to Delete Item. Please try again.');
        } finally {
            setLoading("");
        }
    };

    const getAdmins = async (type: string, query: string, skip: number, limit: number) => {
        setLoading("getAdmins");
        try {
            const res = await fetch(`${BASE_URL}/getAdmins`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify({ type, query, skip, limit })
            });

            if (res.status === 401) return logout();

            const data = await res.json();
            if (data.error) return alert(data.error.message);

            setAdminsData(data);
            return data
        } catch (error) {
            console.error('Get admins error:', error);
            alert('Failed to fetch admins. Please try again.');
        } finally {
            setLoading("");
        }
    };

    const addAdmin = async (userName: string, type: string, password: string) => {
        setLoading("addAdmin");
        try {
            const res = await fetch(`${BASE_URL}/admins`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify({ type, userName, password })
            });

            if (res.status === 401) return logout();
            const data = await res.json();
            if (data.error) return alert(data.error.message);
            return data;
        } catch (error) {
            console.error('Add Admin error:', error);
            alert('Failed to Add Admin. Please try again.');
        } finally {
            setLoading("");
        }
    };

    const updateAdmin = async (id: string, type: string, userName: string, password: string) => {
        setLoading("updateAdmin");
        try {
            let body: { userName?: string; type?: string; password?: string } = {}
            if (type.length) {
                body['type'] = type
            }
            if (userName.length) {
                body['userName'] = userName
            }
            if (password.length) {
                body['password'] = password
            }
            const res = await fetch(`${BASE_URL}/admins/${id}`, {
                method: 'PUT',
                headers: getHeaders(),
                body: JSON.stringify(body)
            });

            if (res.status === 401) return logout();
            const data = await res.json();
            if (data.error) return alert(data.error.message);
            return data.message;
        } catch (error) {
            console.error('Update Admin error:', error);
            alert('Failed to Update Admin. Please try again.');
        } finally {
            setLoading("");
        }
    };

    const deleteAdmin = async (id: string) => {
        setLoading("deleteAdmin");
        try {
            const res = await fetch(`${BASE_URL}/admins/${id}`, {
                method: 'DELETE',
                headers: getHeaders(),
            });

            if (res.status === 401) return logout();
            const data = await res.json();
            if (data.error) return alert(data.error.message);
            return data
        } catch (error) {
            console.error('Delete Admin error:', error);
            alert('Failed to Delete Admin. Please try again.');
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
            alert('Failed to Get members. Please try again.');
        } finally {
            setLoading("");
        }
    };

    const addMember = async (userName: string, password: string, contact: string, email: string, wallet: number, photo: File | null) => {
        setLoading("addMember");
        try {
            const formData = new FormData();
            formData.append("userName", userName);
            formData.append("password", password);
            formData.append("contact", contact);
            formData.append("email", email);
            formData.append("wallet", wallet.toString());

            if (photo) {
                if (photo.size < 102400 || photo.size > 307200) {
                    alert("Image size must be between 100KB and 300KB.");
                    return;
                }
                formData.append("photo", photo);
            }

            const headers = { Authorization: localStorage.getItem("token") || "Bearer null" };

            const res = await fetch(`${BASE_URL}/members`, {
                method: 'POST',
                headers: headers,
                body: formData
            });

            if (res.status === 401) return logout();
            const data = await res.json();
            if (data.error) return alert(data.error.message);
            return data.message;
        } catch (error) {
            console.error("Add Member error:", error);
            alert("Failed to Add Member. Please try again.");
        } finally {
            setLoading("");
        }
    };

    const updateMember = async (id: string, photo: File | null, action: string, updates: {
        userName?: string;
        contact?: string;
        email?: string;
        password?: string;
    }) => {
        setLoading("updateMember");
        try {
            const formData = new FormData();
            formData.append('id', id);
            if (photo) formData.append('photo', photo);
            if (action) formData.append('action', action);
            if (!updates.password?.length) delete updates.password

            formData.append('updates', JSON.stringify(updates));

            const headers = { 'Authorization': localStorage.getItem("token") || "Bearer null" };

            const res = await fetch(`${BASE_URL}/members`, {
                method: 'PUT',
                headers: headers,
                body: formData
            });

            if (res.status === 401) return logout();
            const data = await res.json();
            if (data.error) return alert(data.error.message);
            return data.message;
        } catch (error) {
            console.error('Add Member error:', error);
            alert('Failed to Add Member. Please try again.');
        } finally {
            setLoading("");
        }
    };

    const deleteMember = async (id: string) => {
        setLoading("deleteMember");
        try {
            const res = await fetch(`${BASE_URL}/members/${id}`, {
                method: 'DELETE',
                headers: getHeaders(),
            });

            if (res.status === 401) return logout();
            const data = await res.json();
            if (data.error) return alert(data.error.message);
            alert(data.message);
            return
        } catch (error) {
            console.error('Delete Member error:', error);
            alert('Failed to Delete Member. Please try again.');
        } finally {
            setLoading("");
        }
    };

    const activateMember = async (contact: string) => {
        setLoading("activateMember");
        try {
            const res = await fetch(`${BASE_URL}/suspension`, {
                method: 'DELETE',
                headers: getHeaders(),
                body: JSON.stringify({ contact })
            });

            if (res.status === 401) return logout();
            const data = await res.json();
            if (data.error) return alert(data.error.message);
            alert(data.message);
            return
        } catch (error) {
            console.error('Activate Member error:', error);
            alert('Failed to Activate Member. Please try again.');
        } finally {
            setLoading("");
        }
    };

    const getSuspendedMembers = async (type: string, query: string, skip: number, limit: number) => {
        setLoading("getSuspendedMembers");
        try {
            const res = await fetch(`${BASE_URL}/getSuspendedMembers`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify({ type, query, skip, limit })
            });

            if (res.status === 401) return logout();
            const data = await res.json();
            if (data.error) return alert(data.error.message);
            setSusData(data)
            return data;
        } catch (error) {
            console.error('Get Suspended Members error:', error);
            alert('Failed to Get Suspended Members. Please try again.');
        } finally {
            setLoading("");
        }
    };

    const deActivateMember = async (contact: string) => {
        setLoading("deActivateMember");
        try {
            const res = await fetch(`${BASE_URL}/suspension`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify({ contact })
            });

            if (res.status === 401) return logout();
            const data = await res.json();
            if (data.error) return alert(data.error.message);
            alert(data.message);
            return
        } catch (error) {
            console.error('Deactivate Member error:', error);
            alert('Failed to Deactivate Member. Please try again.');
        } finally {
            setLoading("");
        }
    };

    const getFamily = async (type: string, query: string, skip: number, limit: number) => {
        setLoading("getFamily");
        try {
            const res = await fetch(`${BASE_URL}/getFamilies`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify({ type, query, skip, limit })
            });

            if (res.status === 401) return logout();
            const data = await res.json();
            if (data.error) return alert(data.error.message);
            setFamilyData(data)
            return data;
        } catch (error) {
            console.error('Get Family Data error:', error);
            alert('Failed to Get Family Data. Please try again.');
        } finally {
            setLoading("");
        }
    };

    const addFamily = async (member_id: string, type: string, name: string, dob: string, photo: File | null) => {
        setLoading("addFamily");
        try {
            const formData = new FormData();
            formData.append("member_id", member_id);
            formData.append("type", type);
            formData.append("name", name);
            formData.append("dob", dob);
            if (photo) {
                if (photo.size < 102400 || photo.size > 307200) {
                    alert("Image size must be between 100KB and 300KB.");
                    return;
                }
                formData.append("photo", photo);
            }
            const headers = { Authorization: localStorage.getItem("token") || "Bearer null" };
            const res = await fetch(`${BASE_URL}/families`, {
                method: 'POST',
                headers: headers,
                body: formData
            });
            if (res.status === 401) return logout();
            const data = await res.json();
            if (data.error) return alert(data.error.message);
            return data.message;
        } catch (error) {
            console.error("Add Family Member error:", error);
            alert("Failed to Add Family Member. Please try again.");
        } finally {
            setLoading("");
        }
    };

    const updateFamily = async (id: string, type: string, name: string, dob: string, photo: File | null) => {
        setLoading("updateFamily");
        try {
            const formData = new FormData();
            formData.append('id', id);
            if (type) formData.append('type', type);
            if (name) formData.append('name', name);
            if (dob) formData.append('dob', dob);
            if (photo) {
                if (photo.size < 102400 || photo.size > 307200) {
                    alert("Image size must be between 100KB and 300KB.");
                    return;
                }
                formData.append("photoFile", photo);
            }
            const headers = { 'Authorization': localStorage.getItem("token") || "Bearer null" };
            const res = await fetch(`${BASE_URL}/families`, {
                method: 'PUT',
                headers: headers,
                body: formData
            });
            if (res.status === 401) return logout();
            const data = await res.json();
            if (data.error) return alert(data.error.message);
            return data.message;
        } catch (error) {
            console.error('Update Family error:', error);
            alert('Failed to Update Family. Please try again.');
        } finally {
            setLoading("");
        }
    }

    const deleteFamily = async (id: string) => {
        setLoading("deleteFamily");
        try {
            const res = await fetch(`${BASE_URL}/families/${id}`, {
                method: 'DELETE',
                headers: getHeaders(),
            });

            if (res.status === 401) return logout();
            const data = await res.json();
            if (data.error) return alert(data.error.message);
            alert(data.message);
        } catch (error) {
            console.error('Delete Member error:', error);
            alert('Failed to Delete Member. Please try again.');
        } finally {
            setLoading("");
        }
    };



    return (
        <UserContext.Provider value={{
            login,
            logout,
            setFontSize,
            getMembers,
            getOrders,
            createOrder,
            updateOrder,
            getLogs,
            getItems,
            addItem,
            updateItem,
            deleteItem,
            getAdmins,
            addAdmin,
            updateAdmin,
            deleteAdmin,
            addMember,
            updateMember,
            deleteMember,
            activateMember,
            getSuspendedMembers,
            deActivateMember,
            getFamily,
            addFamily,
            updateFamily,
            deleteFamily,
            loading,
            adminsData,
            setAdminsData,
            BASE_URL,
            MIN_AMOUNT,
            fontSize,
            membersData,
            screenSize,
            ordersData,
            logData,
            itemsData,
            susData,
            familyData
        }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContextProvider;