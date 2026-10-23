import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { createBooking } from '../api/bookingApi';
import { createPayment, processPayment } from '../api/paymentApi';
import ErrorMessage from '../components/ErrorMessage';
import '../styles/forms.css';

export default function BookingPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const serviceInfo = location.state || {}; // Expects { serviceId, type, price, name }
    
    const [form, setForm] = useState({
        startDate: '',
        endDate: '',
        numberOfGuests: 1
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [bookingDetails, setBookingDetails] = useState(null);
    const [paymentDetails, setPaymentDetails] = useState(null);

    // If navigated directly without a selected service
    useEffect(() => {
        if (!serviceInfo.serviceId) {
            navigate('/homestays');
        }
    }, [serviceInfo, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        try {
            const booking = await createBooking({
                serviceId: serviceInfo.serviceId,
                bookingType: serviceInfo.type || 'HOMESTAY',
                startDate: form.startDate,
                endDate: form.endDate,
                numberOfGuests: form.numberOfGuests,
                specialRequests: ''
            });

            // Automatically process payment via backend PaymentService
            try {
                const payInit = await createPayment({ bookingId: booking.id });
                if (payInit?.id) {
                    const paySuccess = await processPayment(payInit.id);
                    setPaymentDetails(paySuccess);
                    booking.status = 'CONFIRMED';
                }
            } catch (payErr) {
                console.warn('Payment step warning:', payErr.message);
            }

            setBookingDetails(booking);
            setSuccess(true);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create booking.');
        } finally {
            setLoading(false);
        }
    };

    if (success && bookingDetails) {
        return (
            <div style={{ maxWidth: '600px', margin: '40px auto', background: 'white', padding: '40px', borderRadius: '12px', textAlign: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                <div style={{ fontSize: '48px', marginBottom: '20px' }}>✅</div>
                <h2>Booking Confirmed!</h2>
                <p>Your booking for <strong>{serviceInfo.name}</strong> has been secured.</p>
                
                <div style={{ background: '#f5f5f5', padding: '20px', borderRadius: '8px', margin: '30px 0', textAlign: 'left' }}>
                    <p><strong>Booking ID:</strong> #{bookingDetails.id}</p>
                    <p><strong>Dates:</strong> {bookingDetails.startDate} to {bookingDetails.endDate}</p>
                    <p><strong>Guests:</strong> {bookingDetails.numberOfGuests}</p>
                    <p><strong>Total Amount:</strong> ₹{bookingDetails.totalAmount}</p>
                    <p><strong>Status:</strong> <span style={{ color: '#2d6a4f', fontWeight: 'bold' }}>{bookingDetails.status}</span></p>
                    {paymentDetails?.transactionId && (
                        <p><strong>Transaction Ref:</strong> {paymentDetails.transactionId}</p>
                    )}
                </div>
                
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                    <button onClick={() => navigate('/my-bookings')} className="btn-primary">View My Bookings</button>
                    <button onClick={() => navigate('/dashboard/customer')} className="btn-outline">Open Traveler Portal</button>
                </div>
            </div>
        );
    }

    return (
        <div className="form-container" style={{ maxWidth: '500px' }}>
            <h2>Book {serviceInfo.name}</h2>
            <p style={{ color: '#666', marginBottom: '20px' }}>Price: ₹{serviceInfo.price} per day/night</p>
            
            <ErrorMessage message={error} />
            
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Start Date</label>
                    <input type="date" value={form.startDate} onChange={e => setForm({...form, startDate: e.target.value})} required />
                </div>
                <div className="form-group">
                    <label>End Date</label>
                    <input type="date" value={form.endDate} onChange={e => setForm({...form, endDate: e.target.value})} required />
                </div>
                <div className="form-group">
                    <label>Number of Guests</label>
                    <input type="number" min="1" value={form.numberOfGuests} onChange={e => setForm({...form, numberOfGuests: parseInt(e.target.value)})} required />
                </div>
                
                <button type="submit" disabled={loading} className="btn-primary">
                    {loading ? 'Processing...' : 'Confirm Booking'}
                </button>
            </form>
        </div>
    );
}
