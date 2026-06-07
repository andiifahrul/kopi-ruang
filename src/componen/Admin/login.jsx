import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabase';

const LoginPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false); // Mode toggle
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (isRegister) {
      // PROSES DAFTAR KE SUPABASE
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name, // Menyimpan nama ke metadata user
          },
        },
      });

      if (error) {
        alert('Gagal Daftar: ' + error.message);
      } else {
        alert('Registrasi berhasil! Silakan login.');
        setIsRegister(false); // Reset ke mode login
      }
    } else {
      // PROSES LOGIN
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        alert('Login Gagal: ' + error.message);
      } else if (data.session) {
        navigate('/admin');
      }
    }
    setLoading(false);
  };

  return (
    <div style={{ 
      backgroundColor: 'var(--kopi-sand)', 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center' 
    }}>
      <div className="card p-4 shadow-lg" style={{ 
        width: '400px', 
        backgroundColor: 'var(--kopi-creamy)', 
        borderRadius: '20px',
        border: 'none'
      }}>
        <h3 className="text-center mb-4" style={{ color: 'var(--kopi-forest)' }}>
          {isRegister ? 'Daftar Akun' : 'Login Admin'}
        </h3>
        
        <form onSubmit={handleAuth}>
          {/* Input Nama hanya muncul saat mode Register */}
          {isRegister && (
            <input 
              type="text" 
              className="form-control mb-3" 
              placeholder="Nama Lengkap" 
              required
              onChange={(e) => setName(e.target.value)} 
            />
          )}

          <input 
            type="email" 
            className="form-control mb-3" 
            placeholder="Email" 
            required
            onChange={(e) => setEmail(e.target.value)} 
          />
          <input 
            type="password" 
            className="form-control mb-4" 
            placeholder="Password" 
            required
            onChange={(e) => setPassword(e.target.value)} 
          />
          
          <button 
            type="submit" 
            className="btn btn-kopi w-100 mb-3"
            disabled={loading}
          >
            {loading ? 'Memproses...' : (isRegister ? 'Daftar' : 'Masuk')}
          </button>
        </form>

        <p className="text-center" style={{ color: 'var(--kopi-forest)', fontSize: '0.9rem' }}>
          {isRegister ? 'Sudah punya akun?' : 'Belum punya akun?'}
          <span 
            onClick={() => setIsRegister(!isRegister)}
            style={{ 
              fontWeight: 'bold', 
              cursor: 'pointer', 
              marginLeft: '5px',
              textDecoration: 'underline' 
            }}
          >
            {isRegister ? 'Login di sini' : 'Daftar sekarang'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;