import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import * as eventAPI from '../../services/events-api';

const mapContainerStyle = {
  width: '100%',
  height: '500px'
};

const defaultCenter = {
  lat: -1.286389,
  lng: 36.817223
};

// Predefined colors for categories
const CATEGORY_COLORS = {
  music: '#FF5733',
  sports: '#33FF57',
  art: '#3357FF',
  food: '#F033FF',
  business: '#33FFF5',
  default: '#FFC733',
  conference: '#FF33A1',
  theatre: '#FF33D4',
    festival: '#FF8C33',
    workshop: '#33FF8C',
    concert: '#FF3333',
};

function EventsMarkerPage() {
  const [markers, setMarkers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMarker, setSelectedMarker] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const results = await eventAPI.getAll();
        if (!results.err) {
          setMarkers(results);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  // Function to get icon configuration based on category
  const getMarkerIcon = (category) => {
    console.log("Category:", category);
    const color = CATEGORY_COLORS[category?.toLowerCase()] || CATEGORY_COLORS.default;
    console.log("Color:", color);
    return {
      path: window.google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
      fillColor: color,
      fillOpacity: 1,
      strokeWeight: 0,
      scale: 10
    };
  };

  // Replace with your actual Google Maps API key
  const googleMapsApiKey = "YOUR_GOOGLE_MAPS_API_KEY";

  return (
    <div className="EventsMarkerPage">
      <h1>Event Markers</h1>
      {isLoading ? (
        <p>Loading events...</p>
      ) : (

          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={defaultCenter}
            zoom={10}
          >
            {markers.map((event, index) => (
              <Marker
                key={index}
                position={{ lat: event.lat, lng: event.lng }}
                onClick={() => setSelectedMarker(event)}
                icon={getMarkerIcon(event.eventType)}
              />
            ))}

            {selectedMarker && (
              <InfoWindow
                position={{ lat: selectedMarker.lat, lng: selectedMarker.lng }}
                onCloseClick={() => setSelectedMarker(null)}
              >
                <div>
                  <h3>{selectedMarker.title || 'Event'}</h3>
                  <p>{selectedMarker.description || ''}</p>
                  {selectedMarker.category && <p>Category: {selectedMarker.category}</p>}
                </div>
              </InfoWindow>
            )}
          </GoogleMap>

      )}
      {!isLoading && markers.length === 0 && <p>No events found.</p>}
    </div>
  );
}

export default EventsMarkerPage;