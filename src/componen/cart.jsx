import React, { useState, useEffect, useRef } from 'react';
import { FaShoppingCart, FaTrash } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Offcanvas } from 'bootstrap'; 
import { supabase } from '../supabase'; 

// 1. Komponen Trigger
export const CartTrigger = ({ cart, onOpen }) => {
  const totalQuantity = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  return (
    <button className="btn position-relative d-flex align-items-center" type="button" onClick={onOpen} style={{ border: 'none' }}>
      <span className="text-creamy" style={{ fontSize: '1.2rem' }}><FaShoppingCart /></span>
      {totalQuantity > 0 && (
        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.6rem' }}>
          {totalQuantity}
        </span>
      )}
    </button>
  );
};

// 2. Komponen Item
const CartItem = ({ item, onRemove }) => {
  return (
    <li className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
      <div>
        <div className="fw-bold">{item.name}</div>
        <small className="text-muted">x{item.quantity} | Rp {(item.price * item.quantity).toLocaleString()}</small>
      </div>
      <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => onRemove(item.id)}>
        <FaTrash />
      </button>
    </li>
  );
};

// 3. Komponen Offcanvas Utama
export const CartOffcanvas = ({ cart, onRemove, isOpen, onClose }) => {
  const offcanvasRef = useRef(null);
  const bsOffcanvas = useRef(null);
  
  const [customerName, setCustomerName] = useState(''); // State baru untuk nama
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [tableNumber, setTableNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [proofFile, setProofFile] = useState(null);

  useEffect(() => {
    const instance = new Offcanvas(offcanvasRef.current);
    bsOffcanvas.current = instance;

    return () => {
      instance.dispose();
      const backdrop = document.querySelector('.offcanvas-backdrop');
      if (backdrop) backdrop.remove();
      document.body.style.overflow = 'auto';
      document.body.style.paddingRight = '0px';
    };
  }, []);

  useEffect(() => {
    if (bsOffcanvas.current) {
      if (isOpen) {
        bsOffcanvas.current.show();
      } else {
        bsOffcanvas.current.hide();
      }
    }
  }, [isOpen]);

  const resetState = () => {
    setCustomerName(''); // Reset nama
    setPaymentMethod(null);
    setIsConfirmed(false);
    setTableNumber('');
    setProofFile(null);
    onClose();
  };

  const handleConfirm = async () => {
    setIsLoading(true);
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const menuDetail = cart.map(item => `${item.name} (${item.quantity}x)`).join(', ');

    let buktiUrl = null;
    if (paymentMethod === 'qris' && proofFile) {
      const fileExt = proofFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('bukti_pembayaran')
        .upload(fileName, proofFile);

      if (uploadError) {
        alert("Gagal mengupload bukti pembayaran: " + uploadError.message);
        setIsLoading(false);
        return;
      }
      const { data: publicUrlData } = supabase.storage.from('bukti_pembayaran').getPublicUrl(fileName);
      buktiUrl = publicUrlData.publicUrl;
    }

    // Kirim ke Supabase
    const { error } = await supabase
      .from('pesanan')
      .insert([
        { 
          nama: customerName, // Masukkan data nama
          menu: menuDetail,
          total: total,
          metode_pembayaran: paymentMethod,
          no_meja: tableNumber || null,
          status: 'Pending',
          bukti_url: buktiUrl
        }
      ]);

    if (error) {
      alert("Gagal mengirim pesanan: " + error.message);
      setIsLoading(false);
      return;
    }

    setIsConfirmed(true);
    setIsLoading(false);
  };

  return (
    <div className="offcanvas offcanvas-end" ref={offcanvasRef} tabIndex="-1" style={{ width: '400px', maxWidth: '90vw' }}>
      <div className="offcanvas-header">
        <h5 className="offcanvas-title">Keranjang Anda</h5>
        <button type="button" className="btn-close" onClick={resetState}></button>
      </div>
      
      <div className="offcanvas-body">
        {cart.length === 0 ? (
          <div className="text-center text-muted mt-5"><p>Keranjang masih kosong nih.</p></div>
        ) : (
          <div>
            <motion.ul className="list-unstyled" initial="hidden" animate="visible">
              {cart.map((item) => (<CartItem key={item.id} item={item} onRemove={onRemove} />))}
            </motion.ul>

            <div className="mt-4 pt-3 border-top fw-bold d-flex justify-content-between fs-5 mb-4">
              <span>Total:</span>
              <span>Rp {cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toLocaleString()}</span>
            </div>

            {!isConfirmed ? (
              <div className="payment-section">
                {/* Input Nama Pelanggan */}
                <div className="mb-3">
                    <label className="form-label small fw-bold">Nama Pemesan</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Contoh: Budi" 
                        value={customerName} 
                        onChange={(e) => setCustomerName(e.target.value)} 
                    />
                </div>

                {/* Input Nomor Meja (Bisa untuk Cash maupun QRIS) */}
                <div className="mb-3">
                  <label className="form-label small fw-bold">Nomor Meja (Isi jika makan di tempat)</label>
                  <input type="number" className="form-control" placeholder="Contoh: 5" value={tableNumber} onChange={(e) => setTableNumber(e.target.value)} />
                </div>

                <p className="fw-bold">Pilih Metode Pembayaran:</p>
                <div className="d-flex gap-3 mb-3">
                  <button className={`btn ${paymentMethod === 'cash' ? 'btn-success' : 'btn-outline-secondary'} flex-fill`} onClick={() => setPaymentMethod('cash')}>Cash</button>
                  <button className={`btn ${paymentMethod === 'qris' ? 'btn-success' : 'btn-outline-secondary'} flex-fill`} onClick={() => setPaymentMethod('qris')}>QRIS</button>
                </div>

                {paymentMethod === 'qris' && (
                  <div className="text-center mb-3 p-3 border rounded bg-light">
                    <p className="fw-bold mb-2">Scan QRIS Berikut:</p>
                    <img src="/images/qris-code.jpg" alt="QRIS Code" className="img-fluid" style={{ maxHeight: '200px', width: '100%', objectFit: 'contain', display: 'block', margin: '0 auto' }} />
                    <div className="mt-3 text-start">
                      <label className="form-label small fw-bold">Upload Bukti Pembayaran (Wajib)</label>
                      <input type="file" className="form-control form-control-sm" accept="image/*" onChange={(e) => setProofFile(e.target.files[0])} />
                    </div>
                  </div>
                )}
                
                <button 
                  className="btn btn-success w-100 py-2" 
                  onClick={handleConfirm} 
                  disabled={isLoading || !customerName || !paymentMethod || (paymentMethod === 'qris' && !proofFile)}
                >
                  {isLoading ? "Memproses..." : "Konfirmasi Pembayaran"}
                </button>
              </div>
            ) : (
              <div className="text-center p-3 border rounded bg-light">
                <h5 className="text-success">Pesanan Terkirim!</h5>
                <button className="btn btn-outline-primary mt-3" onClick={resetState}>Pesan Lagi</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};