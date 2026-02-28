export const isMobile = (): boolean => {
    const userAgent = navigator.userAgent || navigator.vendor || (window as unknown as { opera?: string }).opera;
    const result = /android/i.test(userAgent || '') || /iPad|iPhone|iPod/.test(userAgent || '');
    console.log('[isMobile] userAgent:', userAgent, '-> result:', result);
    return result;
};

export const getOS = (): 'ios' | 'android' | 'other' => {
    const userAgent = navigator.userAgent || navigator.vendor || (window as unknown as { opera?: string }).opera;
    let result: 'ios' | 'android' | 'other' = 'other';
    if (/android/i.test(userAgent || '')) {
        result = 'android';
    } else if (/iPad|iPhone|iPod/.test(userAgent || '')) {
        result = 'ios';
    }
    console.log('[getOS] userAgent:', userAgent, '-> result:', result);
    return result;
};

export const isPWA = (): boolean => {
    const displayModeStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const navigatorStandalone = (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    const searchStandalone = window.location.search.includes('standalone=true');
    const result = displayModeStandalone || navigatorStandalone || searchStandalone;
    console.log('[isPWA] displayModeStandalone:', displayModeStandalone, 'navigatorStandalone:', navigatorStandalone, 'searchStandalone:', searchStandalone, '-> result:', result);
    return result;
};
