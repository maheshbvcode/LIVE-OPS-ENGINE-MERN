import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import './Register.css'

const Register = ()=>{
    const [data , setData] = useState({name: "", email: "", password: ""})
    const [error, setError] = useState(false);
    const [hide, setHide] = useState(false);
    const navigate = useNavigate();
    const url = process.env.REACT_APP_URL

    const handleRegister = async (e)=>{
        e.preventDefault()
        console.log(url);
        try{
            const response = await fetch(url + '/user/register', {
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
                    setError(res.message[0]);
                }else{
                    setError(res.message)
                }   
            }else{
                navigate('/login');
            }
        }catch(e){
            setError("Something went wrong try again later");
            console.log(e);
        }

    }
    return(
        <section className="form-container">
            <h2>Register</h2>
            <form onSubmit={handleRegister}>
                <div className="input-container">
                    <input 
                    type="text"
                    name="name"
                    id="name"
                    autoComplete="off"
                    required
                    placeholder="Full Name"
                    onChange={(e)=>{setData({...data, name: e.target.value})}}
                    value={data.name}
                     />
                </div>
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
                    type="number"
                    name="age"
                    id="age"
                    autoComplete="off"
                    required
                    placeholder="Age"
                    onChange={(e)=>{setData({...data, age: e.target.value})}}
                    value={data.age}
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
                <button className="btn">Register</button>
            </form>
            <p>Already have an account <Link to={'/login'}>Sign In</Link></p>
            {error && <h3 className="errors">{error}</h3>}
        </section>
    )
}

export default Register;