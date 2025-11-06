import React, { useCallback, useState } from 'react';
import { GoogleMap, LoadScript, Marker, Polyline, InfoWindow } from '@react-google-maps/api';
import type { Activity, Transportation } from '../types';
import { MapPin, Navigation } from 'lucide-react';

interface MapViewProps {
  activities: Activity[];
  transportation: Transportation[];
  center?: { lat: number; lng: number };
}

const containerStyle = {
  width: '100%',
  height: '500px',
  borderRadius: '12px',
};

const defaultCenter = {
  lat: 35.1796,
  lng: 129.0756,
};

// Demo API key - In production, use environment variable
const GOOGLE_MAPS_API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY';

const MapView: React.FC<MapViewProps> = ({ activities, transportation, center }) => {
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

  const mapCenter = center || defaultCenter;

  // Calculate route path from transportation data
  const routePath = transportation.flatMap((t) => t.route || []);

  const onLoad = useCallback((map: google.maps.Map) => {
    const bounds = new window.google.maps.LatLngBounds();

    activities.forEach((activity) => {
      bounds.extend({
        lat: activity.location.lat,
        lng: activity.location.lng,
      });
    });

    if (activities.length > 0) {
      map.fitBounds(bounds);
    }
  }, [activities]);

  return (
    <div className="relative">
      {/* Fallback UI for demo without API key */}
      {GOOGLE_MAPS_API_KEY === 'YOUR_GOOGLE_MAPS_API_KEY' ? (
        <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl p-8" style={containerStyle}>
          <div className="flex flex-col items-center justify-center h-full space-y-4">
            <MapPin className="w-16 h-16 text-blue-600" />
            <h3 className="text-xl font-bold text-gray-800">지도 미리보기</h3>
            <p className="text-gray-600 text-center max-w-md">
              실제 서비스에서는 Google Maps API를 통해<br />
              실시간 경로와 위치를 시각화합니다.
            </p>
            <div className="bg-white rounded-lg p-6 shadow-lg max-w-md">
              <h4 className="font-semibold text-gray-800 mb-3">표시될 정보:</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <Navigation className="w-4 h-4 mr-2 text-blue-600 mt-0.5" />
                  <span>출발지 → 목적지 이동 경로</span>
                </li>
                <li className="flex items-start">
                  <MapPin className="w-4 h-4 mr-2 text-red-600 mt-0.5" />
                  <span>관광지, 맛집 위치 마커</span>
                </li>
                <li className="flex items-start">
                  <MapPin className="w-4 h-4 mr-2 text-green-600 mt-0.5" />
                  <span>대중교통 경로 시각화</span>
                </li>
              </ul>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              Google Maps API 키를 설정하면 실제 지도가 표시됩니다.
            </p>
          </div>
        </div>
      ) : (
        <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={mapCenter}
            zoom={12}
            onLoad={onLoad}
            options={{
              styles: [
                {
                  featureType: 'poi',
                  elementType: 'labels',
                  stylers: [{ visibility: 'off' }],
                },
              ],
            }}
          >
            {/* Activity Markers */}
            {activities.map((activity, index) => (
              <Marker
                key={activity.id}
                position={{
                  lat: activity.location.lat,
                  lng: activity.location.lng,
                }}
                label={{
                  text: `${index + 1}`,
                  color: 'white',
                  fontWeight: 'bold',
                }}
                onClick={() => setSelectedActivity(activity)}
              />
            ))}

            {/* Route Polyline */}
            {routePath.length > 0 && (
              <Polyline
                path={routePath}
                options={{
                  strokeColor: '#3B82F6',
                  strokeOpacity: 0.8,
                  strokeWeight: 4,
                }}
              />
            )}

            {/* Info Window */}
            {selectedActivity && (
              <InfoWindow
                position={{
                  lat: selectedActivity.location.lat,
                  lng: selectedActivity.location.lng,
                }}
                onCloseClick={() => setSelectedActivity(null)}
              >
                <div className="p-2">
                  <h3 className="font-bold text-gray-800">{selectedActivity.name}</h3>
                  <p className="text-sm text-gray-600">{selectedActivity.description}</p>
                  <p className="text-sm text-blue-600 mt-1">
                    {selectedActivity.duration} • {selectedActivity.price === 0 ? '무료' : `₩${selectedActivity.price.toLocaleString()}`}
                  </p>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </LoadScript>
      )}
    </div>
  );
};

export default MapView;
