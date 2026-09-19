import { myAxios } from "./helper";
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

import { toast,} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const signUp = (payload) => {
    return myAxios
        .post("/user/signup", payload)
        .then((response) => response.data);
        
};

export const login = async (payload) => {
    
    try {
        const response =  await myAxios.post("user/login", payload);
        const data = response.data;

        if (data.message) {
            const tokenMatch = data.message.match(/token\s*:\s*(eyJhbGciOiJIUzI1NiJ9\.[a-zA-Z0-9-_]+\.[a-zA-Z0-9-_]+)/);
            if (tokenMatch && tokenMatch[1]) {
                const token = tokenMatch[1];
                // Store the token in a cookie
                Cookies.set('token', token, { expires: 1, path: '' });
                
                return data.message;
            }
            return data;
        }


        throw new Error('Token not found in response');

    } catch (error) {
        toast.error("Something went wrong");
        console.log('Login error:', error);
        throw error;
    }
};

export const forgotPassword=(payload)=>{
    return myAxios
        .post("/user/forgotPassword", payload)
        .then((response) => response.data);
};

export const getToken = () => {
    return Cookies.get('token');
};

// Synchronous fallback derived purely from the JWT (email + role), used for
// the first render before fetchProfile() resolves, and if that call fails.
export const getCurrentUser = () => {
    const token = getToken();
    if (!token) return null;
    try {
        const claims = jwtDecode(token);
        const email = claims.sub || '';
        const localPart = email.split('@')[0] || '';
        const label = localPart
            .replace(/[._-]+/g, ' ')
            .trim()
            .replace(/\b\w/g, (c) => c.toUpperCase()) || email;
        const initials = label
            .split(' ')
            .filter(Boolean)
            .slice(0, 2)
            .map((w) => w[0].toUpperCase())
            .join('') || 'U';
        return { email, role: claims.role, label, initials };
    } catch {
        return null;
    }
};

// The real name, fetched from GET /user/profile. Falls back to the
// email-derived label above if the call fails for any reason.
export const fetchProfile = async () => {
    try {
        const response = await myAxios.get('/user/profile');
        const user = response.data.data;
        const label = user.name || getCurrentUser()?.label || user.email;
        const initials = label
            .split(' ')
            .filter(Boolean)
            .slice(0, 2)
            .map((w) => w[0].toUpperCase())
            .join('') || 'U';
        return { ...user, label, initials };
    } catch (error) {
        console.error('Error fetching profile:', error);
        return getCurrentUser();
    }
};

// Admin-only: list/enable/disable customer accounts.
export const getAllUsers = async () => {
    const response = await myAxios.get('/user/get');
    return response.data.data;
};

export const updateUserStatus = async (id, status) => {
    const response = await myAxios.post('/user/update', { id: String(id), status: String(status) });
    return response.data;
};

export const logout=()=>{
    Cookies.remove('token');
    
    console.log("Token deleted");
    // toast.success("Logged out successfully");
}
