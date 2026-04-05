
import "./ProductList.css"


const ProductList = () => {
 


    return (
        <section className="main-content">   
        <aside className="filter">
                <h2>Filtros</h2>
                <div className="filters-category">
                    <div className="filter-category">
                        <h3>Categoría</h3>
                        <label> 
                            <input type="checkbox"/>
                            <span>Hombres</span>
                        </label>
                        <label> 
                            <input type="checkbox"/>
                            <span>Mujeres</span>
                        </label>
                        <label> 
                            
                            <input type="checkbox"/>
                            <span> Niños </span>
                        </label>
                    </div>
                    <div className="filters-category">
                    <div className="filter-category">
                        <h3>Tipos de productos</h3>
                        <label> 
                            <input type="checkbox"/>
                            <span>Ropa</span>
                        </label>
                        <label> 
                            <input type="checkbox"/>
                            <span>Zapatos</span>
                        </label>
                        <label> 
                            
                            <input type="checkbox"/>
                            <span> Accesorios </span>
                        </label>
       
                    </div>
                    </div>
                    
                </div>
        </aside>
        <main className="collection">
            <div className="collection-header">
                <h2>TODAS LAS COLECCIONES</h2>
                 <label>
                    Ordenar por:
                    <select>
                        <option>Relevante</option>
                        <option>Precio: menor a mayor</option>
                        <option>Precio: mayor a menor</option>
                        
                    </select>
                </label>
            </div>
        </main>

        </section>
    )
}

   export default ProductList