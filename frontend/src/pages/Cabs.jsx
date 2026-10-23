import { useState, useEffect } from 'react';
import { getCabs } from '../api/cabApi';
import { Car, Phone, Star, MapPin } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Cabs() {
    const [cabs, setCabs] = useState([]);
    const [loading, setLoading] = useState(true);

    const defaultCabs = [
        {
            id: 1,
            vehicleModel: "Toyota Innova Crysta (7-Seater)",
            vehicleType: "SUV / Hill Drive",
            location: "Madikeri & Kushalnagar",
            pricePerDay: 3200,
            rating: 4.9,
            driverName: "Ramesh Appanna",
            driverPhone: "+91 98451 22910",
            imageUrl: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=600"
        },
        {
            id: 2,
            name: "Mahindra Thar 4x4 (Mandalpatti Safari)",
            vehicleModel: "Mahindra Thar 4x4",
            vehicleType: "Off-Road Jeep Safari",
            location: "Mandalpatti Trailhead",
            pricePerDay: 2500,
            rating: 4.95,
            driverName: "Bopanna Offroad",
            driverPhone: "+91 97410 88204",
            imageUrl: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=600"
        },
        {
            id: 3,
            vehicleModel: "Maruti Dzire AC (4-Seater)",
            vehicleType: "Sedan / Family City Cab",
            location: "All Coorg Sightseeing",
            pricePerDay: 2200,
            rating: 4.8,
            driverName: "Suresh Kumar",
            driverPhone: "+91 94480 33819",
            imageUrl: "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&q=80&w=600"
        }
    ];

    useEffect(() => {
        setLoading(true);
        getCabs()
            .then(data => {
                if (data && data.length > 0) setCabs(data);
                else setCabs(defaultCabs);
            })
            .catch(() => setCabs(defaultCabs))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="fade-in" style={{ maxWidth: '1120px', margin: '0 auto' }}>
            <div style={{ marginBottom: '28px' }}>
                <span style={{ fontSize: '12px', fontWeight: '800', color: '#163627', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    PRIVATE TRANSPORT & JEEP SAFARIS
                </span>
                <h1 style={{ fontSize: '34px', color: '#11281D', fontWeight: '800', margin: '4px 0 0 0' }}>
                    Coorg Cabs & 4x4 Off-Road Jeeps
                </h1>
                <p style={{ color: '#4A5B51', fontSize: '15px', marginTop: '4px' }}>
                    Experienced local hill drivers for sightseeing, Mandalpatti safari, and airport transfers.
                </p>
            </div>

            {loading ? <LoadingSpinner /> : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
                    {cabs.map(cab => (
                        <div key={cab.id} className="homestay-card">
                            <div className="homestay-img-box">
                                <img src={cab.imageUrl || defaultCabs[0].imageUrl} alt={cab.vehicleModel} />
                                <div className="homestay-rating-badge">
                                    <Star size={13} fill="#F5B838" color="#F5B838" />
                                    <span>{cab.rating || 4.8}</span>
                                </div>
                            </div>
                            <div className="homestay-body">
                                <span style={{ fontSize: '11px', fontWeight: '800', color: '#D96B43', textTransform: 'uppercase' }}>
                                    {cab.vehicleType}
                                </span>
                                <h3 className="homestay-title" style={{ marginTop: '4px' }}>{cab.vehicleModel}</h3>
                                <div className="homestay-location">
                                    <MapPin size={13} /> {cab.location}
                                </div>
                                <div style={{ fontSize: '13px', color: '#4A5B51', marginBottom: '14px' }}>
                                    Driver: <strong>{cab.driverName}</strong>
                                </div>
                                <div className="homestay-footer">
                                    <div style={{ fontSize: '18px', fontWeight: '800', color: '#163627' }}>
                                        ₹{cab.pricePerDay} <span style={{ fontSize: '12px', color: '#7E9085' }}>/ day</span>
                                    </div>
                                    <a 
                                        href={`tel:${cab.driverPhone}`} 
                                        className="btn-sage"
                                        style={{ padding: '8px 16px', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                                    >
                                        <Phone size={13} /> Call Driver
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
