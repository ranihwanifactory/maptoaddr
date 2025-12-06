import { GeocoderResult } from '../types';

export const coord2Address = (lat: number, lng: number): Promise<GeocoderResult | null> => {
  return new Promise((resolve, reject) => {
    if (!window.kakao || !window.kakao.maps || !window.kakao.maps.services) {
      reject(new Error("Kakao Maps SDK not loaded"));
      return;
    }

    const geocoder = new window.kakao.maps.services.Geocoder();
    const callback = (result: GeocoderResult[], status: any) => {
      if (status === window.kakao.maps.services.Status.OK) {
        resolve(result[0]);
      } else {
        resolve(null);
      }
    };

    geocoder.coord2Address(lng, lat, callback);
  });
};

export const getCurrentLocation = (): Promise<{ lat: number; lng: number }> => {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          reject(error);
        },
        { enableHighAccuracy: true }
      );
    } else {
      reject(new Error("Geolocation not supported"));
    }
  });
};