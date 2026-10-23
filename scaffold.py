import os

base_dir = r"E:\Coorg Tourisim\frontend"
src_dir = os.path.join(base_dir, "src")

files_to_create = {
    # ROOT
    "vite.config.js": """import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
})
""",

    # SRC
    "src/main.jsx": """import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/global.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
""",
    "src/App.jsx": """import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import TouristPlaces from './pages/TouristPlaces';
import Restaurants from './pages/Restaurants';
import Homestays from './pages/Homestays';
import Cabs from './pages/Cabs';
import PlaceDetails from './pages/PlaceDetails';
import HomestayDetails from './pages/HomestayDetails';
import BookingPage from './pages/BookingPage';
import MyBookings from './pages/MyBookings';
import TripPlanner from './pages/TripPlanner';
import MyTrips from './pages/MyTrips';
import Profile from './pages/Profile';
import CustomerDashboard from './pages/CustomerDashboard';
import OwnerDashboard from './pages/OwnerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/places" element={<TouristPlaces />} />
            <Route path="/places/:id" element={<PlaceDetails />} />
            <Route path="/restaurants" element={<Restaurants />} />
            <Route path="/homestays" element={<Homestays />} />
            <Route path="/homestays/:id" element={<HomestayDetails />} />
            <Route path="/cabs" element={<Cabs />} />
            
            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/bookings" element={<BookingPage />} />
              <Route path="/my-bookings" element={<MyBookings />} />
              <Route path="/trip-planner" element={<TripPlanner />} />
              <Route path="/my-trips" element={<MyTrips />} />
              <Route path="/profile" element={<Profile />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['CUSTOMER']} />}>
              <Route path="/dashboard/customer" element={<CustomerDashboard />} />
            </Route>
            
            <Route element={<ProtectedRoute allowedRoles={['OWNER']} />}>
              <Route path="/dashboard/owner" element={<OwnerDashboard />} />
            </Route>
            
            <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
              <Route path="/dashboard/admin" element={<AdminDashboard />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App;
""",

    # API
    "src/api/axiosInstance.js": """import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8089/api',
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default axiosInstance;
""",
    "src/api/authApi.js": """import axiosInstance from './axiosInstance';

export const login = async (credentials) => {
    const response = await axiosInstance.post('/auth/login', credentials);
    return response.data;
};

export const registerUser = async (userData) => {
    const response = await axiosInstance.post('/auth/register', userData);
    return response.data;
};
""",
    "src/api/dashboardApi.js": """import axiosInstance from './axiosInstance';

export const getCustomerDashboard = async () => {
    const response = await axiosInstance.get('/customer/dashboard');
    return response.data;
};

export const getOwnerDashboard = async () => {
    const response = await axiosInstance.get('/owner/dashboard');
    return response.data;
};

export const getAdminDashboard = async () => {
    const response = await axiosInstance.get('/admin/dashboard');
    return response.data;
};
""",
    "src/api/touristPlaceApi.js": """import axiosInstance from './axiosInstance';

export const getTouristPlaces = async (params) => {
    const response = await axiosInstance.get('/tourist-places', { params });
    return response.data;
};

export const getTouristPlaceById = async (id) => {
    const response = await axiosInstance.get(`/tourist-places/${id}`);
    return response.data;
};
""",
    "src/api/restaurantApi.js": """import axiosInstance from './axiosInstance';

export const getRestaurants = async (params) => {
    const response = await axiosInstance.get('/restaurants', { params });
    return response.data;
};
""",
    "src/api/homestayApi.js": """import axiosInstance from './axiosInstance';

export const getHomestays = async (params) => {
    const response = await axiosInstance.get('/homestays', { params });
    return response.data;
};
export const getHomestayById = async (id) => {
    const response = await axiosInstance.get(`/homestays/${id}`);
    return response.data;
};
""",
    "src/api/cabApi.js": """import axiosInstance from './axiosInstance';

export const getCabs = async (params) => {
    const response = await axiosInstance.get('/cabs', { params });
    return response.data;
};
""",
    "src/api/bookingApi.js": """import axiosInstance from './axiosInstance';

export const createBooking = async (data) => {
    const response = await axiosInstance.post('/bookings', data);
    return response.data;
};
export const getMyBookings = async () => {
    const response = await axiosInstance.get('/customer/bookings');
    return response.data;
};
""",
    "src/api/tripApi.js": """import axiosInstance from './axiosInstance';

export const generateTrip = async (data) => {
    const response = await axiosInstance.post('/trips/generate', data);
    return response.data;
};
export const getMyTrips = async () => {
    const response = await axiosInstance.get('/customer/trips');
    return response.data;
};
""",
    "src/api/reviewApi.js": """import axiosInstance from './axiosInstance';

export const getReviews = async (type, id) => {
    const response = await axiosInstance.get(`/reviews/${type}/${id}`);
    return response.data;
};
export const createReview = async (data) => {
    const response = await axiosInstance.post(`/reviews`, data);
    return response.data;
};
""",
    # COMPONENTS
    "src/components/ProtectedRoute.jsx": """import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = ({ allowedRoles }) => {
    const token = localStorage.getItem('token');
    
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    try {
        const decoded = jwtDecode(token);
        
        // Example JWT structure may have roles as a string or array.
        // Assuming your backend sends role as a simple string or array in the token.
        const userRole = decoded.role || (decoded.roles && decoded.roles.length > 0 ? decoded.roles[0].authority : null);
        
        // Remove 'ROLE_' prefix if present
        const cleanRole = typeof userRole === 'string' ? userRole.replace('ROLE_', '') : 'CUSTOMER';

        if (allowedRoles && !allowedRoles.includes(cleanRole)) {
            // Role not allowed
            if (cleanRole === 'ADMIN') return <Navigate to="/dashboard/admin" replace />;
            if (cleanRole === 'OWNER') return <Navigate to="/dashboard/owner" replace />;
            return <Navigate to="/dashboard/customer" replace />;
        }

        return <Outlet />;
    } catch (e) {
        localStorage.removeItem('token');
        return <Navigate to="/login" replace />;
    }
};

export default ProtectedRoute;
""",
    "src/components/LoadingSpinner.jsx": """export default function LoadingSpinner() {
    return (
        <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading...</p>
        </div>
    );
}
""",
    "src/components/ErrorMessage.jsx": """export default function ErrorMessage({ message }) {
    if (!message) return null;
    return (
        <div className="error-message">
            {message}
        </div>
    );
}
""",
    "src/components/Navbar.jsx": """import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import '../styles/navbar.css';

export default function Navbar() {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    let role = null;
    let name = null;

    if (token) {
        try {
            const decoded = jwtDecode(token);
            role = decoded.role ? decoded.role.replace('ROLE_', '') : null;
            name = decoded.sub; // or whatever subject is
        } catch (e) {
            // invalid token
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <nav className="navbar">
            <div className="nav-brand">
                <Link to="/">Coorg Tourism</Link>
            </div>
            <div className="nav-links">
                <Link to="/places">Places</Link>
                <Link to="/homestays">Homestays</Link>
                <Link to="/restaurants">Restaurants</Link>
                <Link to="/cabs">Cabs</Link>
                
                {!token ? (
                    <>
                        <Link to="/login" className="btn-secondary">Login</Link>
                        <Link to="/register" className="btn-primary">Sign Up</Link>
                    </>
                ) : (
                    <>
                        {role === 'ADMIN' && <Link to="/dashboard/admin">Admin Dashboard</Link>}
                        {role === 'OWNER' && <Link to="/dashboard/owner">Owner Dashboard</Link>}
                        {role === 'CUSTOMER' && <Link to="/dashboard/customer">Dashboard</Link>}
                        <button onClick={handleLogout} className="btn-logout">Logout</button>
                    </>
                )}
            </div>
        </nav>
    );
}
""",
    "src/components/Footer.jsx": """export default function Footer() {
    return (
        <footer className="footer">
            <p>&copy; 2026 Coorg Tourism. All rights reserved.</p>
        </footer>
    );
}
""",
    "src/components/ServiceCard.jsx": """import { Link } from 'react-router-dom';
import '../styles/cards.css';

export default function ServiceCard({ title, subtitle, image, link, price, rating }) {
    return (
        <div className="service-card">
            {image && <img src={image} alt={title} className="service-img" />}
            <div className="service-info">
                <h3>{title}</h3>
                <p className="subtitle">{subtitle}</p>
                <div className="service-meta">
                    {price && <span className="price">₹{price}</span>}
                    {rating && <span className="rating">⭐ {rating}</span>}
                </div>
                <Link to={link} className="btn-view">View Details</Link>
            </div>
        </div>
    );
}
""",
    
    # PAGES
    "src/pages/Home.jsx": """import { Link } from 'react-router-dom';
import '../styles/home.css';

export default function Home() {
    return (
        <div className="home-page">
            <div className="hero-section">
                <div className="hero-content">
                    <h1>Discover the Beauty of Coorg</h1>
                    <p>Experience nature, coffee plantations, and premium homestays.</p>
                    <div className="hero-actions">
                        <Link to="/places" className="btn-primary">Explore Places</Link>
                        <Link to="/trip-planner" className="btn-secondary">Plan a Trip</Link>
                    </div>
                </div>
            </div>
            
            <section className="featured-section">
                <h2>Quick Links</h2>
                <div className="quick-links">
                    <Link to="/homestays" className="quick-card">Homestays</Link>
                    <Link to="/restaurants" className="quick-card">Restaurants</Link>
                    <Link to="/cabs" className="quick-card">Cabs</Link>
                </div>
            </section>
        </div>
    );
}
""",
    "src/pages/NotFound.jsx": """export default function NotFound() {
    return (
        <div style={{textAlign: 'center', padding: '50px'}}>
            <h2>404 - Page Not Found</h2>
            <p>The requested page does not exist.</p>
        </div>
    );
}
""",
    "src/pages/Login.jsx": """import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/authApi';
import ErrorMessage from '../components/ErrorMessage';
import '../styles/forms.css';

export default function Login() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = await login(form);
            localStorage.setItem('token', data.accessToken);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-container">
            <h2>Login</h2>
            <ErrorMessage message={error} />
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Email</label>
                    <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
                </div>
                <button type="submit" disabled={loading} className="btn-primary">
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>
        </div>
    );
}
""",
    "src/pages/Register.jsx": """import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../api/authApi';
import ErrorMessage from '../components/ErrorMessage';
import '../styles/forms.css';

export default function Register() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', role: 'CUSTOMER' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await registerUser(form);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-container">
            <h2>Register</h2>
            <ErrorMessage message={error} />
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Name</label>
                    <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
                </div>
                <div className="form-group">
                    <label>Email</label>
                    <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
                </div>
                <div className="form-group">
                    <label>Phone</label>
                    <input type="text" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
                </div>
                <div className="form-group">
                    <label>Role</label>
                    <select value={form.role} onChange={e => setForm({...form, role: e.target.value})}>
                        <option value="CUSTOMER">Customer</option>
                        <option value="OWNER">Owner</option>
                    </select>
                </div>
                <button type="submit" disabled={loading} className="btn-primary">
                    {loading ? 'Registering...' : 'Register'}
                </button>
            </form>
        </div>
    );
}
""",
    # STYLES
    "src/styles/global.css": """
:root {
    --primary: #2d5a27; /* Forest Green */
    --secondary: #d4a373; /* Coffee Brown / Warm Cream */
    --bg-light: #fefae0;
    --text-main: #333;
    --text-light: #fff;
    --border-radius: 12px;
}
body {
    margin: 0;
    font-family: 'Inter', sans-serif;
    background-color: var(--bg-light);
    color: var(--text-main);
}
a {
    text-decoration: none;
    color: inherit;
}
.app-container {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}
.main-content {
    flex: 1;
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
    box-sizing: border-box;
}
.btn-primary, .btn-secondary, .btn-logout, button {
    padding: 10px 20px;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.2s ease;
}
.btn-primary {
    background-color: var(--primary);
    color: white;
}
.btn-primary:hover {
    background-color: #1e3d1a;
}
.btn-secondary {
    background-color: var(--secondary);
    color: white;
}
.btn-logout {
    background-color: #e63946;
    color: white;
}
.error-message {
    color: #e63946;
    background-color: #ffeef0;
    padding: 10px;
    border-radius: 4px;
    margin-bottom: 15px;
    border: 1px solid #ffccd5;
}
.loading-container {
    text-align: center;
    padding: 40px;
}
.spinner {
    border: 4px solid #f3f3f3;
    border-top: 4px solid var(--primary);
    border-radius: 50%;
    width: 30px;
    height: 30px;
    animation: spin 1s linear infinite;
    margin: 0 auto;
}
@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
.footer {
    background-color: #222;
    color: white;
    text-align: center;
    padding: 20px;
    margin-top: auto;
}
""",
    "src/styles/navbar.css": """
.navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 40px;
    background-color: white;
    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}
.nav-brand {
    font-size: 24px;
    font-weight: 700;
    color: var(--primary);
}
.nav-links {
    display: flex;
    gap: 20px;
    align-items: center;
}
@media (max-width: 768px) {
    .navbar {
        flex-direction: column;
        gap: 15px;
        padding: 15px;
    }
    .nav-links {
        flex-wrap: wrap;
        justify-content: center;
    }
}
""",
    "src/styles/home.css": """
.hero-section {
    background: linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('https://images.unsplash.com/photo-1596568359546-24baeb9e2b1e?auto=format&fit=crop&q=80') center/cover;
    height: 500px;
    border-radius: var(--border-radius);
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    color: white;
    margin-bottom: 40px;
}
.hero-content h1 {
    font-size: 48px;
    margin-bottom: 10px;
}
.hero-actions {
    margin-top: 30px;
    display: flex;
    gap: 20px;
    justify-content: center;
}
.quick-links {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
}
.quick-card {
    flex: 1;
    min-width: 200px;
    padding: 30px;
    background-color: white;
    border-radius: var(--border-radius);
    text-align: center;
    font-weight: 600;
    box-shadow: 0 4px 6px rgba(0,0,0,0.05);
    transition: transform 0.2s;
    color: var(--primary);
}
.quick-card:hover {
    transform: translateY(-5px);
}
""",
    "src/styles/forms.css": """
.form-container {
    max-width: 400px;
    margin: 40px auto;
    padding: 30px;
    background: white;
    border-radius: var(--border-radius);
    box-shadow: 0 4px 15px rgba(0,0,0,0.05);
}
.form-group {
    margin-bottom: 20px;
}
.form-group label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
}
.form-group input, .form-group select {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 6px;
    box-sizing: border-box;
}
.form-container button {
    width: 100%;
    margin-top: 10px;
}
""",
    "src/styles/dashboard.css": """
.dashboard-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
    margin-bottom: 40px;
}
.stat-card {
    background: white;
    padding: 20px;
    border-radius: var(--border-radius);
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    text-align: center;
}
.stat-value {
    font-size: 32px;
    font-weight: bold;
    color: var(--primary);
}
.dashboard-section {
    margin-bottom: 40px;
    background: white;
    padding: 20px;
    border-radius: var(--border-radius);
}
""",
    "src/styles/cards.css": """
.service-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;
}
.service-card {
    background: white;
    border-radius: var(--border-radius);
    overflow: hidden;
    box-shadow: 0 4px 10px rgba(0,0,0,0.05);
    display: flex;
    flex-direction: column;
}
.service-img {
    width: 100%;
    height: 180px;
    object-fit: cover;
}
.service-info {
    padding: 20px;
    display: flex;
    flex-direction: column;
    flex: 1;
}
.service-meta {
    display: flex;
    justify-content: space-between;
    margin-top: auto;
    margin-bottom: 15px;
    font-weight: 600;
}
"""
}

# The remaining placeholder pages
placeholder_pages = [
    "TouristPlaces", "Restaurants", "Homestays", "Cabs", "PlaceDetails", 
    "HomestayDetails", "BookingPage", "MyBookings", "TripPlanner", 
    "MyTrips", "Profile", "CustomerDashboard", "OwnerDashboard", "AdminDashboard"
]

for page in placeholder_pages:
    files_to_create[f"src/pages/{page}.jsx"] = f"""import React from 'react';
import LoadingSpinner from '../components/LoadingSpinner';

export default function {page}() {{
    return (
        <div>
            <h2>{page}</h2>
            <p>This section is under construction.</p>
        </div>
    );
}}
"""

for filepath, content in files_to_create.items():
    full_path = os.path.join(base_dir, filepath)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, "w", encoding="utf-8") as f:
        f.write(content)

print("Scaffold complete!")
