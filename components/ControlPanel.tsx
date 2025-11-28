import React from 'react';
import { LocationInfo } from '../types';
import { Copy, Navigation, Share2, MapPin } from 'lucide-react';

interface ControlPanelProps {
  locationInfo: LocationInfo;
  memo: string;
  setMemo: (val: string) => void;
  onGetCurrentLocation: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({ locationInfo, memo, setMemo, onGetCurrentLocation }) => {

  const handleCopy = () => {
    const url = `${window.location.origin}?lat=${locationInfo.lat}&lng=${locationInfo.lng}&content=${encodeURIComponent(memo)}`;
    navigator.clipboard.writeText(url).then(() => {
        alert('공유 URL이 복사되었습니다!');
    }).catch(() => {
        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = url;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        alert('공유 URL이 복사되었습니다!');
    });
  };

  const handleKakaoShare = () => {
    if (!window.Kakao) return;
    const url = `${window.location.origin}?lat=${locationInfo.lat}&lng=${locationInfo.lng}&content=${encodeURIComponent(memo)}`;
    
    window.Kakao.Share.sendDefault({
      objectType: 'location',
      address: locationInfo.address,
      addressTitle: '지도찍어주소 공유',
      content: {
        title: '위치 공유',
        description: memo || locationInfo.address,
        imageUrl: 'https://maptoaddr.netlify.app/logo.png', // Assuming logo exists
        link: {
          mobileWebUrl: url,
          webUrl: url,
        },
      },
      buttons: [
        {
          title: '지도 보기',
          link: {
            mobileWebUrl: url,
            webUrl: url,
          },
        },
      ],
    });
  };

  return (
    <div className="flex flex-col gap-3">
        {/* Memo Input */}
        <input 
            type="text" 
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="메모를 입력하세요 (선택)"
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
        />

        {/* Action Buttons Grid */}
        <div className="grid grid-cols-4 gap-2">
            <button 
                onClick={onGetCurrentLocation}
                className="flex flex-col items-center justify-center p-2 rounded-xl bg-white border border-gray-200 shadow-sm active:scale-95 transition-transform hover:bg-gray-50 text-indigo-600"
            >
                <MapPin size={20} className="mb-1" />
                <span className="text-[10px] font-bold">내위치</span>
            </button>

            <button 
                onClick={handleCopy}
                className="flex flex-col items-center justify-center p-2 rounded-xl bg-white border border-gray-200 shadow-sm active:scale-95 transition-transform hover:bg-gray-50 text-gray-700"
            >
                <Copy size={20} className="mb-1" />
                <span className="text-[10px] font-bold">복사</span>
            </button>

            <button 
                onClick={handleKakaoShare}
                className="flex flex-col items-center justify-center p-2 rounded-xl bg-[#FEE500] border border-[#FEE500] shadow-sm active:scale-95 transition-transform hover:bg-[#E6CF00] text-black"
            >
                <Share2 size={20} className="mb-1" />
                <span className="text-[10px] font-bold">카톡</span>
            </button>
            
            <a 
                href={`https://map.kakao.com/link/to/${locationInfo.address},${locationInfo.lat},${locationInfo.lng}`}
                target="_blank"
                rel="noreferrer"
                className="flex flex-col items-center justify-center p-2 rounded-xl bg-blue-500 border border-blue-500 shadow-sm active:scale-95 transition-transform hover:bg-blue-600 text-white"
            >
                <Navigation size={20} className="mb-1" />
                <span className="text-[10px] font-bold">길찾기</span>
            </a>
        </div>
    </div>
  );
};