

const getDeviceFingerprint = () => {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const language = navigator.language;
    const userAgent = navigator.userAgent;
    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;
    const screenColorDepth = window.screen.colorDepth;
    const screenPixelDepth = window.screen.pixelDepth;
    const cpuCores = navigator.hardwareConcurrency;

    const deviceFingerPrint = `${timeZone}|${language}|${userAgent}|${screenWidth}|${screenHeight}|${screenColorDepth}|${screenPixelDepth}|${cpuCores}}`;

    return deviceFingerPrint
};

export default getDeviceFingerprint
