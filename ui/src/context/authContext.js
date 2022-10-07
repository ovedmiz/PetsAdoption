import { createContext, useState } from "react";

export const AuthContext = createContext()

export const AuthContextProvider = (props) => {
    const [connectedUser, setConnectedUser] = useState(null)



    return (
        <AuthContext.Provider value={[connectedUser, setConnectedUser]}>
            {props.children}
        </AuthContext.Provider>
    )
}