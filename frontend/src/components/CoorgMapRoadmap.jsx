import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Navigation, MapPin, Compass, ExternalLink } from 'lucide-react';

export default function CoorgMapRoadmap({ 
    homestayName = 'Misty Woods Coffee Estate Stay', 
    homestayLocation = 'Madikeri, Coorg',
    homestayCoords = [12.4205, 75.7410],
    places = [],
    activeDay = null
}) {
    const mapContainerRef = useRef(null);
    const mapInstanceRef = useRef(null);

    // Default top curated Coorg tourist places if none passed
    const defaultPlaces = [
        {
            id: 1,
            name: "Raja's Seat Sunset Point",
            category: 'VIEWPOINT',
            coords: [12.4172, 75.7380],
            distance: '3.2 km',
            duration: '10 mins',
            day: 1,
            fee: '₹25',
            timings: '06:00 AM - 08:00 PM',
            image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=400'
        },
        {
            id: 2,
            name: 'Abbey Falls (Abbi)',
            category: 'WATERFALL',
            coords: [12.4519, 75.7176],
            distance: '8.4 km',
            duration: '22 mins',
            day: 1,
            fee: '₹15',
            timings: '09:00 AM - 05:00 PM',
            image: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&q=80&w=400'
        },
        {
            id: 3,
            name: 'Dubare Elephant Camp & River Rafting',
            category: 'WILDLIFE',
            coords: [12.3683, 75.9056],
            distance: '29.0 km',
            duration: '48 mins',
            day: 2,
            fee: '₹100',
            timings: '09:00 AM - 11:30 AM',
            image: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&q=80&w=400'
        },
        {
            id: 4,
            name: 'Namdroling Golden Temple (Bylakuppe)',
            category: 'HERITAGE',
            coords: [12.4542, 75.9628],
            distance: '34.5 km',
            duration: '55 mins',
            day: 2,
            fee: 'Free',
            timings: '07:00 AM - 06:00 PM',
            image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=400'
        },
        {
            id: 5,
            name: 'Talacauvery (Origin of River Kaveri)',
            category: 'PILGRIMAGE',
            coords: [12.3888, 75.4962],
            distance: '44.0 km',
            duration: '1 hr 15 mins',
            day: 3,
            fee: 'Free',
            timings: '06:00 AM - 06:30 PM',
            image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=400'
        },
        {
            id: 6,
            name: 'Mandalpatti Peak (Off-Road Jeep Safari)',
            category: 'ADVENTURE',
            coords: [12.5028, 75.7278],
            distance: '18.0 km',
            duration: '45 mins',
            day: 3,
            fee: '₹50 + Safari',
            timings: '06:00 AM - 05:30 PM',
            image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=400'
        }
    ];

    const displayPlaces = places && places.length > 0 ? places : defaultPlaces;

    useEffect(() => {
        if (!mapContainerRef.current) return;

        // Clean up previous map instance if exists
        if (mapInstanceRef.current) {
            try {
                mapInstanceRef.current.remove();
            } catch {}
            mapInstanceRef.current = null;
        }

        // Wipe any residual _leaflet_id to eliminate "Map container is already initialized" error
        if (mapContainerRef.current && mapContainerRef.current._leaflet_id) {
            delete mapContainerRef.current._leaflet_id;
        }

        try {
            // Initialize Leaflet Map
            const map = L.map(mapContainerRef.current, {
                center: homestayCoords,
                zoom: 11,
                zoomControl: false
            });

            // Add sleek zoom control
            L.control.zoom({ position: 'bottomright' }).addTo(map);

            // OpenStreetMap Tile Layer
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap contributors',
                maxZoom: 18
            }).addTo(map);

            // Create Homestay Custom Marker (Terracotta / Orange Pin)
            const homestayIcon = L.divIcon({
                className: 'custom-leaflet-icon',
                html: `
                    <div style="
                        background: #D96B43;
                        color: white;
                        width: 38px;
                        height: 38px;
                        border-radius: 50% 50% 50% 0;
                        transform: rotate(-45deg);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        box-shadow: 0 4px 14px rgba(217, 107, 67, 0.45);
                        border: 2px solid white;
                    ">
                        <span style="transform: rotate(45deg); font-size: 18px;">🏡</span>
                    </div>
                `,
                iconSize: [38, 38],
                iconAnchor: [19, 38],
                popupAnchor: [0, -38]
            });

            const homestayMarker = L.marker(homestayCoords, { icon: homestayIcon }).addTo(map);
            homestayMarker.bindPopup(`
                <div style="font-family: inherit; min-width: 200px;">
                    <div style="font-size: 11px; font-weight: 800; color: #D96B43; text-transform: uppercase;">Booked Base Camp</div>
                    <h4 style="margin: 4px 0; color: #11281D; font-size: 15px;">${homestayName}</h4>
                    <p style="font-size: 12px; color: #666; margin: 0 0 8px 0;">${homestayLocation}</p>
                    <div style="font-size: 12px; font-weight: 600; color: #2D6A4F;">✓ Check-in Ready</div>
                </div>
            `);

            // Add Waypoint Tourist Markers & Build Route Polyline
            const routePoints = [homestayCoords];
            const bounds = L.latLngBounds([homestayCoords]);

            displayPlaces.forEach((place, index) => {
                const coords = place.coords || [
                    homestayCoords[0] + (Math.sin(index + 1) * 0.08), 
                    homestayCoords[1] + (Math.cos(index + 1) * 0.08)
                ];
                routePoints.push(coords);
                bounds.extend(coords);

                // Numbered Forest Green Marker
                const waypointIcon = L.divIcon({
                    className: 'custom-leaflet-icon',
                    html: `
                        <div style="
                            background: #163627;
                            color: white;
                            width: 32px;
                            height: 32px;
                            border-radius: 50%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-weight: 800;
                            font-size: 13px;
                            box-shadow: 0 4px 12px rgba(22, 54, 39, 0.35);
                            border: 2px solid #EDF3EC;
                        ">
                            ${index + 1}
                        </div>
                    `,
                    iconSize: [32, 32],
                    iconAnchor: [16, 16],
                    popupAnchor: [0, -18]
                });

                const marker = L.marker(coords, { icon: waypointIcon }).addTo(map);
                const gmapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${coords[0]},${coords[1]}`;

                marker.bindPopup(`
                    <div style="font-family: inherit; min-width: 220px;">
                        <span style="background: #E8F3EB; color: #1E4D34; font-size: 10px; font-weight: 800; padding: 2px 8px; border-radius: 12px; text-transform: uppercase;">
                            Stop ${index + 1} • Day ${place.day || 1}
                        </span>
                        <h4 style="margin: 6px 0 4px 0; color: #11281D; font-size: 15px;">${place.name}</h4>
                        <div style="font-size: 12px; color: #666; margin-bottom: 6px;">
                            ⏱️ ${place.duration || '25 mins'} drive • 🎫 Fee: ${place.fee || '₹20'}
                        </div>
                        <a href="${gmapsUrl}" target="_blank" rel="noopener noreferrer" style="
                            display: inline-flex;
                            align-items: center;
                            gap: 4px;
                            font-size: 12px;
                            font-weight: 700;
                            color: #163627;
                            text-decoration: underline;
                        ">
                            Open in Google Maps ↗
                        </a>
                    </div>
                `);
            });

            // Draw Route Line connecting Homestay to Waypoints
            L.polyline(routePoints, {
                color: '#1B4332',
                weight: 4,
                opacity: 0.85,
                dashArray: '8, 8',
                lineJoin: 'round'
            }).addTo(map);

            // Fit map bounds to show homestay and all places comfortably
            map.fitBounds(bounds, { padding: [50, 50] });

            mapInstanceRef.current = map;
        } catch (err) {
            console.warn('Map initialization safe catch:', err);
        }

        return () => {
            if (mapInstanceRef.current) {
                try {
                    mapInstanceRef.current.remove();
                } catch {}
                mapInstanceRef.current = null;
            }
            if (mapContainerRef.current && mapContainerRef.current._leaflet_id) {
                delete mapContainerRef.current._leaflet_id;
            }
        };
    }, [homestayCoords, displayPlaces]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Real-time Map Canvas */}
            <div className="map-container-box">
                <div className="map-control-banner">
                    <Compass size={16} color="#163627" />
                    <span>Real-Time Coorg Route Roadmap • {displayPlaces.length} Destinations</span>
                </div>
                <div ref={mapContainerRef} style={{ width: '100%', height: '100%', minHeight: '440px' }} />
            </div>

            {/* RedBus-Style Waypoint Sequence Timeline */}
            <div style={{ background: '#fff', borderRadius: '24px', padding: '24px', border: '1px solid rgba(18,40,29,0.08)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ background: '#E8F3EB', color: '#163627', padding: '6px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: '800' }}>
                            LIVE ITINERARY MILESTONES
                        </div>
                        <span style={{ fontSize: '13px', color: '#7E9085' }}>Like RedBus live tracking</span>
                    </div>
                    <span style={{ fontSize: '13px', fontWeight: '700', color: '#2D6A4F' }}>● Live Route Active</span>
                </div>

                <div className="route-timeline-container">
                    {/* Origin: Booked Homestay */}
                    <div className="waypoint-step">
                        <div className="waypoint-dot homestay-dot">🏡</div>
                        <div className="waypoint-info" style={{ borderLeft: '4px solid #D96B43' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <span style={{ fontSize: '11px', fontWeight: '800', color: '#D96B43', textTransform: 'uppercase' }}>
                                        Booked Stay & Departure Point
                                    </span>
                                    <h4 className="waypoint-title">{homestayName}</h4>
                                    <p style={{ fontSize: '13px', color: '#666', margin: 0 }}>{homestayLocation}</p>
                                </div>
                                <span style={{ background: '#FEF3EE', color: '#D96B43', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '800' }}>
                                    Base Camp
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Sequential Waypoints */}
                    {displayPlaces.map((place, idx) => (
                        <div key={place.id || idx} className="waypoint-step">
                            <div className="waypoint-dot">{idx + 1}</div>
                            <div className="waypoint-info">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                                            <span style={{ background: '#E8F3EB', color: '#1B4332', padding: '2px 8px', borderRadius: '8px', fontSize: '11px', fontWeight: '800' }}>
                                                Day {place.day || Math.floor(idx / 2) + 1}
                                            </span>
                                            <span style={{ fontSize: '12px', color: '#7E9085', fontWeight: '600' }}>
                                                {place.distance || `${(idx + 1) * 7.5} km`} from stay
                                            </span>
                                        </div>
                                        <h4 className="waypoint-title">{place.name}</h4>
                                    </div>
                                    <a 
                                        href={`https://www.google.com/maps/dir/?api=1&destination=${place.coords ? `${place.coords[0]},${place.coords[1]}` : encodeURIComponent(place.name + ' Coorg')}`}
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="btn-sage"
                                        style={{ padding: '6px 14px', fontSize: '12px', borderRadius: '999px' }}
                                    >
                                        <Navigation size={13} /> Navigate
                                    </a>
                                </div>
                                <div className="waypoint-meta" style={{ marginTop: '8px' }}>
                                    <span>⏱️ Est. Drive: {place.duration || '20 mins'}</span>
                                    <span>🎫 Entry: {place.fee || '₹20'}</span>
                                    <span>🕒 Timings: {place.timings || '09:00 AM - 05:30 PM'}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
