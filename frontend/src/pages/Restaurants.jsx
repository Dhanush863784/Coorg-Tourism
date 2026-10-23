import { useState, useEffect } from 'react';
import { getRestaurants } from '../api/restaurantApi';
import { Star, MapPin, Coffee, Utensils } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Restaurants() {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);

    const defaultRestaurants = [
        {
            id: 1,
            name: "Raintree Heritage Restaurant",
            location: "Madikeri Town (Opp. High School)",
            price: 750,
            rating: 4.8,
            imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=600",
            specialty: "Authentic Pandi Curry, Akki Roti & Filter Kaapi",
            description: "Housed in a century-old traditional estate bungalow serving legendary Coorg delicacies and aromatic estate coffees."
        },
        {
            id: 2,
            name: "Coorg Cuisine Restaurant",
            location: "Stuart Hill, Madikeri",
            price: 500,
            rating: 4.7,
            imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=600",
            specialty: "Bamboo Shoot Curry, Noolputtu & Koli Curry",
            description: "Family-run local specialty dining renowned for seasonal wild bamboo shoots and traditional Kodava spice blends."
        },
        {
            id: 3,
            name: "The Tibetan Kitchen",
            location: "Camp 1, Bylakuppe / Kushalnagar",
            price: 450,
            rating: 4.85,
            imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=600",
            specialty: "Steamed Momos, Thukpa & Butter Tea",
            description: "Authentic Tibetan monastery comfort food freshly prepared by local Himalayan chefs near the Golden Temple."
        }
    ];

    useEffect(() => {
        setLoading(true);
        getRestaurants()
            .then(data => {
                if (data && data.length > 0) setRestaurants(data);
                else setRestaurants(defaultRestaurants);
            })
            .catch(() => setRestaurants(defaultRestaurants))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="fade-in" style={{ maxWidth: '1120px', margin: '0 auto' }}>
            <div style={{ marginBottom: '28px' }}>
                <span style={{ fontSize: '12px', fontWeight: '800', color: '#163627', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    CULINARY & COFFEE HOUSES
                </span>
                <h1 style={{ fontSize: '34px', color: '#11281D', fontWeight: '800', margin: '4px 0 0 0' }}>
                    Authentic Kodava Dining & Cafes
                </h1>
                <p style={{ color: '#4A5B51', fontSize: '15px', marginTop: '4px' }}>
                    Savor fresh Arabica coffee brews, Kodava curries, and Tibetan delicacies in Coorg.
                </p>
            </div>

            {loading ? <LoadingSpinner /> : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
                    {restaurants.map(res => (
                        <div key={res.id} className="homestay-card">
                            <div className="homestay-img-box">
                                <img src={res.imageUrl || defaultRestaurants[0].imageUrl} alt={res.name} />
                                <div className="homestay-rating-badge">
                                    <Star size={13} fill="#F5B838" color="#F5B838" />
                                    <span>{res.rating || 4.8}</span>
                                </div>
                            </div>
                            <div className="homestay-body">
                                <h3 className="homestay-title">{res.name}</h3>
                                <div className="homestay-location">
                                    <MapPin size={13} /> {res.location}
                                </div>
                                <div style={{ background: '#F8FAF8', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: '700', color: '#1B4332', marginBottom: '10px' }}>
                                    🍲 {res.specialty || "Traditional Kodava Specialty"}
                                </div>
                                <p className="homestay-desc">{res.description}</p>
                                <div className="homestay-footer">
                                    <span style={{ fontSize: '16px', fontWeight: '800', color: '#11281D' }}>
                                        ~₹{res.price} <span style={{ fontSize: '12px', color: '#7E9085' }}>for two</span>
                                    </span>
                                    <a 
                                        href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(res.name + ' Coorg')}`}
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="btn-sage"
                                        style={{ padding: '6px 14px', fontSize: '12px' }}
                                    >
                                        Directions →
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
