function encodeToBase64ForUrl(input : string) {
    const base64 = btoa(input); 
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); 
}

export default encodeToBase64ForUrl