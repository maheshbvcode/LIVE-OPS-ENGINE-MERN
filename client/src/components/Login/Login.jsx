import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import useAuth from "../../hooks/useAuth";

const Login = ()=>{
    const [data , setData] = useState({name: "", email: "", password: ""})
    const [hide, setHide] = useState(false);
    const [error, setError] = useState(false);
    const navigate = useNavigate();
    const url = process.env.REACT_APP_URL;
    const {setAuth} = useAuth()

    const handleLogin = async (e)=>{
        e.preventDefault()
        console.log(url);
        try{
            const response = await fetch(url + '/user/login', {
                method: 'post',
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })

            const res = await response.json();
            console.log(res)
            if(res.status === 'failure'){
                if(Array.isArray(res.message)){
                    setError(res.message[0].msg);
                }else{
                    setError(res.message)
                }   
            }else{
                setAuth({token: res.token, role: res.role})
                localStorage.setItem('auth-token', res.token);
                localStorage.setItem('role', res.role);
                navigate('/');
            }
        }catch(e){
            setError("Something went wrong try again later");
            console.log(e);
        }

    }
    return(
        <section className="form-container">
            <h2>Sign In</h2>
            <form onSubmit={handleLogin}>
                <div className="input-container">
                    <input 
                    type="email"
                    name="email"
                    id="email"
                    autoComplete="off"
                    required
                    placeholder="Email"
                    onChange={(e)=>{setData({...data, email: e.target.value})}}
                    value={data.email}
                     />
                </div>
                <div className="input-container">
                    <input 
                    type={hide?"text": "password"}
                    name="password"
                    id="password"
                    autoComplete="off"
                    required
                    placeholder="Password"
                    onChange={(e)=>{setData({...data, password: e.target.value})}}
                    value={data.password}
                     />
                     <span className="toggle-password" onClick={()=>{setHide(!hide)}}></span>
                </div>
                <button className="btn">Sign In</button>
            </form>
            <p>Don't have an accout <Link to={'/register'}>Register</Link></p>
            {error && <h3 className="errors">{error}</h3>}
        </section>
    )
}

export default Login;