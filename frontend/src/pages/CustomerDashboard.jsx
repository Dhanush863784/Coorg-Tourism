import { useState, useEffect } from 'react';
import { 
    User, Calendar, MapPin, DollarSign, ShieldCheck, 
    Compass, Ticket, Phone, Download, Eye, Clock, CheckCircle
} from 'lucide-react';
import { getMyBookings } from '../api/bookingApi';
import { getMyPayments } from '../api/paymentApi';
import TravelPassModal from '../components/TravelPassModal';
import CoorgMapRoadmap from '../components/CoorgMapRoadmap';
import { jwtDecode } from 'jwt-decode';

export default function CustomerDashboard() {
    const token = localStorage.getItem('token');
    let decodedName = 'Traveler';
    let decodedEmail = 'explorer@coorgtourism.com';

    if (token) {
        try {
            const decoded = jwtDecode(token);
            decodedEmail = decoded.sub || decodedEmail;
            decodedName = decodedEmail.split('@')[0];
            decodedName = decodedName.charAt(0).toUpperCase() + decodedName.slice(1);
        } catch {}
    }

    const [activeTab, setActiveTab] = useState('active_pass'); // 'active_pass', 'bookings', 'profile'
    const [selectedBookingForPass, setSelectedBookingForPass] = useState(null);

    // Profile details
    const [profile, setProfile] = useState({
        name: decodedName,
        email: decodedEmail,
        phone: '+91 98765 43210',
        city: 'Bengaluru, Karnataka',
        travelStyle: 'Nature & Coffee Explorer'
    });
    const [savedNotice, setSavedNotice] = useState(false);

    // Active trip mock / backend loaded
    const [activeTrip, setActiveTrip] = useState({
        id: 94821,
        pnr: 'CRG-94821',
        homestayName: 'Misty Woods Coffee Estate Stay',
        homestayLocation: 'Madikeri, Coorg',
        totalAmount: 5850,
        days: 3,
        numberOfGuests: 2,
        startDate: new Date().toISOString().split('T')[0],
        status: 'CONFIRMED'
    });

    const [pastBookings, setPastBookings] = useState([
        {
            id: 94821,
            pnr: 'CRG-94821',
            serviceName: 'Misty Woods Coffee Estate Stay',
            dates: '3 Days / 2 Nights',
            amount: 5850,
            status: 'CONFIRMED',
            date: 'Upcoming'
        },
        {
            id: 88102,
            pnr: 'CRG-88102',
            serviceName: 'Dubare Elephant River Camp Stay',
            dates: '2 Days / 1 Night',
            amount: 4200,
            status: 'COMPLETED',
            date: 'March 2026'
        }
    ]);

    useEffect(() => {
        getMyBookings()
            .then(data => {
                if (data && data.length > 0) {
                    setPastBookings(data);
                    setActiveTrip(data[0]);
                }
            })
            .catch(() => {});
    }, []);

    const handleProfileSave = (e) => {
        e.preventDefault();
        setSavedNotice(true);
        setTimeout(() => setSavedNotice(false), 2000);
    };

    return (
        <div className="fade-in" style={{ maxWidth: '1120px', margin: '0 auto' }}>
            {/* Header */}
            <div className="dashboard-header">
                <div>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#DFECE0', color: '#163627', padding: '4px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: '800', marginBottom: '8px' }}>
                        🎒 TRAVELER PORTAL
                    </div>
                    <h1 style={{ fontSize: '32px', color: '#11281D', fontWeight: '800', margin: 0 }}>
                        Welcome back, {profile.name}
                    </h1>
                    <p style={{ color: '#4A5B51', fontSize: '15px', marginTop: '4px' }}>
                        Access your active real-time Coorg itinerary, download your digital travel pass, and view receipts.
                    </p>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                    <button 
                        onClick={() => setSelectedBookingForPass(activeTrip)}
                        className="btn-forest"
                        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        <Ticket size={16} /> Open RedBus Travel Pass
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '28px', borderBottom: '1px solid rgba(18,40,29,0.1)', paddingBottom: '12px' }}>
                <button 
                    onClick={() => setActiveTab('active_pass')}
                    className={`btn-pill ${activeTab === 'active_pass' ? 'btn-forest' : 'btn-outline'}`}
                    style={{ padding: '8px 20px', borderRadius: '999px' }}
                >
                    <Compass size={15} /> Active Trip & Live Roadmap
                </button>
                <button 
                    onClick={() => setActiveTab('bookings')}
                    className={`btn-pill ${activeTab === 'bookings' ? 'btn-forest' : 'btn-outline'}`}
                    style={{ padding: '8px 20px', borderRadius: '999px' }}
                >
                    <Clock size={15} /> Booking Receipts ({pastBookings.length})
                </button>
                <button 
                    onClick={() => setActiveTab('profile')}
                    className={`btn-pill ${activeTab === 'profile' ? 'btn-forest' : 'btn-outline'}`}
                    style={{ padding: '8px 20px', borderRadius: '999px' }}
                >
                    <User size={15} /> My Profile
                </button>
            </div>

            {/* TAB 1: Active Trip & Real-Time Roadmap */}
            {activeTab === 'active_pass' && (
                <div>
                    {/* Active Ticket Banner */}
                    <div style={{
                        background: 'linear-gradient(135deg, #11281D 0%, #1E4633 100%)',
                        color: '#fff',
                        borderRadius: '24px',
                        padding: '28px 32px',
                        marginBottom: '32px',
                        boxShadow: 'var(--shadow-md)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '20px'
                    }}>
                        <div>
                            <span style={{ background: 'rgba(255,255,255,0.2)', padding: '4px 12px', borderRadius: '999px', fontSize: '11px', fontWeight: '800', letterSpacing: '0.1em' }}>
                                PNR: {activeTrip.pnr} • CONFIRMED
                            </span>
                            <h2 style={{ color: '#fff', fontSize: '26px', margin: '10px 0 4px 0', fontWeight: '800' }}>
                                {activeTrip.homestayName}
                            </h2>
                            <p style={{ color: '#D8F3DC', fontSize: '14px', margin: 0 }}>
                                📍 {activeTrip.homestayLocation} • {activeTrip.days} Days Stay ({activeTrip.numberOfGuests} Guests)
                            </p>
                        </div>

                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button 
                                onClick={() => setSelectedBookingForPass(activeTrip)}
                                className="btn-forest"
                                style={{ background: '#fff', color: '#11281D', fontWeight: '800' }}
                            >
                                <Eye size={15} /> View Full Travel Pass & QR
                            </button>
                        </div>
                    </div>

                    {/* Integrated Real-Time Leaflet Roadmap */}
                    <div style={{ marginBottom: '24px' }}>
                        <h3 style={{ fontSize: '22px', fontWeight: '800', color: '#11281D', marginBottom: '14px' }}>
                            Live Tourist Roadmap from {activeTrip.homestayName}
                        </h3>
                        <CoorgMapRoadmap 
                            homestayName={activeTrip.homestayName}
                            homestayLocation={activeTrip.homestayLocation}
                        />
                    </div>
                </div>
            )}

            {/* TAB 2: Bookings History */}
            {activeTab === 'bookings' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {pastBookings.map(b => (
                        <div key={b.id} style={{
                            background: '#fff',
                            borderRadius: '20px',
                            border: '1px solid rgba(18,40,29,0.08)',
                            padding: '24px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: '16px'
                        }}>
                            <div>
                                <span style={{ background: '#E8F3EB', color: '#163627', padding: '3px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: '800' }}>
                                    PNR: {b.pnr || `CRG-${b.id}`}
                                </span>
                                <h4 style={{ fontSize: '18px', fontWeight: '800', color: '#11281D', margin: '8px 0 4px 0' }}>
                                    {b.serviceName || b.homestayName}
                                </h4>
                                <div style={{ fontSize: '13px', color: '#7E9085' }}>
                                    {b.dates || `${b.startDate} to ${b.endDate}`}
                                </div>
                            </div>

                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '22px', fontWeight: '800', color: '#163627' }}>
                                    ₹{b.totalAmount || b.amount}
                                </div>
                                <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                                    <button 
                                        onClick={() => setSelectedBookingForPass(b)}
                                        className="btn-sage"
                                        style={{ padding: '6px 14px', fontSize: '12px' }}
                                    >
                                        View Travel Pass
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* TAB 3: Customer Profile */}
            {activeTab === 'profile' && (
                <div style={{ background: '#fff', borderRadius: '24px', padding: '32px', border: '1px solid rgba(18,40,29,0.08)' }}>
                    <h3 style={{ fontSize: '22px', fontWeight: '800', color: '#11281D', marginBottom: '8px' }}>
                        Customer Profile Settings
                    </h3>
                    <p style={{ color: '#7E9085', fontSize: '14px', marginBottom: '24px' }}>
                        Manage your traveler details and emergency contact preferences.
                    </p>

                    {savedNotice && (
                        <div style={{ background: '#DFECE0', color: '#163627', padding: '12px 18px', borderRadius: '12px', marginBottom: '20px', fontWeight: '700' }}>
                            ✓ Profile saved successfully!
                        </div>
                    )}

                    <form onSubmit={handleProfileSave} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
                        <div className="planner-input-box">
                            <label>Full Name</label>
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
                            <label>Mobile Number (for SMS Passes)</label>
                            <input 
                                type="text" 
                                value={profile.phone} 
                                onChange={e => setProfile({...profile, phone: e.target.value})} 
                                required 
                            />
                        </div>
                        <div className="planner-input-box">
                            <label>Home City / State</label>
                            <input 
                                type="text" 
                                value={profile.city} 
                                onChange={e => setProfile({...profile, city: e.target.value})} 
                            />
                        </div>

                        <div style={{ gridColumn: '1 / -1', marginTop: '10px' }}>
                            <button type="submit" className="btn-forest" style={{ padding: '12px 28px' }}>
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Travel Pass Voucher Modal */}
            {selectedBookingForPass && (
                <TravelPassModal
                    booking={selectedBookingForPass}
                    onClose={() => setSelectedBookingForPass(null)}
                />
            )}
        </div>
    );
}
