import React, { useEffect, useRef, useState, useCallback } from 'react';
import { KakaoMap, GeocoderResult } from '../types';
import { coord2Address, getCurrentLocation } from '../services/mapService';
import { MarkerIcon, CompassIcon } from './Icons';

interface MapContainerProps {
  onAddressUpdate: (info: GeocoderResult | null) => void;
  onLoadingChange: (isLoading: boolean) => void;
  setMapRef: (map: KakaoMap | null) => void;
}

export const MapContainer: React.FC<MapContainerProps> = ({ onAddressUpdate, onLoadingChange, setMapRef }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<KakaoMap | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);

  // Initialize Map
  useEffect(() => {
    const initializeMap = () => {
      if (!window.kakao || !window.kakao.maps) {
        // Retry if script not loaded yet (though window.kakao should be there due to load callback logic if we had it, but generic polling is safe)
        setTimeout(initializeMap, 100);
        return;
      }

      window.kakao.maps.load(() => {
        if (!mapContainerRef.current) return;

        const options = {
          center: new window.kakao.maps.LatLng(37.566826, 126.9786567), // Seoul City Hall default
          level: 3,
        };

        const map = new window.kakao.maps.Map(mapContainerRef.current, options);
        mapInstance.current = map;
        setMapRef(map);
        setIsMapReady(true);

        // Try to get initial location
        getCurrentLocation().then(pos => {
          const moveLatLon = new window.kakao.maps.LatLng(pos.lat, pos.lng);
          map.setCenter(moveLatLon);
          // Initial trigger will be handled by idle listener or manually call it
          updateAddress(pos.lat, pos.lng); 
        }).catch(() => {
            // If failed, just use default
            updateAddress(37.566826, 126.9786567);
        });

        // Add idle listener (fired when drag ends or zoom ends)
        window.kakao.maps.event.addListener(map, 'idle', () => {
          const center = map.getCenter();
          updateAddress(center.getLat(), center.getLng());
        });
      });
    };

    initializeMap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateAddress = useCallback(async (lat: number, lng: number) => {
    onLoadingChange(true);
    try {
      const result = await coord2Address(lat, lng);
      onAddressUpdate(result);
    } catch (error) {
      console.error("Geocoding failed", error);
      onAddressUpdate(null);
    } finally {
      onLoadingChange(false);
    }
  }, [onAddressUpdate, onLoadingChange]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainerRef} className="w-full h-full bg-gray-200 z-0" />
      
      {/* Center Marker Fixed Overlay */}
      {isMapReady && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-full pointer-events-none z-10" style={{ marginTop: '-2px' }}>
          <MarkerIcon className="w-10 h-10 text-red-500" />
          <div className="w-2 h-2 bg-black/20 rounded-full mx-auto mt-[-4px] blur-[2px]"></div>
        </div>
      )}
    </div>
  );
};