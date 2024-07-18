import React from 'react';
import './LandingPage.scss'; 

function LandingPage() {


  return (
    <header className="header relative h-screen bg-cover bg-center" style={{ backgroundImage: "url('https://marrymetampabay.com/wp-content/uploads/2018/02/18-8.jpg')" }}>
      <div className="overlay absolute inset-0 bg-black bg-opacity-40 overflow-hidden">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="title text-white text-3xl font-serif font-bold">AYN EVENTS</div>
        </div>
        <div className="content flex flex-col items-center justify-center h-full text-white text-center">
          <h1 className="headline text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold">An experience to remember</h1>
          <div className="buttons mt-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <a href="/login" className="button px-4 py-2 bg-white text-black font-sans font-semibold rounded hover:bg-gray-200 transition">Become a User</a>
            <a href="/vendor/login" className="button px-4 py-2 bg-transparent border border-white text-white font-sans font-semibold rounded hover:bg-white hover:text-black transition">Become a Vendor</a>
          </div>
        </div>
      </div>
    </header>
  );
}

export default LandingPage;
