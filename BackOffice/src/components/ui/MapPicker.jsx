import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon not showing
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const MapEvents = ({ onLocationClick }) => {
  useMapEvents({
    click(e) {
      onLocationClick(e.latlng);
    },
  });
  return null;
};

const MapPicker = ({ lat, lng, onLocationSelect }) => {
  const center = lat && lng ? [lat, lng] : [41.1561, 1.1033]; // Default center
  const zoom = 15;

  return (
    <MapContainer center={center} zoom={zoom} style={{ height: '200px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {lat && lng && <Marker position={[lat, lng]} />}
      <MapEvents onLocationClick={onLocationSelect} />
    </MapContainer>
  );
};

export default MapPicker;
