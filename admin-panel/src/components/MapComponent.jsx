import React from 'react';
import { GoogleMap, LoadScript } from '@react-google-maps/api';

const MapComponent = ({ lat, lng }) => {
  const mapStyles = {
    height: '50vh',
    width: '50%',
  };

  const defaultCenter = {
    lat: lat || 40.712776, // Default latitude (New York)
    lng: lng || -74.005974, // Default longitude (New York)
  };
  return (
    <LoadScript googleMapsApiKey="YOUR_API_KEY">
      <GoogleMap
        mapContainerStyle={mapStyles}
        zoom={13}
        center={defaultCenter}
      />
    </LoadScript>
  );
};

export default MapComponent;
