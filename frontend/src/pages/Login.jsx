import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../api/authApi';
import ErrorMessage from '../components/ErrorMessage';
import { Lock, Mail, ArrowRight, ShieldCheck, Home, User, CheckCircle2 } from 'lucide-react';

export default function Login() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSuccessfulAuth = (role, email, token) => {
        const cleanRole = role.replace('ROLE_', '');
        localStorage.setItem('token', token);
        
        if (cleanRole === 'ADMIN') {
            navigate('/dashboard/admin');
        } else if (cleanRole === 'OWNER') {
            navigate('/dashboard/owner');
        } else {
            navigate('/dashboard/customer');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const data = await login(form);
            
            if (data?.token && data?.role) {
                handleSuccessfulAuth(data.role, form.email, data.token);
                return;
            }
            throw new Error('Invalid response from server');
        } catch (err) {
            const errMsg = err.response?.data?.message || err.message || 'Invalid email or password';
            setError(errMsg);
        } finally {
            setLoading(false);
        }
    };

    // Quick 1-click login using seeded credentials
    const handleQuickRole = async (role, email) => {
        setForm({ email, password: 'Password123!' });
        setLoading(true);
        setError('');
        try {
            const data = await login({ email, password: 'Password123!' });
            if (data?.token && data?.role) {
                handleSuccessfulAuth(data.role, email, data.token);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Demo login failed. Please register or verify backend is running.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fade-in" style={{ maxWidth: '480px', margin: '40px auto' }}>
            <div style={{
                background: '#fff',
                borderRadius: '32px',
                padding: '40px',
                border: '1px solid rgba(18,40,29,0.08)',
                boxShadow: 'var(--shadow-lg)'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                    <div style={{ width: '52px', height: '52px', background: '#DFECE0', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px auto', fontSize: '24px' }}>
                        🌿
                    </div>
                    <h2 style={{ fontSize: '28px', color: '#11281D', fontWeight: '800', margin: 0 }}>
                        Sign In to Coorg Tourism
                    </h2>
                    <p style={{ color: '#7E9085', fontSize: '14px', marginTop: '4px' }}>
                        Access your traveler pass, manage homestays, or open your profile
                    </p>
                </div>

                <ErrorMessage message={error} />

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div className="planner-input-box">
                        <label>Email Address</label>
                        <input 
                            type="email" 
                            placeholder="traveler@coorg.com or owner@coorg.com"
                            value={form.email} 
                            onChange={e => setForm({...form, email: e.target.value})} 
                            required 
                        />
                    </div>

                    <div className="planner-input-box">
                        <label>Password</label>
                        <input 
                            type="password" 
                            placeholder="••••••••"
                            value={form.password} 
                            onChange={e => setForm({...form, password: e.target.value})} 
                            required 
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading} 
                        className="btn-forest"
                        style={{ width: '100%', padding: '14px', fontSize: '15px', borderRadius: '16px', marginTop: '6px' }}
                    >
                        {loading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>

                {/* Instant 1-Click Role Switcher */}
                <div style={{ marginTop: '28px', paddingTop: '20px', borderTop: '1px solid #EDF3EC' }}>
                    <span style={{ fontSize: '11px', fontWeight: '800', color: '#7E9085', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', textAlign: 'center', marginBottom: '12px' }}>
                        1-Click Demo Login (Instant Access)
                    </span>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                        <button
                            type="button"
                            onClick={() => handleQuickRole('CUSTOMER', 'rahul.traveler@gmail.com')}
                            className="btn-sage"
                            style={{ padding: '10px 4px', fontSize: '11px', flexDirection: 'column', gap: '4px', textAlign: 'center', borderRadius: '14px' }}
                        >
                            <User size={15} /> 🎒 Traveler
                        </button>
                        <button
                            type="button"
                            onClick={() => handleQuickRole('OWNER', 'kariappa.stays@gmail.com')}
                            className="btn-sage"
                            style={{ padding: '10px 4px', fontSize: '11px', flexDirection: 'column', gap: '4px', textAlign: 'center', borderRadius: '14px' }}
                        >
                            <Home size={15} /> 🏡 Owner
                        </button>
                        <button
                            type="button"
                            onClick={() => handleQuickRole('ADMIN', 'admin@coorgtourism.com')}
                            className="btn-sage"
                            style={{ padding: '10px 4px', fontSize: '11px', flexDirection: 'column', gap: '4px', textAlign: 'center', borderRadius: '14px' }}
                        >
                            <ShieldCheck size={15} /> 🛡️ Admin
                        </button>
                    </div>
                </div>

                <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '13px', color: '#7E9085' }}>
                    Don't have an account?{' '}
                    <Link to="/register" style={{ color: '#163627', fontWeight: '700', textDecoration: 'underline' }}>
                        Create an account
                    </Link>
                </div>
            </div>
        </div>
    );
}
