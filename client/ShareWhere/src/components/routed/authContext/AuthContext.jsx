import { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [userLoggedIn, setUserLoggedIn] = useState(false);
    const API_BASE_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/auth/check`, {
                    method: "GET",
                    credentials: "include",
                });

                if (response.ok) {
                    setUserLoggedIn(true);
                } else {
                    setUserLoggedIn(false);
                    localStorage.removeItem("jwtToken");
                    localStorage.removeItem("userData");
                    localStorage.removeItem("userId");
                    localStorage.removeItem("name");
                    localStorage.removeItem("city");
                }
            } catch (error) {
                console.error("Error checking authentication:", error);
                setUserLoggedIn(false);
            }
        };

        checkAuthStatus();
    }, []);

    return (
        <AuthContext.Provider value={{ userLoggedIn, setUserLoggedIn }}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export { AuthContext };
export default AuthProvider;
