import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import TouristPlaces from './pages/TouristPlaces';
import Restaurants from './pages/Restaurants';
import Homestays from './pages/Homestays';
import Cabs from './pages/Cabs';
import PlaceDetails from './pages/PlaceDetails';
import HomestayDetails from './pages/HomestayDetails';
import BookingPage from './pages/BookingPage';
import MyBookings from './pages/MyBookings';
import TripPlanner from './pages/TripPlanner';
import MyTrips from './pages/MyTrips';
import Profile from './pages/Profile';
import CustomerDashboard from './pages/CustomerDashboard';
import OwnerDashboard from './pages/OwnerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/places" element={<TouristPlaces />} />
            <Route path="/places/:id" element={<PlaceDetails />} />
            <Route path="/restaurants" element={<Restaurants />} />
            <Route path="/homestays" element={<Homestays />} />
            <Route path="/homestays/:id" element={<HomestayDetails />} />
            <Route path="/cabs" element={<Cabs />} />
            
            {/* Trip Planner is available to all visitors */}
            <Route path="/trip-planner" element={<TripPlanner />} />
            
            {/* Customer Protected Routes */}
            <Route element={<ProtectedRoute allowedRoles={['CUSTOMER']} />}>
              <Route path="/dashboard/customer" element={<CustomerDashboard />} />
              <Route path="/bookings" element={<BookingPage />} />
              <Route path="/my-bookings" element={<MyBookings />} />
              <Route path="/my-trips" element={<MyTrips />} />
            </Route>

            {/* Owner Protected Routes */}
            <Route element={<ProtectedRoute allowedRoles={['OWNER']} />}>
              <Route path="/dashboard/owner" element={<OwnerDashboard />} />
            </Route>

            {/* Admin Protected Routes */}
            <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
              <Route path="/dashboard/admin" element={<AdminDashboard />} />
            </Route>

            {/* General Authenticated Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/profile" element={<Profile />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App;
