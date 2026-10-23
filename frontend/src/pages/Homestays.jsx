import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getHomestays } from '../api/homestayApi';
import { Star, MapPin, Search, ArrowRight, Coffee, Wifi, Trees, Shield } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Homestays() {
    const navigate = useNavigate();
    const [homestays, setHomestays] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [maxPrice, setMaxPrice] = useState(6000);

    const fallbackStays = [
        {
            id: 101,
            name: "Misty Woods Coffee Estate Stay",
            location: "Madikeri, Coorg",
            pricePerNight: 1950,
            rating: 4.9,
            imageUrl: "https://images.unsplash.com/photo-1596568359546-24baeb9e2b1e?auto=format&fit=crop&q=80&w=600",
            amenities: ["Estate Walk", "Campfire", "Free Breakfast"],
            description: "Surrounded by 15 acres of Arabica coffee and pepper vines, wake up to misty hill vistas."
        },
        {
            id: 102,
            name: "Silver Brook Heritage Homestay",
            location: "Siddapur Road, Madikeri",
            pricePerNight: 2400,
            rating: 4.8,
            imageUrl: "https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&q=80&w=600",
            amenities: ["River Stream", "Kodava Cuisine", "WiFi"],
            description: "Traditional tiled Kodava bungalow nestled right by a freshwater brook with homemade delights."
        },
        {
            id: 103,
            name: "Cloud Valley Eco Retreat",
            location: "Mandalpatti Foothills, Somwarpet",
            pricePerNight: 2850,
            rating: 4.95,
            imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=600",
            amenities: ["Jeep Safari", "BBQ Nights", "Balcony View"],
            description: "Panoramic cliff views overlooking the Western Ghats with direct jeep safari connectivity."
        },
        {
            id: 104,
            name: "Golden Oak Family Homestay",
            location: "Kushalnagar, Coorg",
            pricePerNight: 1450,
            rating: 4.7,
            imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=600",
            amenities: ["Close to Golden Temple", "AC Rooms", "Free Parking"],
            description: "Cozy budget family stay centrally located near Dubare Elephant Camp and the Tibetan Monastery."
        }
    ];

    useEffect(() => {
        setLoading(true);
        getHomestays()
            .then(data => {
                if (data && data.length > 0) setHomestays(data);
                else setHomestays(fallbackStays);
            })
            .catch(() => setHomestays(fallbackStays))
            .finally(() => setLoading(false));
    }, []);

    const filtered = homestays.filter(s => {
        const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || 
                              s.location.toLowerCase().includes(search.toLowerCase());
        const matchesPrice = (s.pricePerNight || 2000) <= maxPrice;
        return matchesSearch && matchesPrice;
    });

    return (
        <div className="fade-in" style={{ maxWidth: '1120px', margin: '0 auto' }}>
            <div style={{ marginBottom: '28px' }}>
                <span style={{ fontSize: '12px', fontWeight: '800', color: '#D96B43', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    AUTHENTIC COORG STAYS
                </span>
                <h1 style={{ fontSize: '34px', color: '#11281D', fontWeight: '800', margin: '4px 0 0 0' }}>
                    Coffee Plantation Homestays & Heritage Bungalows
                </h1>
                <p style={{ color: '#4A5B51', fontSize: '15px', marginTop: '4px' }}>
                    Filter by price to match your budget and unlock real-time roadmaps across Coorg.
                </p>
            </div>

            {/* Filter Bar */}
            <div style={{ 
                background: '#fff', 
                padding: '20px 24px', 
                borderRadius: '24px', 
                border: '1px solid rgba(18,40,29,0.08)',
                display: 'flex',
                gap: '20px',
                alignItems: 'center',
                flexWrap: 'wrap',
                marginBottom: '32px',
                boxShadow: 'var(--shadow-sm)'
            }}>
                <div style={{ flex: 1, minWidth: '220px', display: 'flex', alignItems: 'center', gap: '10px', background: '#F8FAF8', padding: '10px 16px', borderRadius: '999px', border: '1px solid #E0E8E1' }}>
                    <Search size={16} color="#7E9085" />
                    <input 
                        type="text" 
                        placeholder="Search by location (e.g. Madikeri, Kushalnagar)..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '14px', fontWeight: '600' }}
                    />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '13px', fontWeight: '700', color: '#11281D' }}>Max Price: ₹{maxPrice}</span>
                    <input 
                        type="range" 
                        min="1000" 
                        max="8000" 
                        step="500"
                        value={maxPrice}
                        onChange={e => setMaxPrice(Number(e.target.value))}
                        style={{ accentColor: '#163627', cursor: 'pointer' }}
                    />
                </div>
            </div>

            {loading ? <LoadingSpinner /> : (
                <div className="homestay-cards-grid">
                    {filtered.map(stay => (
                        <div key={stay.id} className="homestay-card">
                            <div className="homestay-img-box">
                                <img src={stay.imageUrl || fallbackStays[0].imageUrl} alt={stay.name} />
                                <div className="homestay-rating-badge">
                                    <Star size={13} fill="#F5B838" color="#F5B838" />
                                    <span>{stay.rating || 4.8}</span>
                                </div>
                            </div>
                            <div className="homestay-body">
                                <h3 className="homestay-title">{stay.name}</h3>
                                <div className="homestay-location">
                                    <MapPin size={13} /> {stay.location}
                                </div>
                                <p className="homestay-desc">{stay.description}</p>
                                <div className="homestay-footer">
                                    <div className="homestay-price-wrap">
                                        <div className="homestay-price-val">₹{stay.pricePerNight}</div>
                                        <div className="homestay-price-unit">per night</div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button 
                                            onClick={() => navigate('/bookings', { state: { serviceId: stay.id, type: 'HOMESTAY', price: stay.pricePerNight, name: stay.name } })}
                                            className="btn-forest"
                                            style={{ padding: '8px 14px', fontSize: '13px' }}
                                        >
                                            Book Now
                                        </button>
                                        <button 
                                            onClick={() => navigate('/trip-planner', { state: { budget: stay.pricePerNight * 3 + 2000, days: 3 } })}
                                            className="btn-sage"
                                            style={{ padding: '8px 12px', fontSize: '12px' }}
                                        >
                                            Plan Itinerary
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
