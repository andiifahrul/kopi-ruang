import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import '../../index.css'; 
import { supabase } from '../../supabase'; // Pastikan path import supabase benar
import { FaAngleDoubleLeft, FaAngleDoubleRight, FaTachometerAlt, FaCoffee, FaSignOutAlt, FaCashRegister, FaUsers } from 'react-icons/fa';

const AdminLayout = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [userName, setUserName] = useState(''); // State untuk nama user
  const location = useLocation(); 
  const navigate = useNavigate();

  // Mengambil data user saat komponen dimuat
  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        // Mengambil full_name dari user_metadata yang kita simpan saat registrasi
        setUserName(data.user.user_metadata.full_name || 'Admin');
      }
    };
    fetchUser();
  }, []);

  // Fungsi untuk logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/'); // Arahkan kembali ke halaman login (sesuaikan path-nya jika perlu)
  };

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <div className="admin-wrapper">
      <aside className={`admin-sidebar ${!isOpen ? 'collapsed' : ''}`}>
        
        <div className="sidebar-header">
           {isOpen && <div className="sidebar-logo">Kopi Ruang</div>}
           <button className="btn btn-sm btn-outline-light" onClick={() => setIsOpen(!isOpen)}>
             {isOpen ? <FaAngleDoubleLeft /> : <FaAngleDoubleRight />}
           </button>
        </div>
        
        <nav className="flex-grow-1">
          <Link to="/admin" className={`nav-link ${isActive('/admin')}`}>
            <FaTachometerAlt /> <span className="nav-text">Dashboard</span>
          </Link>
          <Link to="/admin/pesanan" className={`nav-link ${isActive('/admin/pesanan')}`}>
            <FaCoffee /> <span className="nav-text">Pesanan</span>
          </Link>
          <Link to="/admin/kasir" className={`nav-link ${isActive('/admin/kasir')}`}>
            <FaCashRegister /> <span className="nav-text">Kasir</span>
          </Link>
          <Link to="/admin/pelanggan" className={`nav-link ${isActive('/admin/pelanggan')}`}>
            <FaUsers /> <span className="nav-text">Pelanggan</span>
          </Link>
        </nav>

        <div className="sidebar-footer">
          <div className="d-flex flex-column align-items-center">
            {isOpen && <img src={`https://ui-avatars.com/api/?name=${userName}`} className="profile-img" alt="Profile" />}
            {isOpen && <span className="profile-name mb-2">{userName}</span>}
            <button 
              className="btn btn-sm btn-outline-light w-100 mt-2"
              onClick={handleLogout} // Menjalankan fungsi logout
            >
              <FaSignOutAlt /> {isOpen && " Logout"}
            </button>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <div className="p-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;