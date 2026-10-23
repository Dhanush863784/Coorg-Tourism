import { Link, useNavigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { Compass, Home, MapPin, Coffee, User, LogOut, ShieldCheck, Sun, UserCheck } from 'lucide-react';

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const token = localStorage.getItem('token');
    let role = null;
    let username = null;

    if (token) {
        try {
            if (token.startsWith('mock.')) {
                const parts = token.split('.');
                if (parts[1]) {
                    const parsed = JSON.parse(atob(parts[1]));
                    role = (parsed.role || 'CUSTOMER').replace('ROLE_', '');
                    username = parsed.sub || 'Traveler';
                }
            } else {
                const decoded = jwtDecode(token);
                role = decoded.role ? decoded.role.replace('ROLE_', '') : null;
                username = decoded.sub || 'Traveler';
            }
        } catch {
            // Clear invalid token so buttons re-appear
            localStorage.removeItem('token');
            role = null;
            username = null;
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <header className="header-nav">
            <Link to="/" className="nav-brand-group">
                <div className="nav-logo-icon">🌿</div>
                <div className="nav-brand-title">
                    Coorg Tourism
                    <span className="nav-brand-subtitle">Scotland of India</span>
                </div>
            </Link>

            <nav className="nav-links-desktop">
                <Link 
                    to="/trip-planner" 
                    className={`nav-link-item ${location.pathname === '/trip-planner' ? 'active' : ''}`}
                >
                    <Compass size={16} /> Budget Planner
                </Link>
                <Link 
                    to="/homestays" 
                    className={`nav-link-item ${location.pathname === '/homestays' ? 'active' : ''}`}
                >
                    <Home size={16} /> Homestays
                </Link>
                <Link 
                    to="/places" 
                    className={`nav-link-item ${location.pathname === '/places' ? 'active' : ''}`}
                >
                    <MapPin size={16} /> Tourist Places
                </Link>
                <Link 
                    to="/restaurants" 
                    className={`nav-link-item ${location.pathname === '/restaurants' ? 'active' : ''}`}
                >
                    <Coffee size={16} /> Dine & Cafes
                </Link>
            </nav>

            <div className="nav-right-actions">
                <div className="weather-badge" title="Live weather in Madikeri, Coorg">
                    <span className="sun-icon">☀️</span>
                    <span>19°C • Mist & Sun</span>
                </div>

                {!token ? (
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <Link 
                            to="/login" 
                            className="btn-outline" 
                            style={{ padding: '8px 20px', fontSize: '13px', borderRadius: '999px', textDecoration: 'none', display: 'inline-block' }}
                        >
                            Log In
                        </Link>
                        <Link 
                            to="/register" 
                            className="btn-forest" 
                            style={{ padding: '8px 20px', fontSize: '13px', borderRadius: '999px', textDecoration: 'none', display: 'inline-block' }}
                        >
                            Sign Up
                        </Link>
                    </div>
                ) : (
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        {role === 'ADMIN' && (
                            <Link to="/dashboard/admin" className="user-pill" style={{ background: '#2D3748', textDecoration: 'none' }}>
                                <ShieldCheck size={14} /> Admin
                            </Link>
                        )}
                        {role === 'OWNER' && (
                            <>
                                <Link to="/dashboard/owner" className="user-pill" style={{ background: '#1A4D2E', textDecoration: 'none' }}>
                                    <Home size={14} /> Owner Portal
                                </Link>
                                <Link to="/profile" className="user-pill" style={{ background: '#2D6A4F', textDecoration: 'none' }}>
                                    <UserCheck size={14} /> Host Profile
                                </Link>
                            </>
                        )}
                        {role === 'CUSTOMER' && (
                            <>
                                <Link to="/dashboard/customer" className="user-pill" style={{ textDecoration: 'none' }}>
                                    <User size={14} /> Trips & Roadmap
                                </Link>
                                <Link to="/profile" className="user-pill" style={{ background: '#1F4A36', textDecoration: 'none' }}>
                                    <UserCheck size={14} /> Profile
                                </Link>
                            </>
                        )}
                        <button 
                            onClick={handleLogout} 
                            className="btn-outline" 
                            style={{ padding: '7px 12px', borderRadius: '50%', cursor: 'pointer' }} 
                            title="Logout"
                        >
                            <LogOut size={15} />
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
}
