import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet.heat';
import * as eventAPI from '../../services/events-api';

const mapContainerStyle = {
    width: '100%',
    height: '500px'
};

const defaultCenter = [-1.286389, 36.817223];

function EventsVisualPage() {
    const [heatmapData, setHeatmapData] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        async function fetchData() {
            try {
                const results = await eventAPI.getAll();
                if (!results.err) {
                    const heatmapPoints = results.map(event =>
                        [event.lat, event.lng, 1]
                    );
                    setHeatmapData(heatmapPoints);
                    setIsLoaded(true);
                }
            } catch (error) {
                console.error("Error fetching events:", error);
            }
        }
        fetchData();
    }, []);

    useEffect(() => {
        if (isLoaded) {
            const map = L.map('heatmap').setView(defaultCenter, 10);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
            const heatLayer = L.heatLayer(heatmapData, { radius: 25, blur: 15, maxZoom: 17 }).addTo(map);

            return () => {
                map.removeLayer(heatLayer);
                map.remove();
            };
        }
    }, [isLoaded, heatmapData]);

    return (
        <div className="EventsVisualPage">
            <h1>Event Heatmap</h1>
            {isLoaded ? (
                <div id="heatmap" style={mapContainerStyle}></div>
            ) : (
                <p>Loading heatmap...</p>
            )}
        </div>
    );
}

export default EventsVisualPage;
