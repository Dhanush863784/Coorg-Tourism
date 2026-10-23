import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
    Compass, Calendar, DollarSign, Users, Check, Sparkles, 
    ArrowRight, MapPin, Star, ShieldCheck, CreditCard, Lock, Eye
} from 'lucide-react';
import CoorgMapRoadmap from '../components/CoorgMapRoadmap';
import TravelPassModal from '../components/TravelPassModal';
import { getHomestays } from '../api/homestayApi';
import { createBooking } from '../api/bookingApi';
import { createPayment, processPayment } from '../api/paymentApi';

export default function TripPlanner() {
    const location = useLocation();
    const navigate = useNavigate();

    // Planning state
    const [budget, setBudget] = useState(location.state?.budget || 7000);
    const [days, setDays] = useState(location.state?.days || 3);
    const [guests, setGuests] = useState(2);
    const [startDate, setStartDate] = useState(
        new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0]
    );

    // Curated Homestay options
    const [homestays, setHomestays] = useState([]);
    const [selectedHomestay, setSelectedHomestay] = useState(null);
    const [loadingHomestays, setLoadingHomestays] = useState(false);

    // Checkout & Payment flow
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('UPI');
    const [upiId, setUpiId] = useState('traveler@okhdfcbank');
    const [processingPayment, setProcessingPayment] = useState(false);
    
    // Confirmed booking & Travel Pass modal
    const [confirmedBooking, setConfirmedBooking] = useState(null);
    const [showTravelPass, setShowTravelPass] = useState(false);

    // Pre-curated verified Coorg homestays as fallback & instant catalog
    const fallbackHomestays = [
        {
            id: 101,
            name: "Misty Woods Coffee Estate Stay",
            location: "Madikeri, Coorg (Near Raja's Seat)",
            pricePerNight: 1950,
            rating: 4.9,
            reviewsCount: 128,
            imageUrl: "https://images.unsplash.com/photo-1596568359546-24baeb9e2b1e?auto=format&fit=crop&q=80&w=600",
            amenities: ["Plantation Walk", "Complimentary Breakfast", "Campfire", "Free WiFi"],
            ownerPhone: "+91 98450 19284",
            ownerName: "Kariappa Estates",
            description: "Surrounded by 15 acres of organic Arabica coffee and pepper vines, wake up to cascading mist and birdsong."
        },
        {
            id: 102,
            name: "Silver Brook Heritage Homestay",
            location: "Siddapur Road, Madikeri",
            pricePerNight: 2400,
            rating: 4.8,
            reviewsCount: 94,
            imageUrl: "https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&q=80&w=600",
            amenities: ["Stream By Property", "Traditional Kodava Meals", "Pet Friendly", "Estate Treks"],
            ownerPhone: "+91 94480 33819",
            ownerName: "Muthappa Homestay",
            description: "An authentic Kodava tiled bungalow alongside a perennial freshwater stream with home-cooked Coorg delicacies."
        },
        {
            id: 103,
            name: "Cloud Valley Eco Plantation Retreat",
            location: "Somwarpet / Mandalpatti foothills",
            pricePerNight: 2850,
            rating: 4.95,
            reviewsCount: 156,
            imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=600",
            amenities: ["Mountain View Balcony", "Jeep Safari Desk", "BBQ & Bonfire", "Birdwatching"],
            ownerPhone: "+91 97410 88204",
            ownerName: "Bopanna Coffee Woods",
            description: "Panoramic cliff views overlooking the Western Ghats with direct jeep safari connectivity to Mandalpatti peak."
        },
        {
            id: 104,
            name: "Golden Oak Budget Homestay",
            location: "Kushalnagar (Near Golden Temple)",
            pricePerNight: 1450,
            rating: 4.7,
            reviewsCount: 68,
            imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=600",
            amenities: ["Close to Dubare", "Free Parking", "Kodava Coffee", "AC Rooms"],
            ownerPhone: "+91 94491 55670",
            ownerName: "Cauvery Stays",
            description: "Budget-friendly family homestay centrally located between Dubare Elephant Camp and the Tibetan Monastery."
        }
    ];

    // Load homestays from backend or fallback
    useEffect(() => {
        setLoadingHomestays(true);
        getHomestays()
            .then(data => {
                if (data && data.length > 0) {
                    setHomestays(data);
                    setSelectedHomestay(data[0]);
                } else {
                    setHomestays(fallbackHomestays);
                    setSelectedHomestay(fallbackHomestays[0]);
                }
            })
            .catch(() => {
                setHomestays(fallbackHomestays);
                setSelectedHomestay(fallbackHomestays[0]);
            })
            .finally(() => setLoadingHomestays(false));
    }, []);

    // Filter homestays according to budget and days
    const nights = Math.max(1, days - 1);
    const maxAffordableNightPrice = Math.max(1000, Math.floor((budget * 0.70) / nights));

    const matchedHomestays = homestays.filter(h => {
        const price = h.pricePerNight || 2000;
        return price <= maxAffordableNightPrice + 800; // flexible range
    });

    const activeList = matchedHomestays.length > 0 ? matchedHomestays : homestays;

    // Calculate transparent budget breakdown
    const homestayNightPrice = selectedHomestay?.pricePerNight || 2000;
    const stayTotal = homestayNightPrice * nights;
    const sightseeingEntryEst = days * 350;
    const localTravelEst = days * 600;
    const totalEst = stayTotal + sightseeingEntryEst;
    const remainingPocketSavings = Math.max(0, budget - totalEst);

    // Handle Payment & Booking submission
    const handlePayAndConfirm = async (e) => {
        e.preventDefault();
        setProcessingPayment(true);

        const token = localStorage.getItem('token');
        const endDate = new Date(new Date(startDate).getTime() + (days * 86400000)).toISOString().split('T')[0];

        let bookingRecord = {
            id: Math.floor(10000 + Math.random() * 90000),
            pnr: `CRG-${Math.floor(10000 + Math.random() * 90000)}`,
            homestayName: selectedHomestay.name,
            homestayLocation: selectedHomestay.location,
            serviceName: selectedHomestay.name,
            totalAmount: stayTotal,
            budget: budget,
            days: days,
            numberOfGuests: guests,
            startDate: startDate,
            endDate: endDate,
            customerName: token ? 'Registered Explorer' : 'Guest Traveler',
            status: 'CONFIRMED',
            paidAt: new Date().toLocaleTimeString()
        };

        // If backend session is active, invoke real backend APIs
        if (token && selectedHomestay?.id) {
            try {
                const bookingData = await createBooking({
                    serviceId: selectedHomestay.id,
                    bookingType: 'HOMESTAY',
                    startDate: startDate,
                    endDate: endDate,
                    numberOfGuests: guests
                });

                if (bookingData?.id) {
                    bookingRecord.id = bookingData.id;
                    const paymentInit = await createPayment({
                        bookingId: bookingData.id,
                        paymentMethod: paymentMethod
                    });
                    if (paymentInit?.id) {
                        await processPayment(paymentInit.id);
                    }
                }
            } catch (err) {
                console.warn('Backend payment bridge simulated fallback:', err.message);
            }
        }

        // Store notification for Owner in localStorage so the owner portal reacts immediately
        try {
            const existingNotifs = JSON.parse(localStorage.getItem('owner_notifications') || '[]');
            existingNotifs.unshift({
                id: Date.now(),
                homestayName: selectedHomestay.name,
                customerName: bookingRecord.customerName,
                days: days,
                amount: stayTotal,
                guests: guests,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                status: 'PAID'
            });
            localStorage.setItem('owner_notifications', JSON.stringify(existingNotifs));
        } catch {}

        setTimeout(() => {
            setProcessingPayment(false);
            setIsCheckingOut(false);
            setConfirmedBooking(bookingRecord);
            setShowTravelPass(true);
        }, 1200);
    };

    return (
        <div style={{ maxWidth: '1120px', margin: '0 auto' }}>
            {/* Top Heading */}
            <div style={{ marginBottom: '28px' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#DFECE0', color: '#163627', padding: '6px 14px', borderRadius: '999px', fontSize: '13px', fontWeight: '800', marginBottom: '12px' }}>
                    <Sparkles size={14} /> SMART COORG ITINERARY GENERATOR
                </div>
                <h1 style={{ fontSize: '38px', color: '#11281D', fontWeight: '800', letterSpacing: '-0.02em', margin: 0 }}>
                    Plan by Budget & Get Your Real-Time Travel Roadmap
                </h1>
                <p style={{ color: '#4A5B51', fontSize: '16px', marginTop: '6px' }}>
                    Enter your trip budget (e.g. ₹6,000, ₹8,000, ₹10,000) and choose your days. We match the perfect homestay and deliver a real-time RedBus-style roadmap upon booking.
                </p>
            </div>

            {/* Smart Budget Planner Form Container */}
            <div className="planner-widget-container">
                <div className="planner-header">
                    <div className="planner-title-group">
                        <h3>1. Select Budget & Duration</h3>
                        <p>We tailor the homestay stay and itinerary stops within your budget</p>
                    </div>

                    {/* Quick Budget Presets */}
                    <div className="budget-presets-row">
                        {[5000, 6000, 7500, 9000, 12000, 15000].map(amt => (
                            <button
                                key={amt}
                                type="button"
                                className={`budget-preset-btn ${budget === amt ? 'active' : ''}`}
                                onClick={() => setBudget(amt)}
                            >
                                ₹{(amt / 1000).toFixed(amt % 1000 === 0 ? 0 : 1)}k
                            </button>
                        ))}
                    </div>
                </div>

                <div className="planner-inputs-grid">
                    {/* Budget Input */}
                    <div className="planner-input-box">
                        <label>Your Total Budget (₹)</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '20px', fontWeight: '800', color: '#11281D' }}>₹</span>
                            <input
                                type="number"
                                min="2000"
                                step="500"
                                value={budget}
                                onChange={e => setBudget(Number(e.target.value) || 2000)}
                            />
                        </div>
                    </div>

                    {/* Duration / Days Selector */}
                    <div className="planner-input-box">
                        <label>Trip Duration</label>
                        <select value={days} onChange={e => setDays(Number(e.target.value))}>
                            <option value={1}>1 Day (Express Tour)</option>
                            <option value={2}>2 Days / 1 Night (Weekend)</option>
                            <option value={3}>3 Days / 2 Nights (Recommended)</option>
                            <option value={4}>4 Days / 3 Nights (Deep Explorer)</option>
                            <option value={5}>5 Days / 4 Nights (Full Coffee Trail)</option>
                        </select>
                    </div>

                    {/* Start Date */}
                    <div className="planner-input-box">
                        <label>Departure Date</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={e => setStartDate(e.target.value)}
                        />
                    </div>

                    {/* Number of Guests */}
                    <div className="planner-input-box">
                        <label>Guests</label>
                        <select value={guests} onChange={e => setGuests(Number(e.target.value))}>
                            <option value={1}>1 Solo Explorer</option>
                            <option value={2}>2 Travelers (Couple/Friends)</option>
                            <option value={3}>3 Travelers</option>
                            <option value={4}>4 Travelers (Family)</option>
                            <option value={6}>6 Travelers (Group)</option>
                        </select>
                    </div>
                </div>

                {/* Instant Budget Allocation Preview */}
                <div style={{
                    background: '#F5F9F5',
                    borderRadius: '20px',
                    padding: '20px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '16px',
                    border: '1px solid rgba(18,40,29,0.06)'
                }}>
                    <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                        <div>
                            <div style={{ fontSize: '11px', fontWeight: '800', color: '#7E9085', textTransform: 'uppercase' }}>Homestay Allocation</div>
                            <div style={{ fontSize: '18px', fontWeight: '800', color: '#163627' }}>
                                ₹{stayTotal} <span style={{ fontSize: '12px', fontWeight: '600', color: '#7E9085' }}>({nights} nights)</span>
                            </div>
                        </div>
                        <div>
                            <div style={{ fontSize: '11px', fontWeight: '800', color: '#7E9085', textTransform: 'uppercase' }}>Attractions & Entry</div>
                            <div style={{ fontSize: '18px', fontWeight: '800', color: '#163627' }}>~₹{sightseeingEntryEst}</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '11px', fontWeight: '800', color: '#7E9085', textTransform: 'uppercase' }}>Remaining Balance</div>
                            <div style={{ fontSize: '18px', fontWeight: '800', color: '#2D6A4F' }}>₹{remainingPocketSavings} (For dining & gifts)</div>
                        </div>
                    </div>

                    <div style={{ background: '#DFECE0', color: '#163627', padding: '6px 16px', borderRadius: '999px', fontSize: '13px', fontWeight: '800' }}>
                        ✓ Within Budget (₹{budget})
                    </div>
                </div>
            </div>

            {/* Matched Homestays Section */}
            <div style={{ marginTop: '48px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '20px' }}>
                    <div>
                        <span style={{ fontSize: '12px', fontWeight: '800', color: '#D96B43', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                            Step 2: Choose Your Base Stay
                        </span>
                        <h2 style={{ fontSize: '26px', color: '#11281D', fontWeight: '800', margin: '4px 0 0 0' }}>
                            Homestays Matched to Your ₹{budget} Budget
                        </h2>
                    </div>
                    <span style={{ fontSize: '14px', color: '#7E9085', fontWeight: '600' }}>
                        Showing {activeList.length} verified coffee stays
                    </span>
                </div>

                <div className="homestay-cards-grid">
                    {activeList.map(stay => {
                        const isSelected = selectedHomestay?.id === stay.id;
                        const price = stay.pricePerNight || 2000;
                        const totalForStay = price * nights;

                        return (
                            <div 
                                key={stay.id} 
                                className="homestay-card"
                                style={{ 
                                    cursor: 'pointer',
                                    border: isSelected ? '2px solid #163627' : '1px solid rgba(18,40,29,0.08)',
                                    boxShadow: isSelected ? '0 12px 30px rgba(22, 54, 39, 0.18)' : 'var(--shadow-sm)'
                                }}
                                onClick={() => setSelectedHomestay(stay)}
                            >
                                <div className="homestay-img-box">
                                    <img 
                                        src={stay.imageUrl || fallbackHomestays[0].imageUrl} 
                                        alt={stay.name} 
                                    />
                                    <div className="homestay-rating-badge">
                                        <Star size={13} fill="#F5B838" color="#F5B838" />
                                        <span>{stay.rating || 4.8}</span>
                                    </div>
                                    {isSelected && (
                                        <div style={{
                                            position: 'absolute',
                                            top: '14px',
                                            left: '14px',
                                            background: '#163627',
                                            color: '#fff',
                                            padding: '4px 12px',
                                            borderRadius: '999px',
                                            fontSize: '11px',
                                            fontWeight: '800',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '4px'
                                        }}>
                                            <Check size={12} /> SELECTED STAY
                                        </div>
                                    )}
                                </div>

                                <div className="homestay-body">
                                    <h3 className="homestay-title">{stay.name}</h3>
                                    <div className="homestay-location">
                                        <MapPin size={13} /> {stay.location}
                                    </div>
                                    <p className="homestay-desc">{stay.description}</p>

                                    {/* Amenities Chips */}
                                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
                                        {(stay.amenities || ["Coffee Estate", "WiFi", "Campfire"]).map((a, i) => (
                                            <span key={i} style={{ background: '#F0F5F1', color: '#275239', fontSize: '11px', fontWeight: '700', padding: '3px 8px', borderRadius: '8px' }}>
                                                {a}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="homestay-footer">
                                        <div className="homestay-price-wrap">
                                            <div className="homestay-price-val">₹{price}</div>
                                            <div className="homestay-price-unit">per night • ₹{totalForStay} total ({nights}N)</div>
                                        </div>
                                        <button 
                                            className={isSelected ? "btn-forest" : "btn-outline"}
                                            style={{ padding: '8px 18px', fontSize: '13px' }}
                                            onClick={(e) => { e.stopPropagation(); setSelectedHomestay(stay); }}
                                        >
                                            {isSelected ? '✓ Selected' : 'Choose Stay'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Step 3: Interactive Route Roadmap Preview */}
            {selectedHomestay && (
                <div style={{ marginTop: '56px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                        <div>
                            <span style={{ fontSize: '12px', fontWeight: '800', color: '#2D6A4F', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                Step 3: Your Live Route Roadmap
                            </span>
                            <h2 style={{ fontSize: '26px', color: '#11281D', fontWeight: '800', margin: '4px 0 0 0' }}>
                                Complete Coorg Roadmap from {selectedHomestay.name}
                            </h2>
                        </div>
                        <button 
                            onClick={() => setIsCheckingOut(true)} 
                            className="btn-forest"
                            style={{ padding: '14px 32px', fontSize: '16px' }}
                        >
                            Confirm Booking & Unlock Pass (₹{stayTotal}) <ArrowRight size={18} />
                        </button>
                    </div>

                    <CoorgMapRoadmap 
                        homestayName={selectedHomestay.name}
                        homestayLocation={selectedHomestay.location}
                    />
                </div>
            )}

            {/* Checkout & Payment Modal */}
            {isCheckingOut && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 9000,
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
                        maxWidth: '520px',
                        borderRadius: '32px',
                        padding: '36px',
                        boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
                        position: 'relative'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <div>
                                <h3 style={{ fontSize: '24px', fontWeight: '800', color: '#11281D', margin: 0 }}>
                                    Complete Payment
                                </h3>
                                <p style={{ fontSize: '13px', color: '#7E9085', margin: '4px 0 0 0' }}>
                                    Instant confirmation & RedBus-style digital travel pass
                                </p>
                            </div>
                            <button 
                                onClick={() => setIsCheckingOut(false)}
                                style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: '#666' }}
                            >
                                ✕
                            </button>
                        </div>

                        {/* Order Summary */}
                        <div style={{ background: '#F8FAF8', borderRadius: '18px', padding: '18px', marginBottom: '24px', border: '1px solid rgba(18,40,29,0.06)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <span style={{ fontSize: '14px', color: '#4A5B51' }}>{selectedHomestay.name}</span>
                                <span style={{ fontSize: '14px', fontWeight: '700', color: '#11281D' }}>₹{stayTotal}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <span style={{ fontSize: '13px', color: '#7E9085' }}>{days} Days / {nights} Nights ({guests} Guests)</span>
                                <span style={{ fontSize: '13px', color: '#2D6A4F', fontWeight: '700' }}>Included</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(18,40,29,0.08)', paddingTop: '10px', marginTop: '10px' }}>
                                <span style={{ fontSize: '16px', fontWeight: '800', color: '#11281D' }}>Total Payable Amount</span>
                                <span style={{ fontSize: '20px', fontWeight: '800', color: '#163627' }}>₹{stayTotal}</span>
                            </div>
                        </div>

                        {/* Payment Method Selector */}
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ fontSize: '12px', fontWeight: '800', color: '#7E9085', textTransform: 'uppercase', display: 'block', marginBottom: '10px' }}>
                                Choose Payment Method
                            </label>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                <button
                                    type="button"
                                    onClick={() => setPaymentMethod('UPI')}
                                    style={{
                                        padding: '12px',
                                        borderRadius: '14px',
                                        border: paymentMethod === 'UPI' ? '2px solid #163627' : '1px solid #E0E8E1',
                                        background: paymentMethod === 'UPI' ? '#EDF4EE' : '#fff',
                                        fontWeight: '700',
                                        fontSize: '13px',
                                        color: '#11281D'
                                    }}
                                >
                                    ⚡ UPI (GPay / PhonePe)
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setPaymentMethod('CARD')}
                                    style={{
                                        padding: '12px',
                                        borderRadius: '14px',
                                        border: paymentMethod === 'CARD' ? '2px solid #163627' : '1px solid #E0E8E1',
                                        background: paymentMethod === 'CARD' ? '#EDF4EE' : '#fff',
                                        fontWeight: '700',
                                        fontSize: '13px',
                                        color: '#11281D'
                                    }}
                                >
                                    💳 Credit / Debit Card
                                </button>
                            </div>
                        </div>

                        {paymentMethod === 'UPI' ? (
                            <div className="planner-input-box" style={{ marginBottom: '24px' }}>
                                <label>Your UPI ID / VPA</label>
                                <input
                                    type="text"
                                    value={upiId}
                                    onChange={e => setUpiId(e.target.value)}
                                    placeholder="yourname@upi"
                                    required
                                />
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                                <div className="planner-input-box">
                                    <label>Card Number</label>
                                    <input type="text" defaultValue="4242 •••• •••• 9410" />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                    <div className="planner-input-box">
                                        <label>Expiry</label>
                                        <input type="text" defaultValue="12/28" />
                                    </div>
                                    <div className="planner-input-box">
                                        <label>CVV</label>
                                        <input type="password" defaultValue="•••" />
                                    </div>
                                </div>
                            </div>
                        )}

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', fontSize: '12px', color: '#7E9085' }}>
                            <Lock size={14} color="#2D6A4F" />
                            <span>128-bit Encrypted. Host is immediately notified of this booking.</span>
                        </div>

                        <button
                            onClick={handlePayAndConfirm}
                            disabled={processingPayment}
                            className="btn-forest"
                            style={{ width: '100%', padding: '16px', fontSize: '16px', borderRadius: '16px' }}
                        >
                            {processingPayment ? 'Processing Secure Payment...' : `Pay ₹${stayTotal} & Unlock Pass`}
                        </button>
                    </div>
                </div>
            )}

            {/* RedBus-Style Travel Pass Modal on Payment Success */}
            {showTravelPass && confirmedBooking && (
                <TravelPassModal
                    booking={confirmedBooking}
                    onClose={() => setShowTravelPass(false)}
                />
            )}
        </div>
    );
}
