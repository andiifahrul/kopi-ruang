import React, { useState } from 'react';
import { supabase } from '../../supabase';
import { FaTrash, FaPlus, FaMinus } from 'react-icons/fa';

const Kasir = () => {
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [tableNumber, setTableNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Daftar menu (disamakan dengan yang ada di menu.jsx)
  const menuItems = [
    { id: 1, name: "Kopi Susu Ruang", price: 20000, category: 'Coffee' },
    { id: 2, name: "Americano", price: 18000, category: 'Coffee' },
    { id: 3, name: "Matcha Latte", price: 25000, category: 'Non-Coffee' },
    { id: 4, name: "Choco Ice", price: 22000, category: 'Non-Coffee' },
    { id: 5, name: "Croissant", price: 15000, category: 'Makanan' },
    { id: 6, name: "Kentang Goreng", price: 18000, category: 'Makanan' },
  ];

  const addToCart = (item) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((i) => i.id === item.id);
      if (existingItem) {
        return prevCart.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  const decreaseQuantity = (id) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity - 1 } : item
      ).filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return alert("Keranjang masih kosong!");
    setIsLoading(true);

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const menuDetail = cart.map((item) => `${item.name} (${item.quantity}x)`).join(', ');

    const { error } = await supabase.from('pesanan').insert([
      {
        nama: customerName || 'Pelanggan Walk-in',
        menu: menuDetail,
        total: total,
        metode_pembayaran: paymentMethod,
        no_meja: tableNumber || null,
        status: 'Pending', // Status pending agar muncul di daftar pesanan untuk dibuatkan
      },
    ]);

    if (error) {
      alert("Gagal menyimpan pesanan: " + error.message);
    } else {
      alert("Pesanan berhasil ditambahkan!");
      // Reset Form
      setCart([]);
      setCustomerName('');
      setTableNumber('');
      setPaymentMethod('cash');
    }
    setIsLoading(false);
  };

  const totalBayar = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="container-fluid py-4">
      <h2 className="mb-4" style={{ color: 'var(--kopi-forest)' }}>Kasir Kopi Ruang</h2>
      
      <div className="row g-4">
        {/* Kolom Kiri: Daftar Menu */}
        <div className="col-lg-7">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-white py-3">
              <h5 className="mb-0">Pilih Menu</h5>
            </div>
            <div className="card-body">
              <div className="row g-3">
                {menuItems.map((item) => (
                  <div className="col-md-6" key={item.id}>
                    <button 
                      className="btn btn-outline-success w-100 h-100 text-start p-3 d-flex flex-column justify-content-between"
                      onClick={() => addToCart(item)}
                    >
                      <span className="fw-bold d-block mb-2">{item.name}</span>
                      <span className="text-muted">Rp {item.price.toLocaleString('id-ID')}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Detail Pesanan (Cart) */}
        <div className="col-lg-5">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-white py-3">
              <h5 className="mb-0">Detail Pesanan</h5>
            </div>
            <div className="card-body d-flex flex-column">
              
              {/* List Cart */}
              <div className="flex-grow-1 overflow-auto mb-3" style={{ maxHeight: '300px' }}>
                {cart.length === 0 ? (
                  <p className="text-center text-muted mt-4">Belum ada menu yang dipilih.</p>
                ) : (
                  <ul className="list-group list-group-flush">
                    {cart.map(item => (
                      <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center px-0">
                        <div>
                          <div className="fw-bold">{item.name}</div>
                          <small className="text-muted">Rp {item.price.toLocaleString('id-ID')}</small>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                          <button className="btn btn-sm btn-outline-secondary" onClick={() => decreaseQuantity(item.id)}><FaMinus size={10} /></button>
                          <span>{item.quantity}</span>
                          <button className="btn btn-sm btn-outline-secondary" onClick={() => addToCart(item)}><FaPlus size={10} /></button>
                          <button className="btn btn-sm btn-outline-danger ms-2" onClick={() => removeItem(item.id)}><FaTrash size={10} /></button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Form Checkout */}
              <div className="border-top pt-3 mt-auto">
                <div className="d-flex justify-content-between fw-bold fs-5 mb-3">
                  <span>Total:</span>
                  <span>Rp {totalBayar.toLocaleString('id-ID')}</span>
                </div>

                <div className="mb-2">
                  <input type="text" className="form-control form-control-sm" placeholder="Nama Pelanggan (Opsional)" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
                </div>
                <div className="d-flex gap-2 mb-3">
                  <input type="number" className="form-control form-control-sm w-50" placeholder="No. Meja" value={tableNumber} onChange={(e) => setTableNumber(e.target.value)} />
                  <select className="form-select form-select-sm w-50" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                    <option value="cash">Cash</option>
                    <option value="qris">QRIS</option>
                  </select>
                </div>

                <button className="btn btn-success w-100 fw-bold py-2" onClick={handleCheckout} disabled={isLoading || cart.length === 0}>
                  {isLoading ? 'Memproses...' : 'Simpan Pesanan'}
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Kasir;