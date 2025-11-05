export const handleDownloadClick = () => {
    const userAgent = navigator.userAgent || navigator.vendor || '';

    const isAndroid = /android/i.test(userAgent);
    const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !(navigator as any).msStream;

    if (isAndroid) {
        window.open('https://play.google.com/store/apps/details?id=it.pagopa.io.app', '_blank');
    } else if (isIOS) {
        window.open('https://apps.apple.com/it/app/io/id1501681835', '_blank');
    } else {
        window.open('https://ioapp.it/scarica-io', '_blank');
    }
};

export const parseJwt = (token: string) => {
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
        return null;
    }
};
