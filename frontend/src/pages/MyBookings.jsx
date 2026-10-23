import { useState, useEffect } from 'react';
import { getMyBookings } from '../api/bookingApi';
import { createPayment, processPayment } from '../api/paymentApi';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

export default function MyBookings() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [payingId, setPayingId] = useState(null);

    const loadBookings = () => {
        getMyBookings()
            .then(setBookings)
            .catch(err => setError(err.message || 'Failed to load bookings'))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        loadBookings();
    }, []);

    const handlePayNow = async (bookingId) => {
        setPayingId(bookingId);
        try {
            const payInit = await createPayment({ bookingId });
            if (payInit?.id) {
                await processPayment(payInit.id);
            }
            loadBookings();
        } catch (err) {
            setError(err.response?.data?.message || 'Payment processing failed');
        } finally {
            setPayingId(null);
        }
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorMessage message={error} />;

    return (
        <div style={{ maxWidth: '840px', margin: '30px auto' }}>
            <h2 style={{ fontSize: '26px', fontWeight: '800', color: '#11281D', marginBottom: '20px' }}>My Bookings</h2>
            {bookings.length === 0 ? <p>You have no bookings.</p> : (
                <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: '1fr' }}>
                    {bookings.map(b => (
                        <div key={b.id} style={{ background: 'white', padding: '20px', borderRadius: '16px', border: '1px solid #E0E8E1', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                            <div>
                                <h3 style={{ margin: '0 0 6px 0', fontSize: '18px' }}>Booking #{b.id}</h3>
                                <p style={{ margin: '2px 0', color: '#4A5B51' }}><strong>Type:</strong> {b.bookingType} (Service ID: {b.serviceId})</p>
                                <p style={{ margin: '2px 0', color: '#4A5B51' }}><strong>Dates:</strong> {b.startDate} to {b.endDate}</p>
                                <p style={{ margin: '2px 0', color: '#4A5B51' }}><strong>Guests:</strong> {b.numberOfGuests}</p>
                            </div>
                            <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                                <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#163627', margin: 0 }}>₹{b.totalAmount}</p>
                                <span style={{ padding: '4px 10px', background: b.status === 'CONFIRMED' ? '#d4edda' : b.status === 'PENDING' ? '#fff3cd' : '#f8d7da', borderRadius: '8px', fontSize: '13px', fontWeight: '700' }}>
                                    {b.status}
                                </span>
                                {b.status === 'PENDING' && (
                                    <button
                                        onClick={() => handlePayNow(b.id)}
                                        disabled={payingId === b.id}
                                        className="btn-forest"
                                        style={{ padding: '6px 14px', fontSize: '12px', marginTop: '4px' }}
                                    >
                                        {payingId === b.id ? 'Processing...' : 'Pay Now'}
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
