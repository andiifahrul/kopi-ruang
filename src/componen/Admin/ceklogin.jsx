// components/AdminGatekeeper.jsx
import { useEffect, useState } from 'react';
import { supabase } from '../../supabase'; // Pastikan path benar
import LoginPage from './login';
import { Outlet, Navigate } from 'react-router-dom';

const AdminGatekeeper = () => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mengecek sesi saat pertama kali dimuat
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Mendengarkan perubahan status login (jika user login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Tampilkan loading agar tidak muncul tampilan kosong sesaat
  if (loading) return <div>Memuat akses...</div>;

  // LOGIKA UTAMA:
  // Jika ada sesi, tampilkan AdminLayout. Jika tidak, tampilkan LoginPage.
 return session ? <Outlet /> : <Navigate to="/login" />;
};

export default AdminGatekeeper;