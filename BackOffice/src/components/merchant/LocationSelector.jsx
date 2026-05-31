import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';

// Fix for Leaflet default icon issues in Vite
// We use CDN URLs to avoid bundling issues with binary assets
const iconUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png';
const iconRetinaUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png';
const shadowUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Component to handle map clicks
const MapEvents = ({ onLocationSelect }) => {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

// Component to update map center when props change
const ChangeView = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center, map]);
  return null;
};

const LocationSelector = ({ 
  latitude, 
  longitude, 
  onLocationSelect, 
  isEditing 
}) => {
  const hasCoords = latitude != null && longitude != null;
  const position = hasCoords ? [latitude, longitude] : [41.1544, 1.1033]; // Default center

  return (
    <div className="location-selector" style={{ height: '350px', width: '100%', borderRadius: '8px', overflow: 'hidden', marginBottom: '1rem', border: '1px solid #ddd' }}>
      <MapContainer 
        center={position} 
        zoom={15} 
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ChangeView center={position} />
        {hasCoords && (
          <Marker position={position} />
        )}
        {isEditing && (
          <MapEvents onLocationSelect={onLocationSelect} />
        )}
      </MapContainer>
      <div style={{ padding: '8px', fontSize: '0.85rem', color: '#666', backgroundColor: '#f9f9f9', borderTop: '1px solid #ddd' }}>
        {hasCoords 
          ? `Lat: ${latitude.toFixed(6)}, Lon: ${longitude.toFixed(6)}`
          : 'No location selected'
        }
        {isEditing && ' - Click on the map to change location'}
      </div>
    </div>
  );
};

export default LocationSelector;
