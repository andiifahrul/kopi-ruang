// src/components/Hero.jsx
import React from 'react';

const Hero = () => {
  return (
    <section id="home" className="hero-section bg-forest d-flex align-items-center">
      <div className="container text-center">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <h1 className="display-2 fw-bold text-creamy mb-4">
              Ruang Hangat untuk Penikmat Kopi Terbaik
            </h1>
            <p className="lead text-white mb-5 opacity-75">
              Temukan perpaduan sempurna antara biji kopi lokal berkualitas, 
              suasana tenang untuk bekerja, dan kopi yang dibuat dengan sepenuh hati.
            </p>
            <div className="d-flex justify-content-center gap-3">
              <a href="#menu" className="btn btn-kopi btn-lg px-4">Lihat Menu</a>
              <a href="#lokasi" className="btn btn-outline-light btn-lg px-4">Lokasi Kami</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;