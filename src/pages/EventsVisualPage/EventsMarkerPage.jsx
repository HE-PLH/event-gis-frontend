import React, { useEffect, useState, useRef } from 'react';
import * as eventAPI from '../../services/events-api';

const mapContainerStyle = {
  width: '100%',
  height: '500px'
};

const defaultCenter = { lat: -1.286389, lng: 36.817223 }; // Nairobi

function EventsMarkerPage() {
  const [markers, setMarkers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const mapRef = useRef(null);
  const googleMapRef = useRef(null);
  const markersRef = useRef([]);

  // Initialize the map
  useEffect(() => {
    const loadGoogleMaps = () => {
      if (!window.google) {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY&libraries=places`;
        script.onload = initializeMap;
        document.head.appendChild(script);
      } else {
        initializeMap();
      }
    };

    const initializeMap = () => {
      const map = new window.google.maps.Map(mapRef.current, {
        center: defaultCenter,
        zoom: 2,
      });
      googleMapRef.current = map;
    };

    loadGoogleMaps();

    return () => {
      // Cleanup markers when component unmounts
      markersRef.current.forEach(marker => marker.setMap(null));
    };
  }, []);

  // Fetch events and add markers
  useEffect(() => {
    async function fetchData() {
      try {
        const results = await eventAPI.getAll();
        if (!results.err) {
          setMarkers(results);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  // Update markers when data changes
  useEffect(() => {
    if (!googleMapRef.current || markers.length === 0) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // Create new markers
    const bounds = new window.google.maps.LatLngBounds();
    markers.forEach(event => {
      if (event.lat && event.lng) {
        const marker = new window.google.maps.Marker({
          position: { lat: event.lat, lng: event.lng },
          map: googleMapRef.current,
          title: event.name || 'Event'
        });

        // Add info window
        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <strong>${event.name || 'Event'}</strong><br />
            ${event.description || ''}
          `
        });

        marker.addListener('click', () => {
          infoWindow.open(googleMapRef.current, marker);
        });

        markersRef.current.push(marker);
        bounds.extend(marker.getPosition());
      }
    });

    // Fit bounds if we have markers
    if (markersRef.current.length > 0) {
      googleMapRef.current.fitBounds(bounds, { padding: 50 });
    }
  }, [markers]);

  return (
    <div className="EventsMarkerPage">
      <h1>Event Markers</h1>
      {console.log('Markers:', markers)}

      <div ref={mapRef} style={mapContainerStyle} />

      {/* Loading and no events messages */}
      {isLoading && <p>Loading events...</p>}
      {!isLoading && markers.length === 0 && <p>No events found.</p>}
    </div>
  );
}

export default EventsMarkerPage;