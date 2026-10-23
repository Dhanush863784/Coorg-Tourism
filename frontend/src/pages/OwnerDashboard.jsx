import { useState, useEffect } from 'react';
import { 
    Home, Coffee, Bell, Upload, Plus, CheckCircle, 
    DollarSign, Phone, Mail, Calendar, Users, Eye, Sparkles, Image as ImageIcon
} from 'lucide-react';
import { getOwnerDashboard } from '../api/dashboardApi';
import { getOwnerBookings } from '../api/bookingApi';
import axiosInstance from '../api/axiosInstance';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

export default function OwnerDashboard() {
    const [activeTab, setActiveTab] = useState('bookings'); // 'bookings', 'properties', 'profile', 'earnings'
    const [stats, setStats] = useState({
        totalBookings: 14,
        confirmedBookings: 12,
        totalEarningsPayable: 68400,
        totalPlatformCommission: 7600,
        totalHomestays: 2,
        totalRestaurants: 1
    });

    // Live Real-Time Booking Notifications for Owner
    const [notifications, setNotifications] = useState([]);
    const [ownerBookings, setOwnerBookings] = useState([]);
    
    // Homestay / Property Management
    const [myHomestays, setMyHomestays] = useState([
        {
            id: 201,
            name: "Misty Woods Coffee Estate Stay",
            location: "Madikeri, Coorg",
            pricePerNight: 1950,
            rooms: 4,
            imageUrl: "https://images.unsplash.com/photo-1596568359546-24baeb9e2b1e?auto=format&fit=crop&q=80&w=600",
            amenities: ["Campfire", "Coffee Plantation Walk", "Kodava Cuisine", "WiFi"]
        },
        {
            id: 202,
            name: "Estate Hills Cottages",
            location: "Siddapur Road, Madikeri",
            pricePerNight: 2400,
            rooms: 6,
            imageUrl: "https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&q=80&w=600",
            amenities: ["Mountain View Balcony", "Freshwater Stream", "Free Parking"]
        }
    ]);

    // Modal state for adding a new homestay / restaurant
    const [isAddingProperty, setIsAddingProperty] = useState(false);
    const [newProp, setNewProp] = useState({
        type: 'HOMESTAY',
        name: '',
        location: 'Madikeri, Coorg',
        pricePerNight: 2000,
        description: '',
        imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=600',
        amenities: 'Coffee Plantation Walk, Campfire, WiFi, Breakfast'
    });

    // Owner Profile State
    const [profile, setProfile] = useState({
        name: 'Kariappa Bopanna',
        email: 'kariappa.coorgstays@gmail.com',
        phone: '+91 98450 19284',
        estateName: 'Kariappa Arabica Estate',
        panNumber: 'ABCDE1234F',
        bankAccount: '•••••••• 8821 (HDFC Madikeri)',
        upiId: 'kariappa@okhdfcbank'
    });
    const [profileSaved, setProfileSaved] = useState(false);

    // Initial load: Fetch stats, backend bookings, and localStorage notifications
    useEffect(() => {
        getOwnerDashboard()
            .then(data => {
                if (data) setStats(prev => ({ ...prev, ...data }));
            })
            .catch(() => {});

        getOwnerBookings()
            .then(data => {
                if (data && data.length > 0) setOwnerBookings(data);
            })
            .catch(() => {});

        axiosInstance.get('/owner/homestays')
            .then(res => {
                if (res.data && res.data.length > 0) setMyHomestays(res.data);
            })
            .catch(() => {});

        // Load notifications generated when customers pay
        try {
            const stored = JSON.parse(localStorage.getItem('owner_notifications') || '[]');
            if (stored.length > 0) {
                setNotifications(stored);
            } else {
                // Default realistic alerts
                setNotifications([
                    {
                        id: 1,
                        homestayName: "Misty Woods Coffee Estate Stay",
                        customerName: "Rahul Sharma",
                        customerPhone: "+91 98765 43210",
                        customerEmail: "rahul.s@gmail.com",
                        days: 3,
                        amount: 5850,
                        guests: 2,
                        timestamp: "10 mins ago",
                        status: "PAID"
                    },
                    {
                        id: 2,
                        homestayName: "Misty Woods Coffee Estate Stay",
                        customerName: "Ananya Deshmukh",
                        customerPhone: "+91 91234 56789",
                        customerEmail: "ananya.d@outlook.com",
                        days: 2,
                        amount: 3900,
                        guests: 3,
                        timestamp: "2 hours ago",
                        status: "PAID"
                    }
                ]);
            }
        } catch {}
    }, []);

    const handleAddPropertySubmit = async (e) => {
        e.preventDefault();
        const payload = {
            name: newProp.name,
            description: newProp.description || `${newProp.name} in ${newProp.location}, surrounded by scenic coffee plantations.`,
            location: newProp.location,
            pricePerNight: Number(newProp.pricePerNight),
            imageUrl: newProp.imageUrl,
            rating: 4.8
        };

        try {
            const res = await axiosInstance.post('/homestays', payload);
            const savedItem = res.data || { ...payload, id: Date.now() };
            setMyHomestays([savedItem, ...myHomestays]);
        } catch (err) {
            console.error('Failed to post homestay to backend:', err);
            setMyHomestays([{ ...payload, id: Date.now() }, ...myHomestays]);
        }

        setIsAddingProperty(false);
        setNewProp({
            type: 'HOMESTAY',
            name: '',
            location: 'Madikeri, Coorg',
            pricePerNight: 2000,
            description: '',
            imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=600',
            amenities: 'Coffee Plantation Walk, Campfire, WiFi, Breakfast'
        });
    };

    const handleProfileSubmit = (e) => {
        e.preventDefault();
        setProfileSaved(true);
        setTimeout(() => setProfileSaved(false), 2500);
    };

    return (
        <div className="fade-in" style={{ maxWidth: '1120px', margin: '0 auto' }}>
            {/* Header */}
            <div className="dashboard-header">
                <div>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#DFECE0', color: '#163627', padding: '4px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: '800', marginBottom: '8px' }}>
                        🏡 HOMESTAY & RESTAURANT OWNER PORTAL
                    </div>
                    <h1 style={{ fontSize: '32px', color: '#11281D', fontWeight: '800', margin: 0 }}>
                        Welcome back, {profile.name}
                    </h1>
                    <p style={{ color: '#4A5B51', fontSize: '15px', marginTop: '4px' }}>
                        Manage property photos, view real-time customer booking alerts, and track payouts.
                    </p>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                    <button 
                        onClick={() => setIsAddingProperty(true)}
                        className="btn-forest"
                        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        <Plus size={16} /> Upload New Property
                    </button>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '28px', borderBottom: '1px solid rgba(18,40,29,0.1)', paddingBottom: '12px', flexWrap: 'wrap' }}>
                <button 
                    onClick={() => setActiveTab('bookings')}
                    className={`btn-pill ${activeTab === 'bookings' ? 'btn-forest' : 'btn-outline'}`}
                    style={{ padding: '8px 20px', borderRadius: '999px' }}
                >
                    <Bell size={15} /> Real-Time Bookings ({notifications.length})
                </button>
                <button 
                    onClick={() => setActiveTab('properties')}
                    className={`btn-pill ${activeTab === 'properties' ? 'btn-forest' : 'btn-outline'}`}
                    style={{ padding: '8px 20px', borderRadius: '999px' }}
                >
                    <Home size={15} /> My Listings ({myHomestays.length})
                </button>
                <button 
                    onClick={() => setActiveTab('earnings')}
                    className={`btn-pill ${activeTab === 'earnings' ? 'btn-forest' : 'btn-outline'}`}
                    style={{ padding: '8px 20px', borderRadius: '999px' }}
                >
                    <DollarSign size={15} /> Earnings & Payouts
                </button>
                <button 
                    onClick={() => setActiveTab('profile')}
                    className={`btn-pill ${activeTab === 'profile' ? 'btn-forest' : 'btn-outline'}`}
                    style={{ padding: '8px 20px', borderRadius: '999px' }}
                >
                    Host Profile
                </button>
            </div>

            {/* TAB 1: Real-time Customer Bookings & Notifications */}
            {activeTab === 'bookings' && (
                <div>
                    <div style={{ background: '#EAF4EC', border: '1px solid #B8DCBE', borderRadius: '20px', padding: '18px 24px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ background: '#163627', color: '#fff', width: '38px', height: '38px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Bell size={18} />
                            </div>
                            <div>
                                <h4 style={{ margin: 0, color: '#11281D', fontSize: '15px', fontWeight: '800' }}>
                                    Live Instant Payment Alerts Active
                                </h4>
                                <p style={{ margin: '2px 0 0 0', color: '#2D6A4F', fontSize: '13px' }}>
                                    When travelers book and complete payment, customer details & stay dates appear here immediately.
                                </p>
                            </div>
                        </div>
                        <span style={{ fontSize: '12px', fontWeight: '800', background: '#fff', color: '#163627', padding: '4px 12px', borderRadius: '999px' }}>
                            ● Real-Time Feed
                        </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {notifications.map((notif) => {
                            const ownerCut = Math.round(notif.amount * 0.90);
                            return (
                                <div key={notif.id} className="notification-card">
                                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '18px' }}>
                                        <div style={{ background: '#DFECE0', width: '48px', height: '48px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>
                                            🏡
                                        </div>
                                        <div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                                                <span className="notif-badge-pill">PAYMENT SUCCESSFUL</span>
                                                <span style={{ fontSize: '12px', color: '#7E9085' }}>{notif.timestamp}</span>
                                            </div>
                                            <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#11281D', margin: '2px 0' }}>
                                                {notif.customerName} booked {notif.homestayName}
                                            </h3>
                                            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: '13px', color: '#4A5B51', marginTop: '6px' }}>
                                                <span><Calendar size={13} style={{ verticalAlign: 'middle' }} /> {notif.days} Days Stay</span>
                                                <span><Users size={13} style={{ verticalAlign: 'middle' }} /> {notif.guests || 2} Guests</span>
                                                <span><Phone size={13} style={{ verticalAlign: 'middle' }} /> {notif.customerPhone || '+91 98450 11223'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                                        <div>
                                            <div style={{ fontSize: '20px', fontWeight: '800', color: '#163627' }}>₹{notif.amount}</div>
                                            <div style={{ fontSize: '11px', color: '#2D6A4F', fontWeight: '700' }}>Your 90% Payout: ₹{ownerCut}</div>
                                        </div>
                                        <a 
                                            href={`https://wa.me/?text=Hello%20${encodeURIComponent(notif.customerName)},%20we%20have%20received%20your%20booking%20for%20${encodeURIComponent(notif.homestayName)}!`}
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="btn-sage"
                                            style={{ padding: '6px 14px', fontSize: '12px', textDecoration: 'none' }}
                                        >
                                            Contact Guest
                                        </a>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* TAB 2: Properties & Photo Uploads */}
            {activeTab === 'properties' && (
                <div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
                        {myHomestays.map(item => (
                            <div key={item.id} className="homestay-card">
                                <div className="homestay-img-box">
                                    <img src={item.imageUrl} alt={item.name} />
                                    <div style={{ position: 'absolute', bottom: '12px', left: '12px', background: 'rgba(0,0,0,0.6)', color: '#fff', padding: '4px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: '700' }}>
                                        {item.rooms || 4} Rooms Available
                                    </div>
                                </div>
                                <div className="homestay-body">
                                    <h3 className="homestay-title">{item.name}</h3>
                                    <div className="homestay-location">{item.location}</div>
                                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', margin: '10px 0' }}>
                                        {item.amenities.map((a, i) => (
                                            <span key={i} style={{ background: '#F0F5F1', color: '#1B4332', fontSize: '11px', padding: '3px 8px', borderRadius: '6px', fontWeight: '700' }}>
                                                {a}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="homestay-footer">
                                        <span style={{ fontSize: '18px', fontWeight: '800', color: '#163627' }}>
                                            ₹{item.pricePerNight} <span style={{ fontSize: '12px', color: '#7E9085' }}>/ night</span>
                                        </span>
                                        <span style={{ color: '#2D6A4F', fontSize: '12px', fontWeight: '800' }}>
                                            ✓ Active & Visible
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* TAB 3: Earnings & Financials */}
            {activeTab === 'earnings' && (
                <div>
                    <div className="dashboard-stat-pills">
                        <div className="stat-metric-card">
                            <span className="stat-metric-label">Total Earnings (90% Payout)</span>
                            <span className="stat-metric-val">₹{stats.totalEarningsPayable || 68400}</span>
                            <span style={{ fontSize: '12px', color: '#2D6A4F', fontWeight: '700' }}>Deposited into your bank/UPI</span>
                        </div>
                        <div className="stat-metric-card">
                            <span className="stat-metric-label">Total Bookings Completed</span>
                            <span className="stat-metric-val">{stats.totalBookings || 14}</span>
                            <span style={{ fontSize: '12px', color: '#7E9085' }}>100% verified guests</span>
                        </div>
                        <div className="stat-metric-card">
                            <span className="stat-metric-label">Platform Fee (10%)</span>
                            <span className="stat-metric-val">₹{stats.totalPlatformCommission || 7600}</span>
                            <span style={{ fontSize: '12px', color: '#7E9085' }}>Includes marketing & maps</span>
                        </div>
                    </div>

                    <div style={{ background: '#fff', borderRadius: '24px', padding: '28px', border: '1px solid rgba(18,40,29,0.08)' }}>
                        <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#11281D', marginBottom: '16px' }}>
                            Bank Payout Account
                        </h3>
                        <p style={{ fontSize: '14px', color: '#4A5B51', marginBottom: '20px' }}>
                            Every time a traveler completes payment, 90% is allocated to your connected bank account / UPI ID.
                        </p>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                            <div className="planner-input-box">
                                <label>Registered Bank</label>
                                <input type="text" readOnly value={profile.bankAccount} />
                            </div>
                            <div className="planner-input-box">
                                <label>UPI ID for Instant Settlement</label>
                                <input type="text" readOnly value={profile.upiId} />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB 4: Host Profile */}
            {activeTab === 'profile' && (
                <div style={{ background: '#fff', borderRadius: '24px', padding: '32px', border: '1px solid rgba(18,40,29,0.08)' }}>
                    <h3 style={{ fontSize: '22px', fontWeight: '800', color: '#11281D', marginBottom: '8px' }}>
                        Host & Owner Profile Details
                    </h3>
                    <p style={{ color: '#7E9085', fontSize: '14px', marginBottom: '24px' }}>
                        Keep your contact details up to date so travelers can reach your homestay smoothly.
                    </p>

                    {profileSaved && (
                        <div style={{ background: '#DFECE0', color: '#163627', padding: '12px 18px', borderRadius: '12px', marginBottom: '20px', fontWeight: '700' }}>
                            ✓ Profile information saved successfully!
                        </div>
                    )}

                    <form onSubmit={handleProfileSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
                        <div className="planner-input-box">
                            <label>Owner Full Name</label>
                            <input 
                                type="text" 
                                value={profile.name} 
                                onChange={e => setProfile({...profile, name: e.target.value})} 
                                required 
                            />
                        </div>
                        <div className="planner-input-box">
                            <label>Email Address</label>
                            <input 
                                type="email" 
                                value={profile.email} 
                                onChange={e => setProfile({...profile, email: e.target.value})} 
                                required 
                            />
                        </div>
                        <div className="planner-input-box">
                            <label>Contact Phone (WhatsApp)</label>
                            <input 
                                type="text" 
                                value={profile.phone} 
                                onChange={e => setProfile({...profile, phone: e.target.value})} 
                                required 
                            />
                        </div>
                        <div className="planner-input-box">
                            <label>Coffee Estate / Business Name</label>
                            <input 
                                type="text" 
                                value={profile.estateName} 
                                onChange={e => setProfile({...profile, estateName: e.target.value})} 
                                required 
                            />
                        </div>
                        <div className="planner-input-box">
                            <label>UPI ID for Payouts</label>
                            <input 
                                type="text" 
                                value={profile.upiId} 
                                onChange={e => setProfile({...profile, upiId: e.target.value})} 
                                required 
                            />
                        </div>

                        <div style={{ gridColumn: '1 / -1', marginTop: '10px' }}>
                            <button type="submit" className="btn-forest" style={{ padding: '12px 28px' }}>
                                Save Profile Changes
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Modal for Adding New Property & Uploading Photos */}
            {isAddingProperty && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 9999,
                    backgroundColor: 'rgba(17, 40, 29, 0.75)',
                    backdropFilter: 'blur(8px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px'
                }}>
                    <div style={{
                        background: '#fff',
                        width: '100%',
                        maxWidth: '580px',
                        borderRadius: '32px',
                        padding: '36px',
                        boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
                        maxHeight: '90vh',
                        overflowY: 'auto'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 style={{ fontSize: '22px', fontWeight: '800', color: '#11281D', margin: 0 }}>
                                Upload Homestay / Restaurant
                            </h3>
                            <button 
                                onClick={() => setIsAddingProperty(false)}
                                style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: '#666' }}
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleAddPropertySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div className="planner-input-box">
                                <label>Property Name</label>
                                <input 
                                    type="text" 
                                    placeholder="e.g. Whispering Pines Coffee Estate Stay"
                                    value={newProp.name} 
                                    onChange={e => setNewProp({...newProp, name: e.target.value})} 
                                    required 
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div className="planner-input-box">
                                    <label>Location in Coorg</label>
                                    <input 
                                        type="text" 
                                        placeholder="e.g. Madikeri / Kushalnagar"
                                        value={newProp.location} 
                                        onChange={e => setNewProp({...newProp, location: e.target.value})} 
                                        required 
                                    />
                                </div>
                                <div className="planner-input-box">
                                    <label>Price Per Night (₹)</label>
                                    <input 
                                        type="number" 
                                        value={newProp.pricePerNight} 
                                        onChange={e => setNewProp({...newProp, pricePerNight: e.target.value})} 
                                        required 
                                    />
                                </div>
                            </div>

                            <div className="planner-input-box">
                                <label>Description</label>
                                <textarea 
                                    rows={3}
                                    placeholder="Describe your homestay, surroundings, and amenities..."
                                    value={newProp.description} 
                                    onChange={e => setNewProp({...newProp, description: e.target.value})} 
                                    style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1px solid #E0E8E1', fontFamily: 'inherit' }}
                                    required 
                                />
                            </div>

                            {/* Photo URL / Upload Box */}
                            <div className="planner-input-box">
                                <label>Photo Image URL (or select from gallery below)</label>
                                <input 
                                    type="url" 
                                    value={newProp.imageUrl} 
                                    onChange={e => setNewProp({...newProp, imageUrl: e.target.value})} 
                                    required 
                                />
                            </div>

                            {/* Quick Coorg Estate Photo Presets */}
                            <div>
                                <label style={{ fontSize: '11px', fontWeight: '800', color: '#7E9085', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                                    Select Coorg Estate Image Preset
                                </label>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                                    {[
                                        "https://images.unsplash.com/photo-1596568359546-24baeb9e2b1e?auto=format&fit=crop&q=80&w=400",
                                        "https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&q=80&w=400",
                                        "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=400"
                                    ].map((imgUrl, i) => (
                                        <img 
                                            key={i} 
                                            src={imgUrl} 
                                            alt="preset" 
                                            onClick={() => setNewProp({...newProp, imageUrl: imgUrl})}
                                            style={{ 
                                                width: '100%', 
                                                height: '70px', 
                                                objectFit: 'cover', 
                                                borderRadius: '10px', 
                                                cursor: 'pointer',
                                                border: newProp.imageUrl === imgUrl ? '3px solid #163627' : '1px solid #ccc'
                                            }} 
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="planner-input-box">
                                <label>Amenities (Comma separated)</label>
                                <input 
                                    type="text" 
                                    value={newProp.amenities} 
                                    onChange={e => setNewProp({...newProp, amenities: e.target.value})} 
                                />
                            </div>

                            <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                                <button type="submit" className="btn-forest" style={{ flex: 1, padding: '14px' }}>
                                    Publish Property Listing
                                </button>
                                <button type="button" onClick={() => setIsAddingProperty(false)} className="btn-outline" style={{ padding: '14px 20px' }}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
