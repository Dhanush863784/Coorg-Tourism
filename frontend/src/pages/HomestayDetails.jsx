import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getHomestayById } from '../api/homestayApi';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { Star, MapPin, ArrowRight, ShieldCheck, Phone, Check } from 'lucide-react';

export default function HomestayDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [homestay, setHomestay] = useState(null);
    const [loading, setLoading] = useState(true);

    const fallbackStays = {
        101: {
            id: 101,
            name: "Misty Woods Coffee Estate Stay",
            location: "Madikeri, Coorg",
            pricePerNight: 1950,
            rating: 4.9,
            imageUrl: "https://images.unsplash.com/photo-1596568359546-24baeb9e2b1e?auto=format&fit=crop&q=80&w=800",
            amenities: ["Plantation Walk", "Campfire", "Kodava Cuisine", "WiFi"],
            description: "Surrounded by 15 acres of Arabica coffee and pepper vines, wake up to cascading mist and birdsong."
        },
        102: {
            id: 102,
            name: "Silver Brook Heritage Homestay",
            location: "Siddapur Road, Madikeri",
            pricePerNight: 2400,
            rating: 4.8,
            imageUrl: "https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&q=80&w=800",
            amenities: ["River Stream", "Kodava Meals", "Pet Friendly", "Estate Treks"],
            description: "An authentic Kodava tiled bungalow alongside a perennial freshwater stream with home-cooked Coorg delicacies."
        }
    };

    useEffect(() => {
        setLoading(true);
        getHomestayById(id)
            .then(data => {
                if (data) setHomestay(data);
                else setHomestay(fallbackStays[id] || fallbackStays[101]);
            })
            .catch(() => {
                setHomestay(fallbackStays[id] || fallbackStays[101]);
            })
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <LoadingSpinner />;
    const stay = homestay || fallbackStays[101];

    return (
        <div className="fade-in" style={{ maxWidth: '960px', margin: '0 auto' }}>
            <div className="homestay-card" style={{ borderRadius: '32px', overflow: 'hidden' }}>
                <div style={{ height: '380px', position: 'relative' }}>
                    <img 
                        src={stay.imageUrl || fallbackStays[101].imageUrl} 
                        alt={stay.name} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                    <div className="homestay-rating-badge" style={{ top: '20px', right: '20px' }}>
                        <Star size={14} fill="#F5B838" color="#F5B838" />
                        <span>{stay.rating || 4.9}</span>
                    </div>
                </div>

                <div style={{ padding: '36px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
                        <div>
                            <span style={{ fontSize: '12px', fontWeight: '800', color: '#D96B43', textTransform: 'uppercase' }}>
                                COORG HOMESTAY
                            </span>
                            <h1 style={{ fontSize: '32px', color: '#11281D', fontWeight: '800', margin: '4px 0' }}>{stay.name}</h1>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#7E9085', fontSize: '14px' }}>
                                <MapPin size={15} /> {stay.location}
                            </div>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '28px', fontWeight: '800', color: '#163627' }}>
                                ₹{stay.pricePerNight}
                            </div>
                            <div style={{ fontSize: '13px', color: '#7E9085' }}>per night (taxes included)</div>
                        </div>
                    </div>

                    <p style={{ fontSize: '15px', color: '#4A5B51', lineHeight: '1.7', marginBottom: '28px' }}>
                        {stay.description}
                    </p>

                    <div style={{
                        background: '#F8FAF8',
                        borderRadius: '24px',
                        padding: '24px',
                        border: '1px solid rgba(18,40,29,0.08)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '16px'
                    }}>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#11281D' }}>
                                Plan & Book with Budget Itinerary
                            </h3>
                            <p style={{ margin: '4px 0 0 0', color: '#7E9085', fontSize: '13px' }}>
                                Generates a complete RedBus-style roadmap with this stay as your base camp.
                            </p>
                        </div>

                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                            <button 
                                onClick={() => navigate('/bookings', { state: { serviceId: stay.id, type: 'HOMESTAY', price: stay.pricePerNight, name: stay.name } })}
                                className="btn-forest"
                                style={{ padding: '12px 24px', fontSize: '15px' }}
                            >
                                Book Stay Now
                            </button>
                            <button 
                                onClick={() => navigate('/trip-planner', { state: { budget: stay.pricePerNight * 3 + 2000, days: 3 } })}
                                className="btn-outline"
                                style={{ padding: '12px 20px', fontSize: '14px' }}
                            >
                                Plan Roadmap <ArrowRight size={15} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
