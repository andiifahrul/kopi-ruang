import React from 'react';

const Footer = () => {
  return (
    <footer style={{ backgroundColor: '#0f2622', color: '#ffffff' }} className="py-5">
      <div className="container">
        <div className="row g-4">
          {/* Kolom 1: Branding */}
          <div className="col-md-4">
            <h4 className="fw-bold mb-3">Kopi Ruang</h4>
            <p style={{ color: '#ccc', fontSize: '0.9rem' }}>
              Ruang hangat untuk menikmati setiap momen dengan secangkir kopi terbaik yang diseduh sepenuh hati.
            </p>
          </div>

          {/* Kolom 2: Navigasi Cepat */}
          <div className="col-md-4">
            <h5 className="mb-3">Navigasi</h5>
            <ul className="list-unstyled">
              <li><a href="#home" className="text-white text-decoration-none">Beranda</a></li>
              <li><a href="#menu" className="text-white text-decoration-none">Menu Kami</a></li>
              <li><a href="#about" className="text-white text-decoration-none">Tentang Kami</a></li>
              <li><a href="#location" className="text-white text-decoration-none">Lokasi & Kontak</a></li>
            </ul>
          </div>

          {/* Kolom 3: Media Sosial */}
          <div className="col-md-4">
            <h5 className="mb-3">Ikuti Kami</h5>
            <p className="mb-1">Instagram: @kopiruang</p>
            <p className="mb-0">Email: hello@kopiruang.com</p>
          </div>
        </div>

        {/* Garis Pembatas */}
        <hr className="my-4 border-secondary" />

        {/* Hak Cipta */}
        <div className="text-center">
          <p className="mb-0" style={{ color: '#aaa', fontSize: '0.85rem' }}>
            &copy; {new Date().getFullYear()} Kopi Ruang. Dibuat dengan sepenuh hati.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;