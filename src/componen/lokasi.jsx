import React from 'react';

const Location = () => {
  return (
    <section id="lokasi" className="py-5" style={{ backgroundColor: '#e8dcca' }}>
      <div className="container">
        <h2 className="text-center mb-5" style={{ color: '#0f2622', fontFamily: "'Playfair Display', serif" }}>
          Kunjungi Kami
        </h2>

        <div className="row g-4 align-items-center">
          {/* Sisi Kiri: Peta */}
          <div className="col-md-6">
            <div className="ratio ratio-16x9 rounded shadow-sm">
              {/* Ganti src dengan link Google Maps Embed milik Kopi Ruang */}
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!2m3!1d3966.521260322283!2d106.8195!3d-6.1754!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMTAnMzEuNCJTIDEwNMKwNDknMTAuMiJF!5e0!3m2!1sid!2sid!4v1620000000000!5m2!1sid!2sid" 
                title="Peta Kopi Ruang"
                allowFullScreen="" 
                loading="lazy"
                className="rounded"
              ></iframe>
            </div>
          </div>

          {/* Sisi Kanan: Detail Informasi */}
          <div className="col-md-6 ps-md-5">
            <div className="mb-4">
              <h5 className="fw-bold" style={{ color: '#0f2622' }}>Alamat</h5>
              <p className="text-muted">Jl. Kopi No. 123, Ruang Kota, Indonesia</p>
            </div>
            
            <div className="mb-4">
              <h5 className="fw-bold" style={{ color: '#0f2622' }}>Jam Operasional</h5>
              <p className="text-muted">
                Senin - Jumat: 08.00 - 22.00 WIB<br />
                Sabtu - Minggu: 09.00 - 23.00 WIB
              </p>
            </div>

            <div>
              <h5 className="fw-bold" style={{ color: '#0f2622' }}>Kontak</h5>
              <p className="text-muted">
                WhatsApp: 0812-3456-7890<br />
                Instagram: @kopiruang
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Location;