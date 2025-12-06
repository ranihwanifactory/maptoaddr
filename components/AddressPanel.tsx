import React, { useState } from 'react';
import { GeocoderResult } from '../types';
import { ShareIcon, CopyIcon } from './Icons';

interface AddressPanelProps {
  addressInfo: GeocoderResult | null;
  isLoading: boolean;
  onShare: () => void;
}

export const AddressPanel: React.FC<AddressPanelProps> = ({ addressInfo, isLoading, onShare }) => {
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  const handleCopy = async () => {
    if (!addressInfo) return;
    
    const textToCopy = addressInfo.road_address 
      ? `${addressInfo.road_address.address_name} (${addressInfo.address.address_name})`
      : addressInfo.address.address_name;

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopyFeedback("주소가 복사되었습니다.");
      setTimeout(() => setCopyFeedback(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      setCopyFeedback("복사 실패");
      setTimeout(() => setCopyFeedback(null), 2000);
    }
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 p-4 pb-8 bg-white rounded-t-3xl shadow-[0_-5px_20px_rgba(0,0,0,0.1)] transition-transform duration-300 z-20">
      <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
      
      <div className="flex flex-col gap-1 mb-6">
        {isLoading ? (
          <div className="animate-pulse space-y-3">
            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-100 rounded w-1/2"></div>
          </div>
        ) : addressInfo ? (
          <>
            <h2 className="text-xl font-bold text-gray-900 leading-tight">
              {addressInfo.road_address?.address_name || addressInfo.address.address_name}
            </h2>
            {addressInfo.road_address && (
              <p className="text-sm text-gray-500">
                [지번] {addressInfo.address.address_name}
              </p>
            )}
            {!addressInfo.road_address && (
              <p className="text-sm text-gray-500">
                지번 주소만 존재합니다.
              </p>
            )}
          </>
        ) : (
          <div className="text-gray-500 text-center py-2">
            지도를 움직여 위치를 선택해주세요.
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <button
          onClick={onShare}
          disabled={!addressInfo}
          className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-3.5 px-6 rounded-xl font-semibold active:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-blue-200"
        >
          <ShareIcon className="w-5 h-5" />
          <span>공유하기</span>
        </button>
        <button
          onClick={handleCopy}
          disabled={!addressInfo}
          className="flex items-center justify-center bg-gray-100 text-gray-700 p-3.5 rounded-xl font-semibold active:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-gray-200"
          aria-label="Copy Address"
        >
          <CopyIcon className="w-5 h-5" />
        </button>
      </div>
      
      {/* Toast Feedback */}
      {copyFeedback && (
        <div className="absolute top-[-3rem] left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-2 px-4 rounded-full shadow-lg pointer-events-none opacity-90 transition-opacity">
          {copyFeedback}
        </div>
      )}
    </div>
  );
};