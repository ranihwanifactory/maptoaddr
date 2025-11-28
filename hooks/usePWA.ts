import { useState, useEffect } from 'react';
import { BeforeInstallPromptEvent } from '../types';

export const usePWA = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Chrome Android 등에서 자동으로 뜨는 미니 인포바를 제어하기 위해 preventDefault()를 호출합니다.
      // 이를 통해 우리가 만든 커스텀 설치 버튼을 보여줄 수 있습니다.
      e.preventDefault();
      
      // 나중에 트리거하기 위해 이벤트를 저장합니다.
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // 설치 가능한 상태임을 UI에 알립니다.
      setIsInstallable(true);
      console.log('👋 PWA Install Prompt Captured');
    };

    const handleAppInstalled = () => {
      console.log('🎉 PWA Installed');
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const installApp = async () => {
    if (!deferredPrompt) {
        console.warn('No deferred prompt available');
        return;
    }
    
    // 브라우저의 설치 프롬프트를 실행합니다.
    deferredPrompt.prompt();
    
    // 사용자의 응답을 기다립니다.
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    
    // 프롬프트는 한 번만 사용할 수 있으므로 초기화합니다.
    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  return { isInstallable, installApp };
};