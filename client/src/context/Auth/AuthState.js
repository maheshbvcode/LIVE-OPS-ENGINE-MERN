import { useEffect, useRef, useState } from "react";

import AuthContext  from './AuthContext'

const AuthState = ({children})=>{
    const token = localStorage.getItem('auth-token');
    const role = localStorage.getItem('role');
    const [auth, setAuth] = useState({token: token || "", role: role || ""});
    const mounted = useRef();
    useEffect(()=>{
        if(!mounted.current){
            //component did mount logic
        }else{
            //component did update logic
            let token = localStorage.getItem('token');
            let role = localStorage.getItem('role');
            if(token){
                if(auth.token !== token){
                    setAuth({token, role});
                }
            }
        }
    })
    return(
        <AuthContext.Provider value={{auth, setAuth}}>
            {children}
        </AuthContext.Provider>
    )
}
export default AuthState;