import { supabase } from '../../supabase';
import React, { useState, useEffect } from 'react';
import { FaCheck, FaTimes } from 'react-icons/fa';

const Pesanan = () => {
  const [pesananList, setPesananList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null); // State untuk pop-up gambar

  // Mengambil data saat komponen dimuat
  useEffect(() => {
    fetchPesanan();
  }, []);

  const fetchPesanan = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('pesanan')
      .select('*')
      .order('created_at', { ascending: false }); // Urutkan dari yang terbaru

    if (error) {
      console.error('Error mengambil data pesanan:', error.message);
    } else {
      setPesananList(data);
    }
    setLoading(false);
  };

  // (Opsional) Fungsi untuk mengupdate status pesanan (contoh: jadi Selesai/Batal)
  const updateStatus = async (id, newStatus) => {
    const { error } = await supabase
      .from('pesanan')
      .update({ status: newStatus })
      .eq('id', id);
      
    if (error) {
      alert('Gagal update status: ' + error.message);
    } else {
      fetchPesanan(); // Refresh daftar setelah berhasil update
    }
  };

  return (
    <div className="container-fluid py-4">
      <div className="mb-4">
        <h2 style={{ color: 'var(--kopi-forest)' }}>Manajemen Pesanan</h2>
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead style={{ backgroundColor: 'var(--kopi-sand)', color: 'var(--kopi-forest)' }}>
                <tr>
                  <th className="py-3 px-4">Tanggal</th>
                  <th className="py-3 px-4">Nama</th>
                  <th className="py-3 px-4">Pesanan</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4 text-center">Metode & Meja</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="6" className="text-center py-5 text-muted">Memuat data...</td></tr>
                ) : pesananList.length === 0 ? (
                  <tr><td colSpan="6" className="text-center py-5 text-muted">Belum ada pesanan masuk.</td></tr>
                ) : (
                  pesananList.map((item) => (
                    <tr key={item.id} className="align-middle">
                      <td className="px-4"><small className="text-muted">{new Date(item.created_at).toLocaleString('id-ID')}</small></td>
                      <td className="px-4 fw-bold">{item.nama || '-'}</td>
                      <td className="px-4" style={{ maxWidth: '250px' }}><small>{item.menu}</small></td>
                      <td className="px-4">Rp {item.total?.toLocaleString('id-ID')}</td>
                      <td className="px-4 text-center">
                        <span className={`badge bg-${item.metode_pembayaran === 'qris' ? 'info text-dark' : 'secondary'}`}>
                          {item.metode_pembayaran?.toUpperCase()}
                        </span>
                        {item.no_meja && <span className="d-block mt-1 small text-muted">Meja: {item.no_meja}</span>}
                        {item.bukti_url && (
                          <button onClick={() => setSelectedImage(item.bukti_url)} className="d-block mt-2 badge bg-primary border-0 w-100 text-center">
                            Lihat Bukti
                          </button>
                        )}
                      </td>
                      <td className="px-4 text-center">
                        {/* Dropdown kecil atau badge status */}
                        {item.status === 'Pending' ? (
                           <div className="btn-group btn-group-sm">
                             <button className="btn btn-outline-success" onClick={() => updateStatus(item.id, 'Selesai')} title="Selesaikan Pesanan"><FaCheck /></button>
                             <button className="btn btn-outline-danger" onClick={() => updateStatus(item.id, 'Batal')} title="Batalkan"><FaTimes /></button>
                           </div>
                        ) : (
                           <span className={`badge bg-${item.status === 'Selesai' ? 'success' : 'danger'}`}>{item.status}</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Pop-up Modal untuk Bukti Pembayaran */}
      {selectedImage && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center" 
          style={{ zIndex: 1060, backgroundColor: 'rgba(0,0,0,0.8)' }}
          onClick={() => setSelectedImage(null)} // Tutup saat background hitam diklik
        >
          <div className="position-relative" onClick={(e) => e.stopPropagation()}>
            <button 
              className="btn-close btn-close-white position-absolute" 
              style={{ top: '-40px', right: '0' }}
              onClick={() => setSelectedImage(null)}
              aria-label="Tutup"
            ></button>
            <img src={selectedImage} alt="Bukti Pembayaran" className="shadow" style={{ maxHeight: '85vh', maxWidth: '90vw', borderRadius: '8px' }} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Pesanan;