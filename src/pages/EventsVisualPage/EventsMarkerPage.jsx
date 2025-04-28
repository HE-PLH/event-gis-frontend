import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import * as eventAPI from '../../services/events-api';
import L from 'leaflet';

// Optional: fix missing marker icon issues in some bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

const mapContainerStyle = {
    width: '100%',
    height: '500px'
};

const defaultCenter = [-1.286389, 36.817223];

function EventsMarkerPage() {
    const [markers, setMarkers] = useState([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const results = await eventAPI.getAll();
                if (!results.err) {
                    setMarkers(results); // Assuming each result has lat and lng
                }
            } catch (error) {
                console.error("Error fetching events:", error);
            }
        }
        fetchData();
    }, []);

    return (
        <div className="EventsMarkerPage">
            <h1>Event Markers</h1>
            <MapContainer center={defaultCenter} zoom={10} style={mapContainerStyle}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {markers.map((event, index) => (
                    <Marker key={index} position={[event.lat, event.lng]}>
                        <Popup>
                            {event.title || 'Event'} <br />
                            {event.description || ''}
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}

export default EventsMarkerPage;
