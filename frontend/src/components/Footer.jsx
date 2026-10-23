import { Link } from 'react-router-dom';
import { Compass, Phone, ShieldCheck, Heart } from 'lucide-react';

export default function Footer() {
    return (
        <footer style={{
            background: 'var(--forest-dark)',
            color: '#fff',
            marginTop: 'auto',
            padding: '48px 24px 28px 24px',
            borderTop: '1px solid rgba(255,255,255,0.08)'
        }}>
            <div style={{ maxWidth: '1120px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '32px', marginBottom: '36px' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                        <span style={{ fontSize: '24px' }}>🌿</span>
                        <span style={{ fontSize: '20px', fontWeight: '800', letterSpacing: '-0.02em', color: '#fff' }}>
                            Coorg Tourism
                        </span>
                    </div>
                    <p style={{ color: '#95D5B2', fontSize: '14px', lineHeight: '1.6' }}>
                        Experience the Scotland of India with intelligent budget trip planning, verified homestay bookings, and real-time interactive roadmaps.
                    </p>
                </div>

                <div>
                    <h4 style={{ color: '#fff', fontSize: '15px', fontWeight: '800', marginBottom: '14px' }}>Quick Navigation</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px', color: '#B7E4C7' }}>
                        <Link to="/trip-planner" style={{ color: 'inherit' }}>Budget Trip Planner</Link>
                        <Link to="/homestays" style={{ color: 'inherit' }}>Coffee Plantation Homestays</Link>
                        <Link to="/places" style={{ color: 'inherit' }}>Top Attractions & Falls</Link>
                        <Link to="/restaurants" style={{ color: 'inherit' }}>Authentic Kodava Dining</Link>
                    </div>
                </div>

                <div>
                    <h4 style={{ color: '#fff', fontSize: '15px', fontWeight: '800', marginBottom: '14px' }}>Portals</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px', color: '#B7E4C7' }}>
                        <Link to="/dashboard/customer" style={{ color: 'inherit' }}>Traveler Pass & Roadmaps</Link>
                        <Link to="/dashboard/owner" style={{ color: 'inherit' }}>Homestay & Restaurant Owners</Link>
                        <Link to="/dashboard/admin" style={{ color: 'inherit' }}>Central Admin Management</Link>
                        <Link to="/login" style={{ color: 'inherit' }}>Host / Traveler Login</Link>
                    </div>
                </div>

                <div>
                    <h4 style={{ color: '#fff', fontSize: '15px', fontWeight: '800', marginBottom: '14px' }}>Coorg Helpline</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px', color: '#B7E4C7' }}>
                        <span>📞 Tourism Helpline: +91 8272 228345</span>
                        <span>🚑 Emergency Medical: 108 / 112</span>
                        <span>📍 Madikeri, Kodagu District, Karnataka</span>
                    </div>
                </div>
            </div>

            <div style={{ maxWidth: '1120px', margin: '0 auto', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', fontSize: '13px', color: '#74C69D' }}>
                <span>&copy; {new Date().getFullYear()} Coorg Tourism. Built with Spring Boot & PostgreSQL.</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    Crafted for nature lovers & coffee estates ☕
                </span>
            </div>
        </footer>
    );
}
