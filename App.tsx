import React, { useState, useCallback } from 'react';
import { MapContainer } from './components/MapContainer';
import { AddressPanel } from './components/AddressPanel';
import { GeocoderResult, KakaoMap } from './types';
import { getCurrentLocation } from './services/mapService';
import { CompassIcon } from './components/Icons';

function App() {
  const [addressInfo, setAddressInfo] = useState<GeocoderResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mapInstance, setMapInstance] = useState<KakaoMap | null>(null);

  const handleAddressUpdate = useCallback((info: GeocoderResult | null) => {
    setAddressInfo(info);
  }, []);

  const handleLoadingChange = useCallback((loading: boolean) => {
    setIsLoading(loading);
  }, []);

  const handleMoveToCurrentLocation = async () => {
    if (!mapInstance) return;
    
    // Optimistic loading state
    setIsLoading(true);
    try {
      const pos = await getCurrentLocation();
      const moveLatLon = new window.kakao.maps.LatLng(pos.lat, pos.lng);
      mapInstance.panTo(moveLatLon);
      // The 'idle' event on map will trigger the address update, but we can keep loading true briefly
    } catch (error) {
      alert("현재 위치를 가져올 수 없습니다. 위치 권한을 확인해주세요.");
      setIsLoading(false);
    }
  };

  const handleShare = async () => {
    if (!addressInfo) return;

    const title = '위치 공유';
    const text = addressInfo.road_address 
      ? `${addressInfo.road_address.address_name}\n(${addressInfo.address.address_name})`
      : addressInfo.address.address_name;
    
    // Create a link to Kakao Map or Google Map
    // Getting current center
    let url = window.location.href;
    if (mapInstance) {
        const center = mapInstance.getCenter();
        // Construct a daum map url for better utility
        // https://map.kakao.com/link/map/Address,lat,lng (Requires name, but we can use address)
        // Or simpler: just share the text.
    }

    const shareData = {
      title: title,
      text: `[주소 공유]\n${text}`,
      url: url,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`);
        alert('주소가 클립보드에 복사되었습니다.');
      } catch (err) {
        alert('공유 기능을 지원하지 않는 브라우저입니다.');
      }
    }
  };

  return (
    <div className="relative w-full h-full overflow-hidden flex flex-col">
      {/* Map Layer */}
      <div className="flex-1 relative z-0">
        <MapContainer 
          onAddressUpdate={handleAddressUpdate} 
          onLoadingChange={handleLoadingChange}
          setMapRef={setMapInstance}
        />
        
        {/* Floating Controls Layer */}
        <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
           <button
            onClick={handleMoveToCurrentLocation}
            className="bg-white p-3 rounded-full shadow-md text-gray-700 hover:text-blue-600 active:bg-gray-50 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            aria-label="현재 위치로 이동"
          >
            <CompassIcon className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Bottom Panel Layer */}
      <div className="relative z-20">
        <AddressPanel 
          addressInfo={addressInfo} 
          isLoading={isLoading} 
          onShare={handleShare} 
        />
      </div>
    </div>
  );
}

export default App;