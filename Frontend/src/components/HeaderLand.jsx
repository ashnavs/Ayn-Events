import React from 'react';

function HeaderLand() {
    return (
        <header className="relative h-screen bg-cover bg-center" style={{ backgroundImage: "url('https://marrymetampabay.com/wp-content/uploads/2018/02/18-8.jpg')" }}>
          <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-white">
            <h1 className="text-5xl font-bold">An experience to remember</h1>
            <p className="text-lg mt-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </div>
        </header>
      );
}

export default HeaderLand;
