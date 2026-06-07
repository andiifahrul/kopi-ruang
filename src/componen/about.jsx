import React from 'react';
import Suasana from '../assets/suasanacafe.jpg';

const About = () => {
  return (
    <section id="about" className="py-5" style={{ backgroundColor: '#ffffff' }}>
      <div className="container py-5">
        <div className="row align-items-center">
          {/* Sisi Kiri: Gambar */}
          <div className="col-md-6 mb-4 mb-md-0">
            <img 
              src={Suasana} 
              alt="Suasana Kopi Ruang" 
              className="img-fluid rounded shadow-sm"
              style={{ width: '100%', height: '400px', objectFit: 'cover' }}
            />
          </div>

          {/* Sisi Kanan: Teks */}
          <div className="col-md-6 ps-md-5">
            <h2 className="mb-4" style={{ color: '#0f2622', fontFamily: "'Playfair Display', serif" }}>
              Ruang untuk Berbagi Cerita
            </h2>
            <p className="text-muted mb-4" style={{ lineHeight: '1.8' }}>
              Kopi Ruang lahir dari keinginan sederhana: menciptakan tempat di mana setiap orang merasa diterima. Kami percaya bahwa kopi berkualitas, saat disajikan dengan sepenuh hati, adalah media terbaik untuk menjalin koneksi.
            </p>
            <p className="text-muted mb-4" style={{ lineHeight: '1.8' }}>
              Kami bekerja sama langsung dengan petani kopi lokal untuk memastikan setiap cangkir yang Anda nikmati bukan hanya sekadar minuman, melainkan sebuah apresiasi terhadap tanah nusantara. Di sini, Anda menemukan "Ruang" untuk bekerja, bertemu teman, atau sekadar melepas penat.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;