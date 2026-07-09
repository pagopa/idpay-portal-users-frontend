const getUserAgent = (): string => navigator.userAgent || navigator.vendor || '';

export const getIoAppStoreUrl = (): string => {
    const userAgent = getUserAgent();
    const isAndroid = /android/i.test(userAgent);
    const isIOS =
        (/iPad|iPhone|iPod/.test(userAgent) && !(navigator as any).msStream)
        || (navigator.platform === 'MacIntel' && (navigator as any).maxTouchPoints > 1);

    if (isAndroid) {
        return 'https://play.google.com/store/apps/details?id=it.pagopa.io.app';
    }

    if (isIOS) {
        return 'https://apps.apple.com/it/app/io/id1501681835';
    }

    return 'https://ioapp.it/scarica-io';
};

export const handleDownloadClick = () => {
    window.open(getIoAppStoreUrl(), '_blank');
};

export const parseJwt = (token: string) => {
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
        return null;
    }
};
