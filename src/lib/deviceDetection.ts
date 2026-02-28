export const isMobile = (): boolean => {
    const userAgent = navigator.userAgent || navigator.vendor || (window as unknown as { opera?: string }).opera;
    return /android/i.test(userAgent || '') || /iPad|iPhone|iPod/.test(userAgent || '');
};

export const getOS = (): 'ios' | 'android' | 'other' => {
    const userAgent = navigator.userAgent || navigator.vendor || (window as unknown as { opera?: string }).opera;
    if (/android/i.test(userAgent || '')) {
        return 'android';
    }
    if (/iPad|iPhone|iPod/.test(userAgent || '')) {
        return 'ios';
    }
    return 'other';
};

export const isPWA = (): boolean => {
    return window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as unknown as { standalone?: boolean }).standalone === true ||
        window.location.search.includes('standalone=true'); // For testing/fallback
};
