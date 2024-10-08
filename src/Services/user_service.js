import { myAxios } from "./helper";
import Cookies from 'js-cookie';

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

export const logout=()=>{
    Cookies.remove('token');
    
    console.log("Token deleted");
    // toast.success("Logged out successfully");
}
