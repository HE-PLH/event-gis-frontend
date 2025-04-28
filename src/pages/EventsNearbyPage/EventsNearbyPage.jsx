import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../../components/PageHeader/PageHeader';
import EventCard from '../../components/EventCard/EventCard';
import * as eventAPI from '../../services/events-api';

function EventsNearbyPage(props) {
    const [events, setEvents] = useState([]);
    const [nearbyEvents, setNearbyEvents] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [userLocation, setUserLocation] = useState(null);

    useEffect(() => {
        async function fetchData() {
            const results = await eventAPI.getAll();

            if (results.err) {
                props.history.replace('/');
            } else {
                setEvents(results);
                setIsLoaded(true);
            }
        }
        fetchData();

        // Get user's current location
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setUserLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });
            },
            (error) => console.error('Error fetching location:', error),
            { enableHighAccuracy: true }
        );
    }, [props.history]);

    // Function to calculate distance between two coordinates using Haversine formula
    function getDistance(lat1, lng1, lat2, lng2) {
        const R = 6371; // Radius of the Earth in km
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLng = (lng2 - lng1) * (Math.PI / 180);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) *
                Math.cos(lat2 * (Math.PI / 180)) *
                Math.sin(dLng / 2) * Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    useEffect(() => {
        if (userLocation && events.length > 0) {
            const filteredEvents = events.filter((event) =>
                getDistance(userLocation.lat, userLocation.lng, event.lat, event.lng) <= 5000
            );
            setNearbyEvents(filteredEvents);
        }
    }, [userLocation, events]);

    return (
        <div className='EventsPage'>
            <PageHeader />

            <div className='container py-3'>
                {isLoaded ? (
                    <>
                        <h1 className="event-name">
                            <span>TembeaKenya</span>
                        </h1>
                        {props.user && <p><Link to='events/new'>New Event</Link></p>}

                        <h2>Nearby Events</h2>
                        <div className="row">
                            {nearbyEvents.length > 0 ? (
                                nearbyEvents.map((event, idx) => (
                                    <div className="col-md-6 col-lg-4" key={idx}>
                                        <EventCard event={event} idx={idx} />
                                    </div>
                                ))
                            ) : (
                                <p>No events found nearby.</p>
                            )}
                        </div>
                    </>
                ) : (
                    <p>Loading...</p>
                )}
            </div>
        </div>
    );
}

export default EventsNearbyPage;
