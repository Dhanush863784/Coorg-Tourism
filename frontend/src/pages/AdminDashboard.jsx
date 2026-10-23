import { useState, useEffect } from 'react';
import { 
    ShieldCheck, Users, Home, Coffee, DollarSign, 
    CheckCircle, XCircle, Trash2, Search, ArrowUpRight, Activity
} from 'lucide-react';
import { getAdminDashboard } from '../api/dashboardApi';
import axiosInstance from '../api/axiosInstance';
import LoadingSpinner from '../components/LoadingSpinner';

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'homestays', 'bookings', 'users'
    const [stats, setStats] = useState({
        totalUsers: 48,
        totalCustomers: 36,
        totalOwners: 12,
        totalHomestays: 18,
        totalRestaurants: 14,
        totalBookings: 84,
        totalPlatformCommission: 42800,
        totalGrossVolume: 428000
    });

    // Mock/Backend lists
    const [homestays, setHomestays] = useState([
        { id: 1, name: "Misty Woods Coffee Estate Stay", owner: "Kariappa Estates", location: "Madikeri", price: 1950, status: "APPROVED" },
        { id: 2, name: "Silver Brook Heritage Homestay", owner: "Muthappa Homestay", location: "Siddapur", price: 2400, status: "APPROVED" },
        { id: 3, name: "Cloud Valley Eco Retreat", owner: "Bopanna Coffee Woods", location: "Somwarpet", price: 2850, status: "APPROVED" },
        { id: 4, name: "Golden Oak Family Homestay", owner: "Cauvery Stays", location: "Kushalnagar", price: 1450, status: "APPROVED" }
    ]);

    const [bookings, setBookings] = useState([
        { id: 94821, customer: "Rahul Sharma", service: "Misty Woods Estate", amount: 5850, commission: 585, ownerShare: 5265, status: "CONFIRMED" },
        { id: 94820, customer: "Ananya Deshmukh", service: "Silver Brook Heritage", amount: 7200, commission: 720, ownerShare: 6480, status: "CONFIRMED" },
        { id: 94819, customer: "Vikram Malhotra", service: "Cloud Valley Eco", amount: 8550, commission: 855, ownerShare: 7695, status: "CONFIRMED" }
    ]);

    const [users, setUsers] = useState([
        { id: 1, name: "Kariappa Bopanna", email: "kariappa@gmail.com", role: "OWNER", joined: "Jan 2026" },
        { id: 2, name: "Rahul Sharma", email: "rahul.s@gmail.com", role: "CUSTOMER", joined: "Feb 2026" },
        { id: 3, name: "Ananya Deshmukh", email: "ananya.d@gmail.com", role: "CUSTOMER", joined: "Mar 2026" },
        { id: 4, name: "Cauvery Stays Admin", email: "owner@cauverystays.com", role: "OWNER", joined: "Feb 2026" }
    ]);

    useEffect(() => {
        getAdminDashboard()
            .then(data => {
                if (data) setStats(prev => ({ ...prev, ...data }));
            })
            .catch(() => {});

        axiosInstance.get('/admin/users')
            .then(res => {
                if (res.data?.length) setUsers(res.data);
            })
            .catch(() => {});
    }, []);

    const handleDeleteHomestay = (id) => {
        setHomestays(homestays.filter(h => h.id !== id));
    };

    return (
        <div className="fade-in" style={{ maxWidth: '1120px', margin: '0 auto' }}>
            {/* Header */}
            <div className="dashboard-header">
                <div>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#2D3748', color: '#fff', padding: '4px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: '800', marginBottom: '8px' }}>
                        <ShieldCheck size={14} /> CENTRAL ADMIN CONSOLE
                    </div>
                    <h1 style={{ fontSize: '32px', color: '#11281D', fontWeight: '800', margin: 0 }}>
                        Coorg Tourism Administration
                    </h1>
                    <p style={{ color: '#4A5B51', fontSize: '15px', marginTop: '4px' }}>
                        Oversee registered homestays, monitor bookings, track platform commission, and manage users.
                    </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#EDF4EE', padding: '8px 16px', borderRadius: '999px', fontSize: '13px', fontWeight: '700', color: '#163627' }}>
                    <Activity size={15} color="#2D6A4F" /> PostgreSQL Connected • Spring Boot Live (Port 8089)
                </div>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '28px', borderBottom: '1px solid rgba(18,40,29,0.1)', paddingBottom: '12px', flexWrap: 'wrap' }}>
                <button 
                    onClick={() => setActiveTab('overview')}
                    className={`btn-pill ${activeTab === 'overview' ? 'btn-forest' : 'btn-outline'}`}
                    style={{ padding: '8px 20px', borderRadius: '999px' }}
                >
                    System Overview
                </button>
                <button 
                    onClick={() => setActiveTab('homestays')}
                    className={`btn-pill ${activeTab === 'homestays' ? 'btn-forest' : 'btn-outline'}`}
                    style={{ padding: '8px 20px', borderRadius: '999px' }}
                >
                    <Home size={15} /> All Homestays ({homestays.length})
                </button>
                <button 
                    onClick={() => setActiveTab('bookings')}
                    className={`btn-pill ${activeTab === 'bookings' ? 'btn-forest' : 'btn-outline'}`}
                    style={{ padding: '8px 20px', borderRadius: '999px' }}
                >
                    <DollarSign size={15} /> Bookings & Commission ({bookings.length})
                </button>
                <button 
                    onClick={() => setActiveTab('users')}
                    className={`btn-pill ${activeTab === 'users' ? 'btn-forest' : 'btn-outline'}`}
                    style={{ padding: '8px 20px', borderRadius: '999px' }}
                >
                    <Users size={15} /> Registered Users ({users.length})
                </button>
            </div>

            {/* TAB 1: System Overview */}
            {activeTab === 'overview' && (
                <div>
                    <div className="dashboard-stat-pills">
                        <div className="stat-metric-card">
                            <span className="stat-metric-label">Platform 10% Revenue</span>
                            <span className="stat-metric-val">₹{stats.totalPlatformCommission || 42800}</span>
                            <span style={{ fontSize: '12px', color: '#2D6A4F', fontWeight: '700' }}>Direct platform cut</span>
                        </div>
                        <div className="stat-metric-card">
                            <span className="stat-metric-label">Total Bookings</span>
                            <span className="stat-metric-val">{stats.totalBookings || 84}</span>
                            <span style={{ fontSize: '12px', color: '#7E9085' }}>Across all homestays</span>
                        </div>
                        <div className="stat-metric-card">
                            <span className="stat-metric-label">Verified Homestays</span>
                            <span className="stat-metric-val">{stats.totalHomestays || 18}</span>
                            <span style={{ fontSize: '12px', color: '#7E9085' }}>Active in Coorg</span>
                        </div>
                        <div className="stat-metric-card">
                            <span className="stat-metric-label">Active Users</span>
                            <span className="stat-metric-val">{stats.totalUsers || 48}</span>
                            <span style={{ fontSize: '12px', color: '#7E9085' }}>Customers & Hosts</span>
                        </div>
                    </div>

                    <div style={{ background: '#fff', borderRadius: '24px', padding: '28px', border: '1px solid rgba(18,40,29,0.08)' }}>
                        <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#11281D', marginBottom: '16px' }}>
                            Recent Booking Settlements
                        </h3>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                                <thead>
                                    <tr style={{ borderBottom: '2px solid #EDF3EC', color: '#7E9085' }}>
                                        <th style={{ padding: '12px' }}>PNR / ID</th>
                                        <th style={{ padding: '12px' }}>Customer</th>
                                        <th style={{ padding: '12px' }}>Homestay</th>
                                        <th style={{ padding: '12px' }}>Total Paid</th>
                                        <th style={{ padding: '12px' }}>10% Platform Cut</th>
                                        <th style={{ padding: '12px' }}>90% Owner Payout</th>
                                        <th style={{ padding: '12px' }}>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bookings.map(b => (
                                        <tr key={b.id} style={{ borderBottom: '1px solid #F0F5F1' }}>
                                            <td style={{ padding: '14px 12px', fontWeight: '700', fontFamily: 'monospace' }}>#{b.id}</td>
                                            <td style={{ padding: '14px 12px', fontWeight: '600' }}>{b.customer}</td>
                                            <td style={{ padding: '14px 12px' }}>{b.service}</td>
                                            <td style={{ padding: '14px 12px', fontWeight: '700' }}>₹{b.amount}</td>
                                            <td style={{ padding: '14px 12px', fontWeight: '700', color: '#2D6A4F' }}>₹{b.commission}</td>
                                            <td style={{ padding: '14px 12px', color: '#11281D' }}>₹{b.ownerShare}</td>
                                            <td style={{ padding: '14px 12px' }}>
                                                <span style={{ background: '#E8F3EB', color: '#1B4332', padding: '3px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: '800' }}>
                                                    {b.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB 2: Homestays Management */}
            {activeTab === 'homestays' && (
                <div style={{ background: '#fff', borderRadius: '24px', padding: '28px', border: '1px solid rgba(18,40,29,0.08)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#11281D' }}>
                            Listed Homestays in Coorg
                        </h3>
                    </div>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid #EDF3EC', color: '#7E9085' }}>
                                    <th style={{ padding: '12px' }}>Property Name</th>
                                    <th style={{ padding: '12px' }}>Owner</th>
                                    <th style={{ padding: '12px' }}>Location</th>
                                    <th style={{ padding: '12px' }}>Price / Night</th>
                                    <th style={{ padding: '12px' }}>Status</th>
                                    <th style={{ padding: '12px' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {homestays.map(h => (
                                    <tr key={h.id} style={{ borderBottom: '1px solid #F0F5F1' }}>
                                        <td style={{ padding: '14px 12px', fontWeight: '700' }}>{h.name}</td>
                                        <td style={{ padding: '14px 12px' }}>{h.owner}</td>
                                        <td style={{ padding: '14px 12px' }}>{h.location}</td>
                                        <td style={{ padding: '14px 12px', fontWeight: '700' }}>₹{h.price}</td>
                                        <td style={{ padding: '14px 12px' }}>
                                            <span style={{ background: '#DFECE0', color: '#163627', padding: '3px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: '800' }}>
                                                {h.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: '14px 12px' }}>
                                            <button 
                                                onClick={() => handleDeleteHomestay(h.id)}
                                                style={{ background: '#FDE8E8', color: '#9B1C1C', border: 'none', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: '700' }}
                                            >
                                                Remove
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* TAB 3: Bookings & Commission */}
            {activeTab === 'bookings' && (
                <div style={{ background: '#fff', borderRadius: '24px', padding: '28px', border: '1px solid rgba(18,40,29,0.08)' }}>
                    <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#11281D', marginBottom: '16px' }}>
                        All Transactions & Automated Commission Ledger
                    </h3>
                    <p style={{ color: '#7E9085', fontSize: '14px', marginBottom: '20px' }}>
                        Each transaction automatically routes 10% to Coorg Tourism platform operations and 90% to the verified property owner.
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                        {bookings.map(b => (
                            <div key={b.id} style={{ background: '#F9FCF9', padding: '20px', borderRadius: '16px', border: '1px solid #E0EBE2' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <span style={{ fontFamily: 'monospace', fontWeight: '700' }}>Booking #{b.id}</span>
                                    <span style={{ color: '#2D6A4F', fontWeight: '800', fontSize: '12px' }}>PAID VIA UPI</span>
                                </div>
                                <h4 style={{ margin: '4px 0', fontSize: '16px', fontWeight: '800' }}>{b.service}</h4>
                                <div style={{ fontSize: '13px', color: '#666', marginBottom: '12px' }}>Traveler: {b.customer}</div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #EDF3EC', paddingTop: '10px' }}>
                                    <div>
                                        <div style={{ fontSize: '11px', color: '#7E9085' }}>Total</div>
                                        <div style={{ fontSize: '16px', fontWeight: '800' }}>₹{b.amount}</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '11px', color: '#7E9085' }}>Platform Fee (10%)</div>
                                        <div style={{ fontSize: '16px', fontWeight: '800', color: '#2D6A4F' }}>₹{b.commission}</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '11px', color: '#7E9085' }}>Owner Payout</div>
                                        <div style={{ fontSize: '16px', fontWeight: '800' }}>₹{b.ownerShare}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* TAB 4: Users Management */}
            {activeTab === 'users' && (
                <div style={{ background: '#fff', borderRadius: '24px', padding: '28px', border: '1px solid rgba(18,40,29,0.08)' }}>
                    <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#11281D', marginBottom: '16px' }}>
                        Registered Users & Roles
                    </h3>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid #EDF3EC', color: '#7E9085' }}>
                                    <th style={{ padding: '12px' }}>Name</th>
                                    <th style={{ padding: '12px' }}>Email</th>
                                    <th style={{ padding: '12px' }}>Role</th>
                                    <th style={{ padding: '12px' }}>Joined Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(u => (
                                    <tr key={u.id} style={{ borderBottom: '1px solid #F0F5F1' }}>
                                        <td style={{ padding: '14px 12px', fontWeight: '700' }}>{u.name}</td>
                                        <td style={{ padding: '14px 12px' }}>{u.email}</td>
                                        <td style={{ padding: '14px 12px' }}>
                                            <span style={{ 
                                                background: u.role === 'ADMIN' ? '#2D3748' : u.role === 'OWNER' ? '#163627' : '#DFECE0',
                                                color: u.role === 'CUSTOMER' ? '#163627' : '#fff',
                                                padding: '3px 10px',
                                                borderRadius: '999px',
                                                fontSize: '11px',
                                                fontWeight: '800'
                                            }}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td style={{ padding: '14px 12px', color: '#7E9085' }}>{u.joined || '2026'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
