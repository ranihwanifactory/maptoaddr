export interface KakaoLatLng {
  getLat: () => number;
  getLng: () => number;
}

export interface KakaoMap {
  setCenter: (latlng: KakaoLatLng) => void;
  getCenter: () => KakaoLatLng;
  panTo: (latlng: KakaoLatLng) => void;
  relayout: () => void;
  getLevel: () => number;
  setLevel: (level: number) => void;
}

export interface AddressResult {
  address_name: string;
  region_1depth_name: string;
  region_2depth_name: string;
  region_3depth_name: string;
  mountain_yn: string;
  main_address_no: string;
  sub_address_no: string;
  zip_code: string;
}

export interface RoadAddressResult {
  address_name: string;
  region_1depth_name: string;
  region_2depth_name: string;
  region_3depth_name: string;
  road_name: string;
  underground_yn: string;
  main_building_no: string;
  sub_building_no: string;
  building_name: string;
  zone_no: string;
}

export interface GeocoderResult {
  road_address: RoadAddressResult | null;
  address: AddressResult;
}

declare global {
  interface Window {
    kakao: any;
  }
}