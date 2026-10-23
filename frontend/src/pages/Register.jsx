import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser, login } from '../api/authApi';
import ErrorMessage from '../components/ErrorMessage';

export default function Register() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', role: 'CUSTOMER' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await registerUser(form);
            const authData = await login({ email: form.email, password: form.password });
            if (authData?.token) {
                localStorage.setItem('token', authData.token);
                if (form.role === 'OWNER') navigate('/dashboard/owner');
                else navigate('/dashboard/customer');
            } else {
                navigate('/login');
            }
        } catch (err) {
            const msg = err.response?.data?.message || 
                        (typeof err.response?.data === 'object' ? Object.values(err.response.data).join(', ') : null) || 
                        err.message || 'Registration failed';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fade-in" style={{ maxWidth: '520px', margin: '40px auto' }}>
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
                        Create an Account
                    </h2>
                    <p style={{ color: '#7E9085', fontSize: '14px', marginTop: '4px' }}>
                        Join Coorg Tourism as a Traveler or Property / Restaurant Host
                    </p>
                </div>

                <ErrorMessage message={error} />

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {/* Role Selection Pills */}
                    <div>
                        <label style={{ fontSize: '11px', fontWeight: '800', color: '#7E9085', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '8px' }}>
                            I want to join as:
                        </label>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                            <button
                                type="button"
                                onClick={() => setForm({...form, role: 'CUSTOMER'})}
                                style={{
                                    padding: '12px',
                                    borderRadius: '14px',
                                    border: form.role === 'CUSTOMER' ? '2px solid #163627' : '1px solid #E0E8E1',
                                    background: form.role === 'CUSTOMER' ? '#EDF4EE' : '#fff',
                                    fontWeight: '700',
                                    fontSize: '13px',
                                    color: '#11281D',
                                    cursor: 'pointer'
                                }}
                            >
                                🎒 Traveler / Customer
                            </button>
                            <button
                                type="button"
                                onClick={() => setForm({...form, role: 'OWNER'})}
                                style={{
                                    padding: '12px',
                                    borderRadius: '14px',
                                    border: form.role === 'OWNER' ? '2px solid #163627' : '1px solid #E0E8E1',
                                    background: form.role === 'OWNER' ? '#EDF4EE' : '#fff',
                                    fontWeight: '700',
                                    fontSize: '13px',
                                    color: '#11281D',
                                    cursor: 'pointer'
                                }}
                            >
                                🏡 Homestay / Restaurant Host
                            </button>
                        </div>
                    </div>

                    <div className="planner-input-box">
                        <label>Full Name</label>
                        <input 
                            type="text" 
                            placeholder="e.g. Rahul Sharma or Kariappa Bopanna"
                            value={form.name} 
                            onChange={e => setForm({...form, name: e.target.value})} 
                            required 
                        />
                    </div>

                    <div className="planner-input-box">
                        <label>Email Address</label>
                        <input 
                            type="email" 
                            placeholder="you@domain.com"
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

                    <div className="planner-input-box">
                        <label>Phone Number (WhatsApp)</label>
                        <input 
                            type="tel" 
                            placeholder="+91 98765 43210"
                            value={form.phone} 
                            onChange={e => setForm({...form, phone: e.target.value})} 
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading} 
                        className="btn-forest"
                        style={{ width: '100%', padding: '14px', fontSize: '15px', borderRadius: '16px', marginTop: '6px' }}
                    >
                        {loading ? 'Creating Account...' : `Register & Enter as ${form.role === 'OWNER' ? 'Host' : 'Traveler'}`}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '13px', color: '#7E9085' }}>
                    Already have an account?{' '}
                    <Link to="/login" style={{ color: '#163627', fontWeight: '700', textDecoration: 'underline' }}>
                        Sign In
                    </Link>
                </div>
            </div>
        </div>
    );
}
