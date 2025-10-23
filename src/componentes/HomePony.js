// src/componentes/HomePony.js

import React, { useEffect } from 'react'; // 1. Importa useEffect

const HomePony = () => {
    
    // 2. Añade este bloque
    useEffect(() => {
      document.title = 'Pony Store'; // Define el título para esta página
    }, []); // El array vacío asegura que se ejecute solo una vez

    return (
        <div>
            {/* El resto de tu código no cambia */}
            <header className="page-header">
                <img src="/logo.png" alt="Logo de la tienda" className="logo" />
            </header>
            <main className="content">
                <h1>BIENVENIDO A LA PONY STORE!</h1>
                
            </main>
        </div>
    );
};

export default HomePony;