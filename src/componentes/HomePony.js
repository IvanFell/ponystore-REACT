// src/componentes/HomePony.js

import React, { useEffect, useState } from 'react'; // Importamos useState

// Datos de la tienda actualizados
const productos = [
    {
        id: 1,
        nombre: 'Taza Magica',
        precioActual: '120.00',
        imagen: '/Taza Magica.jpg' 
    },
    {
        id: 2,
        nombre: 'Cubiertos',
        precioActual: '70.00',
        imagen: '/Cubiertos.jpg'
    },
    {
        id: 3,
        nombre: 'Taza Peltre',
        precioActual: '150.00',
        imagen: '/Taza Peltre.jpg'
    },
    {
        id: 4,
        nombre: 'Libreta 60 Aniversario',
        precioActual: '200.00',
        imagen: '/Libreta 60 Aniversario.jpg'
    }
];

// Componente para mostrar un solo artículo
const ProductoCard = ({ nombre, precioActual, imagen }) => {
    return (
        <div className="product-card">
            {/* NOTA: Asegúrate de que estas imágenes estén en la carpeta public/ */}
            <img src={imagen} alt={nombre} />
            <h3>{nombre}</h3>
            <div className="price">${precioActual}</div>
        </div>
    );
};

const HomePony = () => {
    // Estado para controlar si el menú lateral está abierto o cerrado
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Lógica para el título de la pestaña
    useEffect(() => {
        document.title = 'Pony Store';
    }, []); 

    // Funciones para abrir y cerrar el menú
    const openNav = () => setIsMenuOpen(true);
    const closeNav = () => setIsMenuOpen(false);

    // El ancho del menú se controla con el estado en el estilo inline
    const sideNavStyle = {
        width: isMenuOpen ? '250px' : '0'
    };

    return (
        <div className="home-container">
            {/* Menú lateral (Sidenav) */}
            <div id="mySidenav" className="sidenav" style={sideNavStyle}>
                <span className="closebtn" onClick={closeNav}>&times;</span>
                <button onClick={() => console.log('Camisas')}>Camisas</button>
                <button onClick={() => console.log('Sudaderas')}>Sudaderas</button>
                <button onClick={() => console.log('Accesorios')}>Accesorios</button>
                <button onClick={() => console.log('Tazas')}>Tazas</button>
                <button onClick={() => console.log('Loncheras')}>Loncheras</button>
                <button onClick={() => console.log('Agendas')}>Agendas</button>
            </div>

            {/* Encabezado */}
            <header className="header">
                <span className="menu-icon" onClick={openNav}>&#9776;</span>
                
                {/* El logo y el h1 se centran usando el CSS de la clase .header.
                  Usaré el logo de tu proyecto y la imagen de "60 Aniversario" 
                  (asumiendo que está en /public)
                */}
                <img src="/60_aniversario.jpg" alt="60 Aniversario" className="header-image" />
                <h1>Bienvenido a la Pony Store!</h1>
            </header>
            
            <hr /> 
            
            <main className="content">
                <div className="product-grid">
                    {productos.map(producto => (
                        <ProductoCard 
                            key={producto.id}
                            {...producto}
                        />
                    ))}
                </div>
            </main>
        </div>
    );
};

export default HomePony;