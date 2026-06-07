import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './index.css';

// Import Komponen
import Navbar from './componen/navbar';
import { supabase } from './supabase';
import { CartOffcanvas } from './componen/cart'; 
import Hero from './componen/hero';
import Menu from './componen/menu';
import About from './componen/about';
import Location from './componen/lokasi';
import Footer from './componen/footer';

// Import Halaman Admin 
import AdminGatekeeper from './componen/Admin/ceklogin';
import AdminLayout from './componen/Admin/adminlayout';
import LoginPage from './componen/Admin/login';
import Dashboard from './componen/Admin/dashboard';
import Pesanan from './componen/Admin/pesanan';
import Kasir from './componen/Admin/kasir';
import Pelanggan from './componen/Admin/pelanggan';



function App() {
  // 1. State Hooks
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false); // State untuk kontrol buka/tutup

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
  }, []);

  // 2. Fungsi Cart
  const addToCart = (newItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.name === newItem.name);
      if (existingItem) {
        return prevCart.map((item) =>
          item.name === newItem.name
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { ...newItem, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (idToRemove) => {
    setCart((prevCart) => 
      prevCart.map((item) => 
        item.id === idToRemove 
          ? { ...item, quantity: item.quantity - 1 }
          : item
      ).filter((item) => item.quantity > 0)
    );
  };

  // 3. Layout Komponen (Satu wadah untuk Home)
  const HomeLayout = () => (
    <>
      <Navbar 
        cart={cart} 
        onOpenCart={() => setIsCartOpen(true)} 
      />
      
      <CartOffcanvas 
        cart={cart} 
        onRemove={removeFromCart} 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
      />
      
      <Hero />
      <Menu addToCart={addToCart} />
      <About />
      <Location />
      <Footer />
    </>
  );

  // 4. Routing
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<HomeLayout />} />
        <Route path="/admin" element={<AdminGatekeeper />}>
    
    {/* AdminLayout akan dirender sebagai Layout utama */}
    <Route element={<AdminLayout />}>
       {/* Outlet di AdminLayout akan digantikan oleh komponen di bawah ini */}
       <Route index element={<Dashboard />} /> 
       <Route path="pesanan" element={<Pesanan />} />
       <Route path="kasir" element={<Kasir />} />
       <Route path="pelanggan" element={<Pelanggan />} />
    </Route>
    </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;