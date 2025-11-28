import React, { useEffect, useRef } from 'react';
import { LocationInfo } from '../types';

interface MapComponentProps {
  center: { lat: number; lng: number };
  onLocationSelect: (info: Partial<LocationInfo>) => void;
  setIsLoading: (loading: boolean) => void;
}

export const MapComponent: React.FC<MapComponentProps> = ({ center, onLocationSelect, setIsLoading }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markerInstance = useRef<any>(null);
  const geocoderInstance = useRef<any>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainer.current || !window.kakao) return;

    const { kakao } = window;
    
    kakao.maps.load(() => {
        const options = {
            center: new kakao.maps.LatLng(center.lat, center.lng),
            level: 3,
        };
        const map = new kakao.maps.Map(mapContainer.current, options);
        mapInstance.current = map;
        
        const marker = new kakao.maps.Marker({
            position: map.getCenter()
        });
        marker.setMap(map);
        markerInstance.current = marker;
        
        const geocoder = new kakao.maps.services.Geocoder();
        geocoderInstance.current = geocoder;

        // Click event
        kakao.maps.event.addListener(map, 'click', (mouseEvent: any) => {
            const latlng = mouseEvent.latLng;
            marker.setPosition(latlng);
            
            const lat = latlng.getLat();
            const lng = latlng.getLng();

            searchDetailAddrFromCoords(lng, lat);
            onLocationSelect({ lat, lng });
        });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount

  // Handle current location request
  useEffect(() => {
    const handleRequestLocation = () => {
        if (navigator.geolocation) {
            setIsLoading(true);
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    const locPosition = new window.kakao.maps.LatLng(lat, lng);

                    if (mapInstance.current && markerInstance.current) {
                        mapInstance.current.setCenter(locPosition);
                        markerInstance.current.setPosition(locPosition);
                        searchDetailAddrFromCoords(lng, lat);
                        onLocationSelect({ lat, lng });
                    }
                    setIsLoading(false);
                },
                (err) => {
                    console.error(err);
                    alert('위치 정보를 가져올 수 없습니다.');
                    setIsLoading(false);
                }
            );
        } else {
            alert('이 브라우저에서는 위치 서비스를 사용할 수 없습니다.');
        }
    };

    window.addEventListener('request-current-location', handleRequestLocation);
    return () => window.removeEventListener('request-current-location', handleRequestLocation);
  }, [onLocationSelect, setIsLoading]);

  const searchDetailAddrFromCoords = (lng: number, lat: number) => {
    if (!geocoderInstance.current) return;
    
    geocoderInstance.current.coord2Address(lng, lat, (result: any, status: any) => {
        if (status === window.kakao.maps.services.Status.OK) {
            const addr = result[0].address.address_name;
            const roadAddr = result[0].road_address ? result[0].road_address.address_name : '';
            onLocationSelect({ address: roadAddr || addr });
        }
    });
  };

  return <div ref={mapContainer} className="w-full h-full bg-gray-200" />;
};