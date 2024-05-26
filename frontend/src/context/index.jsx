import { createContext, useContext, useState } from "react";

const AuthContext = createContext()

const useAuthContextHook = () => useContext(AuthContext)

const AuthContextProvider = ({children}) =>{
    const [userInfo,setUserInfo] = useState({})
    return(
        <AuthContext.Provider value={{userInfo,setUserInfo}}>
            {children}
        </AuthContext.Provider>
    )
}

export {AuthContext,useAuthContextHook,AuthContextProvider}