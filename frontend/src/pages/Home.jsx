import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
    Compass, Sparkles, MapPin, Star, ArrowRight, Calendar, 
    DollarSign, Heart, ChevronRight, Trees, Coffee, Waves, Mountain
} from 'lucide-react';
import { jwtDecode } from 'jwt-decode';

export default function Home() {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    let userName = 'Explorer';
    if (token) {
        try {
            const decoded = jwtDecode(token);
            userName = (decoded.sub || 'Traveler').split('@')[0];
            userName = userName.charAt(0).toUpperCase() + userName.slice(1);
        } catch {}
    }

    // Quick Budget & Duration Widget state
    const [quickBudget, setQuickBudget] = useState(7000);
    const [quickDays, setQuickDays] = useState(3);
    const [activeCategory, setActiveCategory] = useState('ALL');

    const handleStartTrip = () => {
        navigate('/trip-planner', { state: { budget: quickBudget, days: quickDays } });
    };

    const categories = [
        { id: 'ALL', label: 'All Experiences', icon: '🌿' },
        { id: 'TREK', label: 'Hiking & Treks', icon: '🥾' },
        { id: 'WATER', label: 'Waterfalls', icon: '🌊' },
        { id: 'COFFEE', label: 'Coffee Trails', icon: '☕' },
        { id: 'STAY', label: 'Homestays', icon: '🏡' },
        { id: 'WILD', label: 'Elephant Camp', icon: '🐘' },
    ];

    const popularCards = [
        {
            id: 1,
            title: "Misty Woods Coffee Estate Stay",
            location: "Madikeri, Coorg",
            price: "₹1,950 / night",
            rating: "4.9",
            days: "3 days",
            distance: "12 km from town",
            image: "https://images.unsplash.com/photo-1596568359546-24baeb9e2b1e?auto=format&fit=crop&q=80&w=600",
            category: "HOMESTAY"
        },
        {
            id: 2,
            title: "Abbey Cascading Falls & Raja's Seat",
            location: "Madikeri Hills",
            price: "₹25 Entry",
            rating: "4.8",
            days: "Full Day",
            distance: "8.4 km route",
            image: "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&q=80&w=600",
            category: "NATURE"
        },
        {
            id: 3,
            title: "Dubare River Camp & Bamboo Island",
            location: "Cauvery Riverbanks",
            price: "₹100 Rafting",
            rating: "4.9",
            days: "2 days",
            distance: "29 km route",
            image: "https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&q=80&w=600",
            category: "WILDLIFE"
        }
    ];

    return (
        <div className="fade-in">
            {/* Top Greeting Bar (Match Reference: "Hi, Morgan 👋" + Weather pill) */}
            <div className="hero-greeting-bar">
                <div className="hero-user-greet">
                    <h2>Hi, {userName} 👋</h2>
                    <p>Where in the misty hills of Coorg would you like to escape today?</p>
                </div>

                <div className="weather-badge">
                    <span className="sun-icon">☀️</span>
                    <span>Weather 19°C • Pleasant Mist</span>
                </div>
            </div>

            {/* Category Pills (Match Reference: Pill tags with icons) */}
            <div className="category-pills-row">
                {categories.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`category-pill ${activeCategory === cat.id ? 'active' : ''}`}
                    >
                        <span>{cat.icon}</span>
                        <span>{cat.label}</span>
                    </button>
                ))}
            </div>

            {/* Dribbble Style Hero Main Showcase Card */}
            <div className="nature-showcase-card">
                <div className="nature-showcase-badge">
                    🌲 KARNATAKA • SCOTLAND OF INDIA
                </div>

                <div className="nature-showcase-content">
                    <h1>The Sounds of Nature</h1>
                    <p>
                        A real adventure where misty coffee peaks, cascading waterfalls, and authentic Kodava homestays reveal their purest grandeur.
                    </p>

                    <div className="nature-showcase-meta">
                        <div className="showcase-stat-chip">
                            <Calendar size={14} /> 3 to 5 Days
                        </div>
                        <div className="showcase-stat-chip">
                            <MapPin size={14} /> 18 km Scenic Trail
                        </div>
                        <div className="showcase-stat-chip">
                            <Star size={14} fill="#F5B838" color="#F5B838" /> 4.9 / 5 Rating
                        </div>

                        <button 
                            onClick={handleStartTrip}
                            className="btn-forest"
                            style={{ background: '#fff', color: '#11281D', fontWeight: '800', marginLeft: 'auto' }}
                        >
                            Start Trip by Budget <ArrowRight size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Interactive Instant Budget Widget on Home */}
            <div className="planner-widget-container" style={{ marginTop: '36px' }}>
                <div className="planner-header">
                    <div>
                        <span style={{ fontSize: '11px', fontWeight: '800', color: '#D96B43', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                            SMART COORG PLANNER
                        </span>
                        <h3 style={{ marginTop: '4px' }}>Enter Your Budget to Match a Homestay & Real-Time Roadmap</h3>
                        <p>Tell us what you plan to spend (e.g. ₹6,000, ₹8,000) and how many days you'll stay.</p>
                    </div>

                    <div className="budget-presets-row">
                        {[5000, 6000, 8000, 10000, 12000].map(amt => (
                            <button
                                key={amt}
                                type="button"
                                className={`budget-preset-btn ${quickBudget === amt ? 'active' : ''}`}
                                onClick={() => setQuickBudget(amt)}
                            >
                                ₹{(amt / 1000)}k
                            </button>
                        ))}
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', alignItems: 'center' }}>
                    <div className="planner-input-box">
                        <label>Your Budget (₹)</label>
                        <input
                            type="number"
                            min="3000"
                            step="500"
                            value={quickBudget}
                            onChange={e => setQuickBudget(Number(e.target.value) || 3000)}
                        />
                    </div>

                    <div className="planner-input-box">
                        <label>Days in Coorg</label>
                        <select value={quickDays} onChange={e => setQuickDays(Number(e.target.value))}>
                            <option value={1}>1 Day (Sightseeing)</option>
                            <option value={2}>2 Days / 1 Night</option>
                            <option value={3}>3 Days / 2 Nights</option>
                            <option value={4}>4 Days / 3 Nights</option>
                            <option value={5}>5 Days / 4 Nights</option>
                        </select>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <button 
                            onClick={handleStartTrip} 
                            className="btn-forest"
                            style={{ height: '62px', fontSize: '16px', borderRadius: '22px' }}
                        >
                            Find Homestay & Roadmap <ArrowRight size={18} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Popular Experiences & Homestays Grid */}
            <div style={{ marginTop: '56px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <div>
                        <h2 style={{ fontSize: '28px', color: '#11281D', fontWeight: '800' }}>
                            Popular in Coorg
                        </h2>
                        <p style={{ color: '#7E9085', fontSize: '14px', marginTop: '2px' }}>
                            Top-rated plantation estates & scenic heritage wonders
                        </p>
                    </div>
                    <Link to="/homestays" className="btn-outline" style={{ fontSize: '13px', padding: '8px 18px' }}>
                        View All <ChevronRight size={14} />
                    </Link>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
                    {popularCards.map(item => (
                        <div 
                            key={item.id} 
                            className="homestay-card"
                            onClick={() => navigate('/trip-planner', { state: { budget: 7500, days: 3 } })}
                            style={{ cursor: 'pointer' }}
                        >
                            <div className="homestay-img-box">
                                <img src={item.image} alt={item.title} />
                                <div className="homestay-rating-badge">
                                    <Star size={13} fill="#F5B838" color="#F5B838" />
                                    <span>{item.rating}</span>
                                </div>
                            </div>
                            <div className="homestay-body">
                                <h3 className="homestay-title">{item.title}</h3>
                                <div className="homestay-location">
                                    <MapPin size={13} /> {item.location} • {item.distance}
                                </div>
                                <div className="homestay-footer">
                                    <span style={{ fontSize: '16px', fontWeight: '800', color: '#163627' }}>
                                        {item.price}
                                    </span>
                                    <span className="btn-sage" style={{ padding: '6px 14px', fontSize: '12px' }}>
                                        View Details →
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
