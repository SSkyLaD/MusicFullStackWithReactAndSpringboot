function hexString(buffer : ArrayBuffer) {
    const byteArray = new Uint8Array(buffer);
    const hexCodes = [...byteArray].map(byte => {
        const hexCode = byte.toString(16);
        return hexCode.padStart(2, '0');
    });
    return hexCodes.join('');
}

async function sha256(message : string) {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    const checkSum = await crypto.subtle.digest('SHA-256', data);
    return hexString(checkSum);
}

export default sha256

