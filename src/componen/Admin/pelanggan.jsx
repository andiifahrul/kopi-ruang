import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import { FaDownload } from 'react-icons/fa';

const Pelanggan = () => {
  const [pelangganList, setPelangganList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPelanggan();
  }, []);

  const fetchPelanggan = async () => {
    setLoading(true);
    const { data: allData, error } = await supabase
      .from('pesanan')
      .select('*')
      .eq('status', 'Selesai') // Hanya ambil pesanan yang berstatus 'Selesai'
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error mengambil data:', error.message);
    } else {
      // Mengelompokkan pesanan berdasarkan nama pelanggan
      const groupedData = allData.reduce((acc, curr) => {
        const name = (curr.nama || 'Pelanggan Tanpa Nama').trim();
        const finalName = name === '' ? 'Pelanggan Tanpa Nama' : name;
        
        if (!acc[finalName]) {
          acc[finalName] = { 
            nama: finalName, 
            menuDipesan: [], 
            totalBelanja: 0, 
            terakhirPesan: curr.created_at 
          };
        }
        
        if (curr.menu) {
          acc[finalName].menuDipesan.push(curr.menu);
        }
        
        // Tambahkan total belanja (karena semua data di sini sudah pasti 'Selesai')
        acc[finalName].totalBelanja += (curr.total || 0);
        
        // Mencatat waktu pesanan terakhir
        if (new Date(curr.created_at) > new Date(acc[finalName].terakhirPesan)) {
          acc[finalName].terakhirPesan = curr.created_at;
        }

        return acc;
      }, {});

      // Mengubah object menjadi array dan mengurutkannya berdasarkan total belanja terbanyak
      const sortedData = Object.values(groupedData).sort((a, b) => b.totalBelanja - a.totalBelanja);
      setPelangganList(sortedData);
    }
    setLoading(false);
  };

  // Fungsi untuk mengekspor data pelanggan ke CSV
  const handleExportCSV = () => {
    if (pelangganList.length === 0) {
      alert('Tidak ada data untuk diekspor.');
      return;
    }

    // 1. Buat Header Kolom
    const headers = ['Nama Pelanggan', 'Menu yang Dipesan', 'Total Belanja (Rp)', 'Pesanan Terakhir'];

    // 2. Format baris-baris data
    const csvRows = [
      headers.join(','), // Baris pertama CSV adalah headers
      ...pelangganList.map((row) => {
        const date = new Date(row.terakhirPesan).toLocaleString('id-ID');
        
        // Fungsi pembantu agar format CSV aman jika terdapat tanda koma pada nama
        const escapeCSV = (str) => `"${String(str || '').replace(/"/g, '""')}"`;

        return [
          escapeCSV(row.nama),
          escapeCSV(row.menuDipesan.join(', ')),
          row.totalBelanja,
          escapeCSV(date)
        ].join(',');
      })
    ];

    // 3. Gabungkan dan download
    const csvData = csvRows.join('\n');
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Database_Pelanggan_${new Date().toLocaleDateString('id-ID')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 style={{ color: 'var(--kopi-forest)' }}>Database Pelanggan</h2>
        <button className="btn btn-success d-flex align-items-center gap-2" onClick={handleExportCSV}>
          <FaDownload /> Ekspor CSV
        </button>
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead style={{ backgroundColor: 'var(--kopi-sand)', color: 'var(--kopi-forest)' }}>
                <tr>
                  <th className="py-3 px-4">Nama Pelanggan</th>
                  <th className="py-3 px-4">Menu yang Dipesan</th>
                  <th className="py-3 px-4 text-end">Total Belanja (Sukses)</th>
                  <th className="py-3 px-4 text-center">Pesanan Terakhir</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="4" className="text-center py-5 text-muted">Memuat data...</td></tr>
                ) : pelangganList.length === 0 ? (
                  <tr><td colSpan="4" className="text-center py-5 text-muted">Belum ada data pelanggan.</td></tr>
                ) : (
                  pelangganList.map((item, index) => (
                    <tr key={index} className="align-middle">
                      <td className="px-4 fw-bold">{item.nama}</td>
                      <td className="px-4" style={{ maxWidth: '300px' }}>
                        <small className="text-muted">{item.menuDipesan.join(', ')}</small>
                      </td>
                      <td className="px-4 text-end text-success fw-semibold">
                        Rp {item.totalBelanja.toLocaleString('id-ID')}
                      </td>
                      <td className="px-4 text-center">
                        <small className="text-muted">
                          {new Date(item.terakhirPesan).toLocaleDateString('id-ID', {
                             day: 'numeric', month: 'long', year: 'numeric'
                          })}
                        </small>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pelanggan;