export function byteArrayToDataUrl(byteArray, mimeType = 'image/jpeg') {
    const binary = String.fromCharCode(...new Uint8Array(byteArray));
    const base64 = window.btoa(binary);
    return `data:${mimeType};base64,${base64}`;
}
