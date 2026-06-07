import React, { useState } from 'react';
import kopisusuImg from '../assets/menu/kopisusu.jpg';
import americanoImg from '../assets/menu/americano.jpg';
import matchaImg from '../assets/menu/matcha.jpg';
import cokelatImg from '../assets/menu/cokelat.jpg';
import croissantImg from '../assets/menu/croissant.jpg';
import kentangImg from '../assets/menu/kentang.jpg';

const Menu = ({ addToCart }) => {
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [toast, setToast] = useState(null); 

  const menuItems = [
    { 
      id: 1, 
      name: "Kopi Susu Ruang", 
      price: 20000, 
      description: "Kopi susu signature dengan paduan gula aren asli.", 
      category: 'Coffee', 
      image: kopisusuImg
    },
    { 
      id: 2, 
      name: "Americano", 
      price: 18000, 
      description: "Espresso klasik dengan air panas, bold dan menyegarkan.", 
      category: 'Coffee', 
      image: americanoImg 
    },
    { 
      id: 3, 
      name: "Matcha Latte", 
      price: 25000, 
      description: "Perpaduan teh hijau premium dengan susu creamy.", 
      category: 'Non-Coffee', 
      image: matchaImg 
    },
    { 
      id: 4, 
      name: "Choco Ice", 
      price: 22000, 
      description: "Cokelat dingin yang rich dengan rasa manis pas.", 
      category: 'Non-Coffee', 
      image: cokelatImg 
    },
    { 
      id: 5, 
      name: "Croissant", 
      price: 15000, 
      description: "Pastry renyah dengan aroma mentega yang kuat.", 
      category: 'Makanan', 
      image: croissantImg 
    },
    { 
      id: 6, 
      name: "Kentang Goreng", 
      price: 18000, 
      description: "Camilan gurih, renyah di luar dan lembut di dalam.", 
      category: 'Makanan', 
      image: kentangImg 
    },
  ];

  const categories = ['Semua', 'Coffee', 'Non-Coffee', 'Makanan'];

  const filteredItems = activeCategory === 'Semua' 
    ? menuItems 
    : menuItems.filter(item => item.category === activeCategory);

  const handleAddToCart = (item) => {
    addToCart(item);
    setToast(item.name); 
    setTimeout(() => setToast(null), 2000); 
  };

  return (
    <section id="menu" className="py-5">
      <div className="container">
        <h2 className="text-center mb-4">Menu Kami</h2>

        {/* Notifikasi Toast */}
        {toast && (
          <div className="alert alert-success position-fixed top-0 end-0 m-3" style={{ zIndex: 1050 }}>
            {toast} berhasil ditambahkan ke keranjang!
          </div>
        )}

        {/* Kategori */}
        <div className="d-flex justify-content-center mb-5 gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`btn ${activeCategory === cat ? 'btn-success' : 'btn-outline-success'}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* List Menu */}
        <div className="row">
          {filteredItems.map((item) => (
            <div key={item.id} className="col-md-4 mb-4">
              <div className="card h-100 shadow-sm border-0">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="card-img-top" 
                  style={{ height: '200px', objectFit: 'cover' }}
                />
                <div className="card-body text-center">
                  <h5 className="card-title fw-bold">{item.name}</h5>
                  <p className="text-muted mb-1">Rp {item.price.toLocaleString()}</p>
                  
                  {/* Deskripsi Produk */}
                  <p className="card-text small text-secondary mb-3" style={{ fontSize: '0.85rem' }}>
                    {item.description}
                  </p>
                  
                  <button 
                    className="btn btn-outline-success"
                    onClick={() => handleAddToCart(item)}
                  >
                    Tambah ke Pesanan
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Menu;