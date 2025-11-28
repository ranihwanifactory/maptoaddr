import React, { useState, useEffect, useCallback } from 'react';
import { MapComponent } from './components/MapComponent';
import { ControlPanel } from './components/ControlPanel';
import { InstallPrompt } from './components/InstallPrompt';
import { usePWA } from './hooks/usePWA';
import { LocationInfo } from './types';

const App: React.FC = () => {
  const [locationInfo, setLocationInfo] = useState<LocationInfo>({
    lat: 37.566826,
    lng: 126.9786567,
    address: '지도를 클릭하면 주소가 표시됩니다.',
  });
  const [memo, setMemo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { isInstallable, installApp } = usePWA();

  // Load Kakao SDK for sharing
  useEffect(() => {
    if (window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init('7e88cf2e2962d67bb246f38f504dc200');
    }
  }, []);

  const handleLocationUpdate = useCallback((newInfo: Partial<LocationInfo>) => {
    setLocationInfo((prev) => ({ ...prev, ...newInfo }));
  }, []);

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden bg-gray-100 font-sans text-gray-900">
      {/* Map Background */}
      <div className="absolute inset-0 z-0">
        <MapComponent 
          center={{ lat: locationInfo.lat, lng: locationInfo.lng }}
          onLocationSelect={handleLocationUpdate}
          setIsLoading={setIsLoading}
        />
      </div>

      {/* Header / Brand */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
        <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-white/50 flex items-center gap-2">
            <span className="text-indigo-600 font-black text-lg">📍 지도찍어주소</span>
        </div>
      </div>

      {/* Install Button (PWA) */}
      {isInstallable && (
        <div className="absolute top-4 right-4 z-10 animate-bounce">
          <InstallPrompt onInstall={installApp} />
        </div>
      )}

      {/* Loading Indicator */}
      {isLoading && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-white/90 px-6 py-4 rounded-xl shadow-2xl flex flex-col items-center gap-3 backdrop-blur-sm">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="font-semibold text-gray-700">위치 확인 중...</span>
        </div>
      )}

      {/* Bottom Controls */}
      <div className="absolute bottom-0 left-0 right-0 z-20 p-4 pb-6 bg-gradient-to-t from-white/95 via-white/90 to-transparent pt-12">
        <div className="max-w-md mx-auto w-full bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/50 overflow-hidden">
            
            {/* Info Display */}
            <div className="p-4 border-b border-gray-100">
                <div className="flex justify-between items-center text-xs text-gray-500 font-mono mb-2 bg-gray-50 p-2 rounded-lg">
                    <span>LAT: {locationInfo.lat.toFixed(6)}</span>
                    <span>LNG: {locationInfo.lng.toFixed(6)}</span>
                </div>
                <div className="text-base font-bold text-gray-800 leading-tight break-keep min-h-[3rem] flex items-center">
                    {locationInfo.address}
                </div>
            </div>

            {/* Controls */}
            <div className="p-2 bg-gray-50/50">
                <ControlPanel 
                    locationInfo={locationInfo} 
                    memo={memo} 
                    setMemo={setMemo} 
                    onGetCurrentLocation={() => {
                        // Triggered from MapComponent via a ref or context normally, 
                        // but simplified here: we pass a signal or use a global event.
                        // For this simple app, we can just reload or dispatch a custom event
                        window.dispatchEvent(new CustomEvent('request-current-location'));
                    }}
                />
            </div>
        </div>
      </div>
    </div>
  );
};

export default App;