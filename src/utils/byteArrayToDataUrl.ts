export function byteArrayToDataUrl(byteArray) {
    return `data:image/jpeg;base64,${byteArray}`;
}

export function byteArrayToBase64ToDataUrl(byteArray) {
    const base64String = btoa(
        new Uint8Array(byteArray)
            .reduce((data, byte) => data + String.fromCharCode(byte), '')
    );
    return `data:image/jpeg;base64,${base64String}`;
}
