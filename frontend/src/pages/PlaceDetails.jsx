import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTouristPlaceById } from '../api/touristPlaceApi';
import LoadingSpinner from '../components/LoadingSpinner';
import { Star, MapPin, Navigation, Clock, Ticket, ArrowLeft } from 'lucide-react';

export default function PlaceDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [place, setPlace] = useState(null);
    const [loading, setLoading] = useState(true);

    const defaultPlaces = {
        1: {
            id: 1,
            name: "Raja's Seat Sunset Viewpoint",
            category: "VIEWPOINT",
            location: "Madikeri Town",
            entryFee: 25,
            rating: 4.8,
            timings: "06:00 AM - 08:00 PM",
            imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=800",
            description: "A seasonal garden of flowers and artificial fountains offering sweeping panoramic views of the Western Ghats valleys where the kings of Coorg spent evenings."
        },
        2: {
            id: 2,
            name: "Abbey Falls (Abbi)",
            category: "WATERFALL",
            location: "Madikeri (8 km away)",
            entryFee: 15,
            rating: 4.9,
            timings: "09:00 AM - 05:00 PM",
            imageUrl: "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&q=80&w=800",
            description: "A breathtaking waterfall cascading 70 feet down volcanic rocks nestled inside private spice estates with hanging bridge viewing."
        }
    };

    useEffect(() => {
        setLoading(true);
        getTouristPlaceById(id)
            .then(data => {
                if (data) setPlace(data);
                else setPlace(defaultPlaces[id] || defaultPlaces[1]);
            })
            .catch(() => {
                setPlace(defaultPlaces[id] || defaultPlaces[1]);
            })
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <LoadingSpinner />;
    const item = place || defaultPlaces[1];

    return (
        <div className="fade-in" style={{ maxWidth: '960px', margin: '0 auto' }}>
            <button 
                onClick={() => navigate('/places')}
                className="btn-outline" 
                style={{ marginBottom: '20px', padding: '8px 18px', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
                <ArrowLeft size={15} /> Back to Places
            </button>

            <div className="homestay-card" style={{ borderRadius: '32px', overflow: 'hidden' }}>
                <div style={{ height: '380px', position: 'relative' }}>
                    <img 
                        src={item.imageUrl || defaultPlaces[1].imageUrl} 
                        alt={item.name} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                    <div className="homestay-rating-badge" style={{ top: '20px', right: '20px' }}>
                        <Star size={14} fill="#F5B838" color="#F5B838" />
                        <span>{item.rating || 4.8}</span>
                    </div>
                </div>

                <div style={{ padding: '36px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
                        <div>
                            <span style={{ fontSize: '12px', fontWeight: '800', color: '#D96B43', textTransform: 'uppercase' }}>
                                {item.category || "TOURIST ATTRACTION"}
                            </span>
                            <h1 style={{ fontSize: '32px', color: '#11281D', fontWeight: '800', margin: '4px 0' }}>{item.name}</h1>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#7E9085', fontSize: '14px' }}>
                                <MapPin size={15} /> {item.location}
                            </div>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '24px', fontWeight: '800', color: '#163627' }}>
                                {item.entryFee === 0 ? 'Free Entry' : `₹${item.entryFee}`}
                            </div>
                            <div style={{ fontSize: '13px', color: '#7E9085' }}>Entry Ticket</div>
                        </div>
                    </div>

                    <p style={{ fontSize: '15px', color: '#4A5B51', lineHeight: '1.7', marginBottom: '28px' }}>
                        {item.description}
                    </p>

                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                        <a 
                            href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(item.name + ' Coorg')}`}
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="btn-forest"
                            style={{ padding: '12px 24px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                        >
                            <Navigation size={16} /> Open in Google Maps
                        </a>
                        <button 
                            onClick={() => navigate('/trip-planner', { state: { budget: 7000, days: 3 } })}
                            className="btn-outline"
                            style={{ padding: '12px 24px' }}
                        >
                            Include in Trip Itinerary
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
