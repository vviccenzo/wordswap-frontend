export default function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const hours = date.getHours().toString()
    const minutes = date.getMinutes().toString()
    return `${hours}:${minutes}`;
}
