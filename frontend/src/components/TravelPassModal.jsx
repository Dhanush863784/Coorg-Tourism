import { useState } from 'react';
import { CheckCircle2, QrCode, Download, Printer, Share2, Phone, MapPin, Calendar, Clock, Navigation, X } from 'lucide-react';
import CoorgMapRoadmap from './CoorgMapRoadmap';

export default function TravelPassModal({ booking, onClose }) {
    const [copied, setCopied] = useState(false);

    if (!booking) return null;

    const pnr = booking.pnr || `CRG-${booking.id ? String(booking.id).padStart(5, '0') : '84291'}`;
    const homestayName = booking.homestayName || booking.serviceName || 'Misty Woods Coffee Estate Stay';
    const homestayLocation = booking.homestayLocation || 'Madikeri, Coorg (5 km from Raja Seat)';
    const totalAmount = booking.totalAmount || booking.budget || 6800;
    const days = booking.days || 3;
    const guests = booking.numberOfGuests || 2;
    const customerName = booking.customerName || 'Explorer';
    const startDate = booking.startDate || new Date().toISOString().split('T')[0];

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: `Coorg Travel Pass - ${pnr}`,
                text: `My Coorg Tour Travel Pass & Homestay Booking for ${homestayName}. PNR: ${pnr}`,
                url: window.location.href
            }).catch(() => {});
        } else {
            navigator.clipboard.writeText(`Coorg Booking PNR: ${pnr} at ${homestayName}`);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: 'rgba(17, 40, 29, 0.75)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            overflowY: 'auto'
        }}>
            <div style={{
                background: '#fff',
                width: '100%',
                maxWidth: '960px',
                maxHeight: '92vh',
                overflowY: 'auto',
                borderRadius: '32px',
                boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
                border: '1px solid rgba(18,40,29,0.1)',
                position: 'relative'
            }}>
                {/* Close Button */}
                <button 
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '20px',
                        right: '20px',
                        background: 'rgba(255,255,255,0.25)',
                        border: 'none',
                        color: '#fff',
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        zIndex: 10
                    }}
                >
                    <X size={20} />
                </button>

                {/* RedBus-Style Top Ticket Header */}
                <div style={{
                    background: 'linear-gradient(135deg, #11281D 0%, #1F4A36 100%)',
                    color: '#fff',
                    padding: '36px 36px 28px 36px',
                    borderRadius: '32px 32px 0 0'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                                <span style={{ fontSize: '24px' }}>🌿</span>
                                <span style={{ textTransform: 'uppercase', letterSpacing: '0.15em', fontSize: '12px', fontWeight: '800', color: '#95D5B2' }}>
                                    Official Travel Pass & Itinerary Ticket
                                </span>
                            </div>
                            <h2 style={{ color: '#fff', fontSize: '28px', margin: 0, fontWeight: '800' }}>
                                Coorg Exploration Journey
                            </h2>
                            <p style={{ color: '#D8F3DC', fontSize: '14px', margin: '4px 0 0 0' }}>
                                Verified Digital Voucher • Instant Homestay & Tourist Route Clearance
                            </p>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                            <div style={{
                                background: 'rgba(255,255,255,0.15)',
                                padding: '6px 16px',
                                borderRadius: '999px',
                                fontFamily: 'monospace',
                                fontSize: '15px',
                                fontWeight: '700',
                                letterSpacing: '0.1em',
                                display: 'inline-block',
                                marginBottom: '6px'
                            }}>
                                PNR: {pnr}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'flex-end', color: '#74C69D', fontSize: '13px', fontWeight: '700' }}>
                                <CheckCircle2 size={16} /> Payment Confirmed (₹{totalAmount})
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ padding: '32px' }}>
                    {/* Booking Breakdown Pill Card */}
                    <div style={{
                        background: '#F8FAF8',
                        borderRadius: '24px',
                        border: '1px solid rgba(18,40,29,0.08)',
                        padding: '24px',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                        gap: '20px',
                        marginBottom: '32px'
                    }}>
                        <div>
                            <div style={{ fontSize: '11px', fontWeight: '800', color: '#7E9085', textTransform: 'uppercase' }}>Booked Homestay</div>
                            <div style={{ fontSize: '16px', fontWeight: '800', color: '#11281D', marginTop: '4px' }}>{homestayName}</div>
                            <div style={{ fontSize: '12px', color: '#666' }}>{homestayLocation}</div>
                        </div>

                        <div>
                            <div style={{ fontSize: '11px', fontWeight: '800', color: '#7E9085', textTransform: 'uppercase' }}>Duration & Dates</div>
                            <div style={{ fontSize: '16px', fontWeight: '800', color: '#11281D', marginTop: '4px' }}>{days} Days / {days - 1} Nights</div>
                            <div style={{ fontSize: '12px', color: '#666' }}>From: {startDate}</div>
                        </div>

                        <div>
                            <div style={{ fontSize: '11px', fontWeight: '800', color: '#7E9085', textTransform: 'uppercase' }}>Traveler & Guests</div>
                            <div style={{ fontSize: '16px', fontWeight: '800', color: '#11281D', marginTop: '4px' }}>{customerName}</div>
                            <div style={{ fontSize: '12px', color: '#666' }}>{guests} Guests Registered</div>
                        </div>

                        <div>
                            <div style={{ fontSize: '11px', fontWeight: '800', color: '#7E9085', textTransform: 'uppercase' }}>Host Direct Phone</div>
                            <div style={{ fontSize: '16px', fontWeight: '800', color: '#1B4332', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Phone size={14} /> +91 98452 71089
                            </div>
                            <div style={{ fontSize: '12px', color: '#2D6A4F' }}>Owner notified via SMS</div>
                        </div>
                    </div>

                    {/* Integrated Real-Time Roadmap Component */}
                    <div style={{ marginBottom: '32px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                            <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#11281D' }}>
                                🗺️ Real-Time Coorg Travel Roadmap & Attractions
                            </h3>
                            <span style={{ fontSize: '13px', color: '#7E9085' }}>Interactive GPS Live Route</span>
                        </div>
                        <CoorgMapRoadmap homestayName={homestayName} homestayLocation={homestayLocation} />
                    </div>

                    {/* Bottom Pass Actions (Print, Share, Download) */}
                    <div style={{
                        borderTop: '1px solid rgba(18,40,29,0.1)',
                        paddingTop: '24px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '16px'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '48px', height: '48px', background: '#EDF3EC', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <QrCode size={28} color="#11281D" />
                            </div>
                            <div>
                                <div style={{ fontSize: '13px', fontWeight: '800', color: '#11281D' }}>Digital Check-In QR Ready</div>
                                <div style={{ fontSize: '12px', color: '#7E9085' }}>Show this pass at homestay reception & checkpoints</div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button onClick={handleShare} className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Share2 size={15} /> {copied ? 'Copied Link!' : 'Share Pass'}
                            </button>
                            <button onClick={handlePrint} className="btn-forest" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Printer size={15} /> Print / Save Voucher
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
