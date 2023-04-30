import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import './Navbar.css'

const Navbar = ()=>{
    const {auth, setAuth} = useAuth();
    const handleLogOut = ()=>{
        localStorage.removeItem('auth-token');
        localStorage.removeItem('role')
        setAuth({token:"", role:""})
    }
    return(
        <header className='header'>
            <div className="link-container">
                <h1>Live Ops Engine</h1>
                <nav className='navbar'>
                    <ul>
                        <li><Link to={'/'}>Home</Link></li>
                        <li>About Me</li>
                        <li>Contact Me</li>
                        {
                            auth.role === 'admin'&&
                        <li><Link to={'/createOffer'}>Create Offer</Link></li>
                        }
                        {
                            auth.role === 'admin'&&
                        <li><Link to={'/createProduct'}>Create Product</Link></li>
                        }
                        {
                            auth.role === 'admin'&&
                        <li><Link to={'/products'}>Products</Link></li>
                        }
                    </ul>
                </nav>
            </div>
            <button className='btn' onClick={handleLogOut}>Log Out</button>
        </header>
    )
}

export default Navbar;