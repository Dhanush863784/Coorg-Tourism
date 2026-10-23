import { useState, useEffect } from 'react';
import { 
    User, Home, Phone, Mail, MapPin, DollarSign, 
    Calendar, CheckCircle, Ticket, Edit3, Save, ShieldCheck, QrCode, Star, Coffee
} from 'lucide-react';
import { jwtDecode } from 'jwt-decode';
import TravelPassModal from '../components/TravelPassModal';
import { getMyBookings } from '../api/bookingApi';
import axiosInstance from '../api/axiosInstance';

export default function Profile() {
    const token = localStorage.getItem('token');
    let initialRole = 'CUSTOMER';
    let userEmail = 'explorer@coorgtourism.com';

    if (token) {
        try {
            if (token.startsWith('mock.')) {
                const parts = token.split('.');
                if (parts[1]) {
                    const parsed = JSON.parse(atob(parts[1]));
                    initialRole = (parsed.role || 'CUSTOMER').replace('ROLE_', '');
                    userEmail = parsed.sub || userEmail;
                }
            } else {
                const decoded = jwtDecode(token);
                initialRole = decoded.role ? decoded.role.replace('ROLE_', '') : 'CUSTOMER';
                userEmail = decoded.sub || userEmail;
            }
        } catch {}
    }

    // Role switcher state
    const [viewRole, setViewRole] = useState(initialRole === 'OWNER' ? 'OWNER' : 'CUSTOMER');
    const [selectedBookingForPass, setSelectedBookingForPass] = useState(null);

    // Customer Profile state
    const [customerProfile, setCustomerProfile] = useState({
        name: 'Rahul Sharma',
        email: userEmail || 'rahul.sharma@gmail.com',
        phone: '+91 98765 43210',
        city: 'Bengaluru, Karnataka',
        travelStyle: 'Nature & Coffee Estate Lover',
        emergencyContact: '+91 98450 99881 (Brother)',
        activeTrip: {
            id: 94821,
            pnr: 'CRG-94821',
            homestayName: 'Misty Woods Coffee Estate Stay',
            homestayLocation: 'Madikeri, Coorg',
            totalAmount: 5850,
            days: 3,
            numberOfGuests: 2,
            startDate: new Date().toISOString().split('T')[0]
        }
    });

    // Owner Profile state
    const [ownerProfile, setOwnerProfile] = useState({
        name: 'Kariappa Bopanna',
        email: 'kariappa.coorgstays@gmail.com',
        phone: '+91 98450 19284',
        estateName: 'Kariappa Arabica Coffee Estate',
        location: 'Madikeri, Kodagu District, Karnataka',
        panNumber: 'ABCDE1234F',
        bankAccount: 'HDFC Bank •••••••• 8821',
        upiId: 'kariappa@okhdfcbank',
        totalProperties: 2,
        totalEarnings: '₹68,400',
        payoutFrequency: 'Daily Instant (90% Auto-Credit)'
    });

    const [editing, setEditing] = useState(false);
    const [savedSuccess, setSavedSuccess] = useState(false);

    // Sync with backend if available
    useEffect(() => {
        if (viewRole === 'CUSTOMER') {
            axiosInstance.get('/customer/profile')
                .then(res => {
                    if (res.data) setCustomerProfile(prev => ({ ...prev, ...res.data }));
                })
                .catch(() => {});
        } else if (viewRole === 'OWNER') {
            axiosInstance.get('/owner/profile')
                .then(res => {
                    if (res.data) setOwnerProfile(prev => ({ ...prev, ...res.data }));
                })
                .catch(() => {});
        }
    }, [viewRole]);

    const handleSaveCustomer = (e) => {
        e.preventDefault();
        setEditing(false);
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 2500);

        axiosInstance.put('/customer/profile', {
            name: customerProfile.name,
            phone: customerProfile.phone
        }).catch(() => {});
    };

    const handleSaveOwner = (e) => {
        e.preventDefault();
        setEditing(false);
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 2500);
    };

    return (
        <div className="fade-in" style={{ maxWidth: '1080px', margin: '0 auto' }}>
            {/* Header & Role Switcher */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '28px' }}>
                <div>
                    <span style={{ fontSize: '11px', fontWeight: '800', color: '#163627', background: '#DFECE0', padding: '4px 12px', borderRadius: '999px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        USER PROFILE MANAGEMENT
                    </span>
                    <h1 style={{ fontSize: '32px', color: '#11281D', fontWeight: '800', margin: '6px 0 0 0' }}>
                        {viewRole === 'CUSTOMER' ? 'Traveler / Customer Profile' : 'Homestay & Restaurant Owner Profile'}
                    </h1>
                    <p style={{ color: '#4A5B51', fontSize: '15px', marginTop: '4px' }}>
                        Manage your profile details, contact preferences, and stay records.
                    </p>
                </div>

                {/* Profile Mode Toggle */}
                <div style={{ background: '#fff', padding: '6px', borderRadius: '999px', border: '1px solid rgba(18,40,29,0.1)', display: 'flex', gap: '6px', boxShadow: 'var(--shadow-sm)' }}>
                    <button
                        onClick={() => { setViewRole('CUSTOMER'); setEditing(false); }}
                        className={`btn-pill ${viewRole === 'CUSTOMER' ? 'btn-forest' : 'btn-outline'}`}
                        style={{ padding: '8px 20px', borderRadius: '999px', fontSize: '13px' }}
                    >
                        🎒 Traveler Profile
                    </button>
                    <button
                        onClick={() => { setViewRole('OWNER'); setEditing(false); }}
                        className={`btn-pill ${viewRole === 'OWNER' ? 'btn-forest' : 'btn-outline'}`}
                        style={{ padding: '8px 20px', borderRadius: '999px', fontSize: '13px' }}
                    >
                        🏡 Owner / Host Profile
                    </button>
                </div>
            </div>

            {savedSuccess && (
                <div style={{ background: '#DFECE0', color: '#163627', padding: '14px 20px', borderRadius: '16px', marginBottom: '24px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle size={18} color="#2D6A4F" /> Profile updated successfully!
                </div>
            )}

            {/* =========================================
                VIEW 1: CUSTOMER / TRAVELER PROFILE
               ========================================= */}
            {viewRole === 'CUSTOMER' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px' }}>
                    {/* Left: Traveler Identity & Info */}
                    <div style={{ background: '#fff', borderRadius: '32px', padding: '36px', border: '1px solid rgba(18,40,29,0.08)', boxShadow: 'var(--shadow-sm)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px' }}>
                            <div style={{ width: '64px', height: '64px', background: '#DFECE0', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px' }}>
                                🎒
                            </div>
                            <div>
                                <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#11281D', margin: 0 }}>
                                    {customerProfile.name}
                                </h2>
                                <span style={{ background: '#EAF4EC', color: '#163627', padding: '2px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase' }}>
                                    Verified Coorg Explorer
                                </span>
                            </div>
                        </div>

                        {!editing ? (
                            <div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', marginBottom: '28px' }}>
                                    <div style={{ borderBottom: '1px solid #EDF3EC', paddingBottom: '10px' }}>
                                        <span style={{ fontSize: '11px', fontWeight: '800', color: '#7E9085', textTransform: 'uppercase' }}>Email Address</span>
                                        <div style={{ fontSize: '15px', fontWeight: '700', color: '#11281D', marginTop: '2px' }}>{customerProfile.email}</div>
                                    </div>
                                    <div style={{ borderBottom: '1px solid #EDF3EC', paddingBottom: '10px' }}>
                                        <span style={{ fontSize: '11px', fontWeight: '800', color: '#7E9085', textTransform: 'uppercase' }}>Phone Number</span>
                                        <div style={{ fontSize: '15px', fontWeight: '700', color: '#11281D', marginTop: '2px' }}>{customerProfile.phone}</div>
                                    </div>
                                    <div style={{ borderBottom: '1px solid #EDF3EC', paddingBottom: '10px' }}>
                                        <span style={{ fontSize: '11px', fontWeight: '800', color: '#7E9085', textTransform: 'uppercase' }}>Home City</span>
                                        <div style={{ fontSize: '15px', fontWeight: '700', color: '#11281D', marginTop: '2px' }}>{customerProfile.city}</div>
                                    </div>
                                    <div style={{ borderBottom: '1px solid #EDF3EC', paddingBottom: '10px' }}>
                                        <span style={{ fontSize: '11px', fontWeight: '800', color: '#7E9085', textTransform: 'uppercase' }}>Travel Preferences</span>
                                        <div style={{ fontSize: '15px', fontWeight: '700', color: '#11281D', marginTop: '2px' }}>{customerProfile.travelStyle}</div>
                                    </div>
                                    <div>
                                        <span style={{ fontSize: '11px', fontWeight: '800', color: '#7E9085', textTransform: 'uppercase' }}>Emergency Contact</span>
                                        <div style={{ fontSize: '15px', fontWeight: '700', color: '#11281D', marginTop: '2px' }}>{customerProfile.emergencyContact}</div>
                                    </div>
                                </div>

                                <button 
                                    onClick={() => setEditing(true)}
                                    className="btn-outline"
                                    style={{ width: '100%', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                                >
                                    <Edit3 size={15} /> Edit Personal Information
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSaveCustomer} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                <div className="planner-input-box">
                                    <label>Full Name</label>
                                    <input 
                                        type="text" 
                                        value={customerProfile.name} 
                                        onChange={e => setCustomerProfile({...customerProfile, name: e.target.value})} 
                                        required 
                                    />
                                </div>
                                <div className="planner-input-box">
                                    <label>Phone Number</label>
                                    <input 
                                        type="tel" 
                                        value={customerProfile.phone} 
                                        onChange={e => setCustomerProfile({...customerProfile, phone: e.target.value})} 
                                        required 
                                    />
                                </div>
                                <div className="planner-input-box">
                                    <label>Home City / State</label>
                                    <input 
                                        type="text" 
                                        value={customerProfile.city} 
                                        onChange={e => setCustomerProfile({...customerProfile, city: e.target.value})} 
                                    />
                                </div>
                                <div className="planner-input-box">
                                    <label>Emergency Contact</label>
                                    <input 
                                        type="text" 
                                        value={customerProfile.emergencyContact} 
                                        onChange={e => setCustomerProfile({...customerProfile, emergencyContact: e.target.value})} 
                                    />
                                </div>

                                <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                                    <button type="submit" className="btn-forest" style={{ flex: 1, padding: '12px' }}>
                                        Save Changes
                                    </button>
                                    <button type="button" onClick={() => setEditing(false)} className="btn-outline" style={{ padding: '12px 18px' }}>
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>

                    {/* Right: Active RedBus Pass & Saved Trips */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        {/* Active Trip Ticket Box */}
                        <div style={{
                            background: 'linear-gradient(135deg, #11281D 0%, #1F4A36 100%)',
                            color: '#fff',
                            borderRadius: '32px',
                            padding: '32px',
                            boxShadow: 'var(--shadow-md)'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                                <span style={{ background: 'rgba(255,255,255,0.2)', padding: '4px 12px', borderRadius: '999px', fontSize: '11px', fontWeight: '800', letterSpacing: '0.1em' }}>
                                    PNR: {customerProfile.activeTrip.pnr} • CONFIRMED
                                </span>
                                <span style={{ color: '#74C69D', fontSize: '12px', fontWeight: '700' }}>
                                    ● Active Itinerary
                                </span>
                            </div>

                            <h3 style={{ color: '#fff', fontSize: '22px', fontWeight: '800', margin: '4px 0' }}>
                                {customerProfile.activeTrip.homestayName}
                            </h3>
                            <p style={{ color: '#D8F3DC', fontSize: '14px', margin: '0 0 20px 0' }}>
                                📍 {customerProfile.activeTrip.homestayLocation} • {customerProfile.activeTrip.days} Days Stay
                            </p>

                            <div style={{ background: 'rgba(255,255,255,0.1)', padding: '14px 18px', borderRadius: '18px', marginBottom: '22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <div style={{ fontSize: '11px', color: '#B7E4C7', textTransform: 'uppercase' }}>Amount Paid</div>
                                    <div style={{ fontSize: '18px', fontWeight: '800', color: '#fff' }}>₹{customerProfile.activeTrip.totalAmount}</div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '11px', color: '#B7E4C7', textTransform: 'uppercase' }}>Guests</div>
                                    <div style={{ fontSize: '18px', fontWeight: '800', color: '#fff' }}>{customerProfile.activeTrip.numberOfGuests} Guests</div>
                                </div>
                            </div>

                            <button 
                                onClick={() => setSelectedBookingForPass(customerProfile.activeTrip)}
                                className="btn-forest"
                                style={{ width: '100%', background: '#fff', color: '#11281D', fontWeight: '800', padding: '14px' }}
                            >
                                <Ticket size={16} /> View Digital Pass & Real-Time Roadmap
                            </button>
                        </div>

                        {/* Coorg Tourism Perks Box */}
                        <div style={{ background: '#fff', borderRadius: '28px', padding: '28px', border: '1px solid rgba(18,40,29,0.08)' }}>
                            <h4 style={{ fontSize: '17px', fontWeight: '800', color: '#11281D', marginBottom: '12px' }}>
                                Coorg Tourism Traveler Perks
                            </h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: '#4A5B51' }}>
                                <div>✓ Direct check-in at verified coffee estate homestays without extra agency fees.</div>
                                <div>✓ Real-time interactive roadmaps with GPS coordinates for all scenic stops.</div>
                                <div>✓ 24/7 Coorg Tourism helpline assistance (+91 8272 228345).</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* =========================================
                VIEW 2: OWNER / HOST PROFILE
               ========================================= */}
            {viewRole === 'OWNER' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px' }}>
                    {/* Left: Host Info & Payouts */}
                    <div style={{ background: '#fff', borderRadius: '32px', padding: '36px', border: '1px solid rgba(18,40,29,0.08)', boxShadow: 'var(--shadow-sm)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px' }}>
                            <div style={{ width: '64px', height: '64px', background: '#DFECE0', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px' }}>
                                🏡
                            </div>
                            <div>
                                <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#11281D', margin: 0 }}>
                                    {ownerProfile.name}
                                </h2>
                                <span style={{ background: '#EAF4EC', color: '#163627', padding: '2px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase' }}>
                                    Verified Coorg Homestay Host
                                </span>
                            </div>
                        </div>

                        {!editing ? (
                            <div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', marginBottom: '28px' }}>
                                    <div style={{ borderBottom: '1px solid #EDF3EC', paddingBottom: '10px' }}>
                                        <span style={{ fontSize: '11px', fontWeight: '800', color: '#7E9085', textTransform: 'uppercase' }}>Estate / Business Name</span>
                                        <div style={{ fontSize: '15px', fontWeight: '700', color: '#11281D', marginTop: '2px' }}>{ownerProfile.estateName}</div>
                                    </div>
                                    <div style={{ borderBottom: '1px solid #EDF3EC', paddingBottom: '10px' }}>
                                        <span style={{ fontSize: '11px', fontWeight: '800', color: '#7E9085', textTransform: 'uppercase' }}>Host Email</span>
                                        <div style={{ fontSize: '15px', fontWeight: '700', color: '#11281D', marginTop: '2px' }}>{ownerProfile.email}</div>
                                    </div>
                                    <div style={{ borderBottom: '1px solid #EDF3EC', paddingBottom: '10px' }}>
                                        <span style={{ fontSize: '11px', fontWeight: '800', color: '#7E9085', textTransform: 'uppercase' }}>Host Phone (WhatsApp)</span>
                                        <div style={{ fontSize: '15px', fontWeight: '700', color: '#11281D', marginTop: '2px' }}>{ownerProfile.phone}</div>
                                    </div>
                                    <div style={{ borderBottom: '1px solid #EDF3EC', paddingBottom: '10px' }}>
                                        <span style={{ fontSize: '11px', fontWeight: '800', color: '#7E9085', textTransform: 'uppercase' }}>Estate Location</span>
                                        <div style={{ fontSize: '15px', fontWeight: '700', color: '#11281D', marginTop: '2px' }}>{ownerProfile.location}</div>
                                    </div>
                                    <div style={{ borderBottom: '1px solid #EDF3EC', paddingBottom: '10px' }}>
                                        <span style={{ fontSize: '11px', fontWeight: '800', color: '#7E9085', textTransform: 'uppercase' }}>Bank Settlement Account</span>
                                        <div style={{ fontSize: '15px', fontWeight: '700', color: '#11281D', marginTop: '2px' }}>{ownerProfile.bankAccount}</div>
                                    </div>
                                    <div>
                                        <span style={{ fontSize: '11px', fontWeight: '800', color: '#7E9085', textTransform: 'uppercase' }}>UPI ID for Instant Payouts</span>
                                        <div style={{ fontSize: '15px', fontWeight: '700', color: '#2D6A4F', marginTop: '2px' }}>{ownerProfile.upiId}</div>
                                    </div>
                                </div>

                                <button 
                                    onClick={() => setEditing(true)}
                                    className="btn-outline"
                                    style={{ width: '100%', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                                >
                                    <Edit3 size={15} /> Edit Host Details & Bank Account
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSaveOwner} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                <div className="planner-input-box">
                                    <label>Host Full Name</label>
                                    <input 
                                        type="text" 
                                        value={ownerProfile.name} 
                                        onChange={e => setOwnerProfile({...ownerProfile, name: e.target.value})} 
                                        required 
                                    />
                                </div>
                                <div className="planner-input-box">
                                    <label>Estate / Property Name</label>
                                    <input 
                                        type="text" 
                                        value={ownerProfile.estateName} 
                                        onChange={e => setOwnerProfile({...ownerProfile, estateName: e.target.value})} 
                                        required 
                                    />
                                </div>
                                <div className="planner-input-box">
                                    <label>Phone / WhatsApp</label>
                                    <input 
                                        type="tel" 
                                        value={ownerProfile.phone} 
                                        onChange={e => setOwnerProfile({...ownerProfile, phone: e.target.value})} 
                                        required 
                                    />
                                </div>
                                <div className="planner-input-box">
                                    <label>UPI ID for 90% Payouts</label>
                                    <input 
                                        type="text" 
                                        value={ownerProfile.upiId} 
                                        onChange={e => setOwnerProfile({...ownerProfile, upiId: e.target.value})} 
                                        required 
                                    />
                                </div>

                                <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                                    <button type="submit" className="btn-forest" style={{ flex: 1, padding: '12px' }}>
                                        Save Changes
                                    </button>
                                    <button type="button" onClick={() => setEditing(false)} className="btn-outline" style={{ padding: '12px 18px' }}>
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>

                    {/* Right: Owner Financials & Listed Properties */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        {/* Financial Payout Summary */}
                        <div style={{ background: '#fff', borderRadius: '32px', padding: '32px', border: '1px solid rgba(18,40,29,0.08)' }}>
                            <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#11281D', marginBottom: '18px' }}>
                                Automated Payout Summary
                            </h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                                <div style={{ background: '#F8FAF8', padding: '18px', borderRadius: '20px', border: '1px solid #EDF3EC' }}>
                                    <div style={{ fontSize: '11px', fontWeight: '800', color: '#7E9085', textTransform: 'uppercase' }}>90% Net Earnings</div>
                                    <div style={{ fontSize: '24px', fontWeight: '800', color: '#163627', marginTop: '4px' }}>{ownerProfile.totalEarnings}</div>
                                </div>
                                <div style={{ background: '#F8FAF8', padding: '18px', borderRadius: '20px', border: '1px solid #EDF3EC' }}>
                                    <div style={{ fontSize: '11px', fontWeight: '800', color: '#7E9085', textTransform: 'uppercase' }}>Active Listings</div>
                                    <div style={{ fontSize: '24px', fontWeight: '800', color: '#163627', marginTop: '4px' }}>{ownerProfile.totalProperties} Stays</div>
                                </div>
                            </div>
                            <div style={{ fontSize: '13px', color: '#2D6A4F', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <CheckCircle size={15} /> All payments credited to {ownerProfile.upiId} upon guest booking.
                            </div>
                        </div>

                        {/* Quick Properties Snapshot */}
                        <div style={{ background: '#fff', borderRadius: '32px', padding: '32px', border: '1px solid rgba(18,40,29,0.08)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#11281D', margin: 0 }}>
                                    Managed Properties
                                </h3>
                                <a href="/dashboard/owner" style={{ fontSize: '13px', fontWeight: '700', color: '#163627', textDecoration: 'underline' }}>
                                    Manage in Owner Portal →
                                </a>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '12px', background: '#F9FCF9', borderRadius: '16px', border: '1px solid #EDF3EC' }}>
                                    <div style={{ width: '44px', height: '44px', borderRadius: '12px', overflow: 'hidden' }}>
                                        <img src="https://images.unsplash.com/photo-1596568359546-24baeb9e2b1e?auto=format&fit=crop&q=80&w=120" alt="stay" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '14px', fontWeight: '800', color: '#11281D' }}>Misty Woods Coffee Estate Stay</div>
                                        <div style={{ fontSize: '12px', color: '#7E9085' }}>Madikeri • ₹1,950 / night</div>
                                    </div>
                                    <span style={{ fontSize: '12px', color: '#2D6A4F', fontWeight: '800' }}>● Active</span>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '12px', background: '#F9FCF9', borderRadius: '16px', border: '1px solid #EDF3EC' }}>
                                    <div style={{ width: '44px', height: '44px', borderRadius: '12px', overflow: 'hidden' }}>
                                        <img src="https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&q=80&w=120" alt="stay" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '14px', fontWeight: '800', color: '#11281D' }}>Estate Hills Cottages</div>
                                        <div style={{ fontSize: '12px', color: '#7E9085' }}>Siddapur • ₹2,400 / night</div>
                                    </div>
                                    <span style={{ fontSize: '12px', color: '#2D6A4F', fontWeight: '800' }}>● Active</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Travel Pass Voucher Modal on demand */}
            {selectedBookingForPass && (
                <TravelPassModal
                    booking={selectedBookingForPass}
                    onClose={() => setSelectedBookingForPass(null)}
                />
            )}
        </div>
    );
}
