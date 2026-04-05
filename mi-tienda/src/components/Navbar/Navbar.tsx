
import './Navbar.css';
import { Link } from 'react-router-dom';
const Navbar = () => {
    return (
       <section className='header'>
        <h1 className='logo'>MI-TI<span >ENDA</span></h1>
        <nav className='navbar'>
            <ul className='nav-links'>
                <li>
                    <Link to="/">Home</Link>
                </li>

            </ul>
        </nav>
        <div className='icons'>
            <button className='search-btn'>
                <i className='fas fa-search'></i>
            </button> 
            <Link to="/carrito" className='icons-button'>
                <i className='fas fa-shopping-cart'></i>
                <span className='counter'>0</span>
            </Link>
        </div>
            
        
       </section>
    )

}

export default Navbar;