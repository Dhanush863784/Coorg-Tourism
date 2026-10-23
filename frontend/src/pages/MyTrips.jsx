import { useState, useEffect } from 'react';
import { getMyTrips } from '../api/tripApi';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

export default function MyTrips() {
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        getMyTrips()
            .then(setTrips)
            .catch(err => setError(err.message || 'Failed to load trips'))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorMessage message={error} />;

    return (
        <div>
            <h2>My Trips</h2>
            {trips.length === 0 ? <p>You have no trips planned. Go to Trip Planner to create one!</p> : (
                <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                    {trips.map(trip => (
                        <div key={trip.id} style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                            <h3>{trip.title}</h3>
                            <p><strong>Duration:</strong> {trip.numberOfDays} Days</p>
                            <p><strong>From:</strong> {trip.startDate}</p>
                            <p><strong>To:</strong> {trip.endDate}</p>
                            <p><strong>Created:</strong> {new Date(trip.createdAt).toLocaleDateString()}</p>
                            <button className="btn-secondary" style={{ marginTop: '10px', width: '100%' }}>View Details</button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
