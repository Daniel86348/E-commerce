import { FaMapMarkerAlt } from "react-icons/fa";
import "./Navbar.css";


const Navbar = () => {
  return (
    <nav className="navbar">
      <a href="#" className="navbar-logo">
        <img src="" alt="mi tienda" className="navbar-logo-image" />
         
      </a>
      <div className="nav-location">
        <FaMapMarkerAlt />
        <span>Enviar a <br />Colombia</span>
      </div>
      
          <div className="nav-search">
            <select>
              <option value="all">Todas</option>
            </select>
            
            <input type="text" placeholder="Buscar productos..." />
            <button>Buscar</button>

          </div>
            <select>
              <option value="es">Español</option>
              <option value="en">English</option>
               
            </select>
             
              <a href="#" className="nav-account">
              <span>Hola, identifícate</span>
              <strong>Cuenta y Listas</strong>
             </a>

             <a href="#" className="nav-orders">
               <span>Devoluciones</span>
               <strong>y pedidos</strong>
              </a>
              <a href="#" className="nav-cart">
                <span>🛒 </span>
                <strong>0 artículos</strong>
              </a>
          
    </nav>
  );
}

export default Navbar;