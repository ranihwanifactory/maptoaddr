export interface LocationInfo {
  lat: number;
  lng: number;
  address: string;
}

declare global {
  interface Window {
    kakao: any;
    Kakao: any;
  }
}

export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}