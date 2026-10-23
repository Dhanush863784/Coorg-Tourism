import { useState, useEffect } from 'react';
import { getTouristPlaces } from '../api/touristPlaceApi';
import { Star, MapPin, Navigation, Clock, Ticket, ExternalLink } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

export default function TouristPlaces() {
    const [places, setPlaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categoryFilter, setCategoryFilter] = useState('ALL');

    const defaultPlaces = [
        {
            id: 1,
            name: "Raja's Seat Sunset Viewpoint",
            category: "VIEWPOINT",
            location: "Madikeri Town",
            entryFee: 25,
            rating: 4.8,
            timings: "06:00 AM - 08:00 PM",
            imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=600",
            description: "A seasonal garden of flowers and artificial fountains offering sweeping panoramic views of the Western Ghats valleys where the kings of Coorg spent evenings."
        },
        {
            id: 2,
            name: "Abbey Falls (Abbi)",
            category: "WATERFALL",
            location: "Madikeri (8 km away)",
            entryFee: 15,
            rating: 4.9,
            timings: "09:00 AM - 05:00 PM",
            imageUrl: "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&q=80&w=600",
            description: "A breathtaking waterfall cascading 70 feet down volcanic rocks nestled inside private spice estates with hanging bridge viewing."
        },
        {
            id: 3,
            name: "Dubare Elephant Camp & River Rafting",
            category: "WILDLIFE",
            location: "Kushalnagar / Cauvery Banks",
            entryFee: 100,
            rating: 4.85,
            timings: "09:00 AM - 11:30 AM",
            imageUrl: "https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&q=80&w=600",
            description: "Interact closely with trained elephants, watch their river bathing rituals, and enjoy tranquil bamboo rafting along the Cauvery River."
        },
        {
            id: 4,
            name: "Namdroling Monastery (Golden Temple)",
            category: "HERITAGE",
            location: "Bylakuppe, Kushalnagar",
            entryFee: 0,
            rating: 4.95,
            timings: "07:00 AM - 06:00 PM",
            imageUrl: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=600",
            description: "The largest teaching center of Nyingma Tibetan Buddhism in the world, renowned for 40-foot gilded golden statues and serene prayer halls."
        },
        {
            id: 5,
            name: "Talacauvery (Origin of River Kaveri)",
            category: "HERITAGE",
            location: "Brahmagiri Hills, Bhagamandala",
            entryFee: 0,
            rating: 4.9,
            timings: "06:00 AM - 06:30 PM",
            imageUrl: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=600",
            description: "Perched at 1,276 meters altitude on the Brahmagiri slopes, the sacred Kundike water spring is the revered birth ground of Mother Cauvery."
        },
        {
            id: 6,
            name: "Mandalpatti Peak Jeep Safari",
            category: "ADVENTURE",
            location: "North Coorg Hills",
            entryFee: 50,
            rating: 4.95,
            timings: "06:00 AM - 05:30 PM",
            imageUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=600",
            description: "A 4x4 off-road jeep thrill climbing misty ridge-lines 4,050 feet above sea level with jaw-dropping sea of clouds views."
        }
    ];

    useEffect(() => {
        setLoading(true);
        getTouristPlaces()
            .then(data => {
                if (data && data.length > 0) setPlaces(data);
                else setPlaces(defaultPlaces);
            })
            .catch(() => setPlaces(defaultPlaces))
            .finally(() => setLoading(false));
    }, []);

    const filtered = categoryFilter === 'ALL' 
        ? places 
        : places.filter(p => p.category?.toUpperCase() === categoryFilter);

    return (
        <div className="fade-in" style={{ maxWidth: '1120px', margin: '0 auto' }}>
            <div style={{ marginBottom: '28px' }}>
                <span style={{ fontSize: '12px', fontWeight: '800', color: '#163627', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    SIGHTSEEING DIRECTORY
                </span>
                <h1 style={{ fontSize: '34px', color: '#11281D', fontWeight: '800', margin: '4px 0 0 0' }}>
                    Top Attractions & Wonders of Coorg
                </h1>
                <p style={{ color: '#4A5B51', fontSize: '15px', marginTop: '4px' }}>
                    All tourist places included automatically in your interactive travel roadmap.
                </p>
            </div>

            {/* Category Filter Pills */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '32px', flexWrap: 'wrap' }}>
                {['ALL', 'WATERFALL', 'VIEWPOINT', 'WILDLIFE', 'HERITAGE', 'ADVENTURE'].map(cat => (
                    <button
                        key={cat}
                        onClick={() => setCategoryFilter(cat)}
                        className={`category-pill ${categoryFilter === cat ? 'active' : ''}`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {loading ? <LoadingSpinner /> : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
                    {filtered.map(place => (
                        <div key={place.id} className="homestay-card">
                            <div className="homestay-img-box">
                                <img src={place.imageUrl || defaultPlaces[0].imageUrl} alt={place.name} />
                                <div className="homestay-rating-badge">
                                    <Star size={13} fill="#F5B838" color="#F5B838" />
                                    <span>{place.rating || 4.8}</span>
                                </div>
                            </div>
                            <div className="homestay-body">
                                <span style={{ fontSize: '11px', fontWeight: '800', color: '#D96B43', textTransform: 'uppercase' }}>
                                    {place.category}
                                </span>
                                <h3 className="homestay-title" style={{ marginTop: '4px' }}>{place.name}</h3>
                                <div className="homestay-location">
                                    <MapPin size={13} /> {place.location}
                                </div>
                                <p className="homestay-desc">{place.description}</p>
                                <div className="homestay-footer">
                                    <div style={{ fontSize: '14px', fontWeight: '700', color: '#11281D' }}>
                                        Ticket: {place.entryFee === 0 ? 'Free Entry' : `₹${place.entryFee}`}
                                    </div>
                                    <a 
                                        href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(place.name + ' Coorg')}`}
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="btn-sage"
                                        style={{ padding: '6px 14px', fontSize: '12px' }}
                                    >
                                        <Navigation size={13} /> Open Maps
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
