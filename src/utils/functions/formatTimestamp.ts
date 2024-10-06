export default function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const hours = date.getUTCHours().toString().padStart(2, '0'); // Usa getUTCHours
    const minutes = date.getUTCMinutes().toString().padStart(2, '0'); // Usa getUTCMinutes
    return `${hours}:${minutes}`;
}
