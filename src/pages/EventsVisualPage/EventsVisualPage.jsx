import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import * as eventAPI from '../../services/events-api';

const mapContainerStyle = {
    width: '100%',
    height: '500px'
};

const defaultCenter = {
    lat: -1.286389,
    lng: 36.817223
};

function EventsMapPage() {
    const [events, setEvents] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        async function fetchData() {
            const results = await eventAPI.getAll();
            if (!results.err) {
                setEvents(results);
                setIsLoaded(true);
            }
        }
        fetchData();
    }, []);

    return (
        <div className="EventsMapPage">
            <h1>Event Locations</h1>
            {isLoaded ? (
                <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
                    <GoogleMap mapContainerStyle={mapContainerStyle} center={defaultCenter} zoom={10}>
                        {events.map((event, idx) => (
                            <Marker key={idx} position={{ lat: event.lat, lng: event.lng }} title={event.name} />
                        ))}
                    </GoogleMap>
                </LoadScript>
            ) : (
                <p>Loading map...</p>
            )}
        </div>
    );
}

export default EventsVisualPage;
