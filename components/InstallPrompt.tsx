import React from 'react';
import { Download } from 'lucide-react';

interface InstallPromptProps {
  onInstall: () => void;
}

export const InstallPrompt: React.FC<InstallPromptProps> = ({ onInstall }) => {
  return (
    <button
      onClick={onInstall}
      className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-bold text-sm"
      aria-label="Install App"
    >
      <Download size={18} />
      <span>앱 설치하기</span>
    </button>
  );
};