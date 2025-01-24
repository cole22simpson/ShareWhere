import { createContext, useState } from "react";
import PropTypes from "prop-types";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [userLoggedIn, setUserLoggedIn] = useState(!!localStorage.getItem("jwtToken"));

    return (
        <AuthContext.Provider value={{ userLoggedIn, setUserLoggedIn }}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
}

export { AuthContext };
export default AuthProvider;