import React from 'react';
import logo from '../assets/logo.png';
import { CartTrigger } from './cart'; 

// Tambahkan onOpenCart ke dalam destructuring props
const Navbar = ({ cart, onOpenCart }) => { 
  return (
    <nav className="navbar navbar-expand-lg bg-forest sticky-top">
      <div className="container">
        {/* Logo */}
        <a className="navbar-brand d-flex align-items-center" href="#home">
          <img src={logo} alt="Logo" style={{ height: '40px', marginRight: '12px' }} />
          <span className="text-creamy fw-bold" style={{ fontSize: '1.5rem' }}>Kopi Ruang</span>
        </a>

        {/* --- Bagian Mobile --- */}
        <div className="d-lg-none d-flex align-items-center gap-3">
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon" style={{ filter: "invert(1)" }}></span>
          </button>
          {/* Teruskan onOpenCart ke CartTrigger sebagai 'onOpen' */}
          <CartTrigger cart={cart} onOpen={onOpenCart} /> 
        </div>

        {/* --- Bagian Menu (Desktop) --- */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item"><a className="nav-link text-creamy" href="#home">Home</a></li>
            <li className="nav-item"><a className="nav-link text-creamy" href="#menu">Menu</a></li>
            <li className="nav-item"><a className="nav-link text-creamy" href="#about">Tentang Kami</a></li>
            <li className="nav-item"><a className="nav-link text-creamy" href="#lokasi">Lokasi</a></li>
            <li className="nav-item d-none d-lg-block">
              {/* Teruskan onOpenCart ke CartTrigger sebagai 'onOpen' */}
              <CartTrigger cart={cart} onOpen={onOpenCart} /> 
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;